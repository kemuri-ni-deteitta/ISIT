use axum::{
	extract::{Path, State},
	http::StatusCode,
	Json,
};
use sqlx::PgPool;
use uuid::Uuid;

use crate::domain::user::{CreateUserRequest, UpdateUserRequest, UserWithRole};
use crate::repositories::user_repo::UserRepository;

pub async fn list_users(
	State(pool): State<PgPool>,
) -> Result<Json<Vec<UserWithRole>>, (StatusCode, String)> {
	let users = UserRepository::list(&pool)
		.await
		.map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, format!("Database error: {}", e)))?;

	Ok(Json(users))
}

pub async fn create_user(
	State(pool): State<PgPool>,
	Json(req): Json<CreateUserRequest>,
) -> Result<(StatusCode, Json<UserWithRole>), (StatusCode, String)> {
	// Build full name from parts
	let full_name = if let Some(middle) = &req.middle_name {
		format!("{} {} {}", req.last_name, req.first_name, middle)
	} else {
		format!("{} {}", req.last_name, req.first_name)
	};

	// Generate a placeholder password hash (in production, use proper hashing)
	let password_hash = if req.password.is_empty() {
		"$argon2id$v=19$m=65536,t=3,p=4$placeholder$hash".to_string()
	} else {
		// TODO: Use proper password hashing (argon2)
		format!("$argon2id$v=19$m=65536,t=3,p=4$placeholder${}", req.password)
	};

	// Create user
	let user = UserRepository::create(&pool, &req.email, &full_name, &password_hash)
		.await
		.map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, format!("Database error: {}", e)))?;

	// Assign role
	UserRepository::assign_role(&pool, user.id, &req.role)
		.await
		.map_err(|e| {
			tracing::warn!("Failed to assign role: {}", e);
			// Don't fail the request if role assignment fails
		})
		.ok();

	// Get user with role
	let users = UserRepository::list(&pool)
		.await
		.map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, format!("Database error: {}", e)))?;

	let user_with_role = users
		.into_iter()
		.find(|u| u.id == user.id)
		.ok_or_else(|| (StatusCode::INTERNAL_SERVER_ERROR, "Failed to retrieve created user".to_string()))?;

	Ok((StatusCode::CREATED, Json(user_with_role)))
}

pub async fn update_user(
	State(pool): State<PgPool>,
	Path(id): Path<Uuid>,
	Json(req): Json<UpdateUserRequest>,
) -> Result<Json<UserWithRole>, (StatusCode, String)> {
	// Build full name if name parts are provided
	let full_name = if let (Some(last), Some(first)) = (&req.last_name, &req.first_name) {
		let name = if let Some(middle) = &req.middle_name {
			format!("{} {} {}", last, first, middle)
		} else {
			format!("{} {}", last, first)
		};
		Some(name)
	} else {
		None
	};

	// Get existing user to preserve fields not being updated
	let existing = UserRepository::get_by_id(&pool, id)
		.await
		.map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, format!("Database error: {}", e)))?
		.ok_or_else(|| (StatusCode::NOT_FOUND, "User not found".to_string()))?;

	let email = req.email.as_deref().unwrap_or(&existing.email);
	let full_name = full_name.as_deref().or(existing.full_name.as_deref());
	let status = req.status.as_deref().unwrap_or(&existing.status);

	let user = UserRepository::update(&pool, id, Some(email), full_name, Some(status))
		.await
		.map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, format!("Database error: {}", e)))?
		.ok_or_else(|| (StatusCode::NOT_FOUND, "User not found".to_string()))?;

	// Update role if provided
	if let Some(role) = &req.role {
		UserRepository::assign_role(&pool, id, role)
			.await
			.map_err(|e| {
				tracing::warn!("Failed to update role: {}", e);
			})
			.ok();
	}

	// Get user with role
	let users = UserRepository::list(&pool)
		.await
		.map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, format!("Database error: {}", e)))?;

	let user_with_role = users
		.into_iter()
		.find(|u| u.id == user.id)
		.ok_or_else(|| (StatusCode::INTERNAL_SERVER_ERROR, "Failed to retrieve updated user".to_string()))?;

	Ok(Json(user_with_role))
}

pub async fn delete_user(
	State(pool): State<PgPool>,
	Path(id): Path<Uuid>,
) -> Result<StatusCode, (StatusCode, String)> {
	let deleted = UserRepository::delete(&pool, id)
		.await
		.map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, format!("Database error: {}", e)))?;

	if deleted {
		Ok(StatusCode::NO_CONTENT)
	} else {
		Err((StatusCode::NOT_FOUND, "User not found".to_string()))
	}
}

