use axum::{
	extract::{Path, Query, State},
	http::StatusCode,
	Json,
};
use serde::Deserialize;
use sqlx::PgPool;
use uuid::Uuid;

use crate::domain::expense::{CreateExpenseRequest, Expense, ExpenseListResponse, UpdateExpenseRequest};
use crate::repositories::expense_repo::ExpenseRepository;

#[derive(Debug, Deserialize)]
pub struct ExpenseListQuery {
	#[serde(default = "default_page")]
	pub page: u32,
	#[serde(default = "default_page_size")]
	pub page_size: u32,
	pub department_id: Option<Uuid>,
	pub category_id: Option<Uuid>,
	pub status: Option<String>,
	pub date_from: Option<chrono::NaiveDate>,
	pub date_to: Option<chrono::NaiveDate>,
}

fn default_page() -> u32 {
	1
}

fn default_page_size() -> u32 {
	20
}

pub async fn list_expenses(
	State(pool): State<PgPool>,
	Query(params): Query<ExpenseListQuery>,
) -> Result<Json<ExpenseListResponse>, (StatusCode, String)> {
	let (expenses, total) = ExpenseRepository::list(
		&pool,
		params.page,
		params.page_size,
		params.department_id,
		params.category_id,
		params.status,
		params.date_from,
		params.date_to,
	)
	.await
	.map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, format!("Database error: {}", e)))?;

	Ok(Json(ExpenseListResponse {
		expenses,
		total,
		page: params.page,
		page_size: params.page_size,
	}))
}

pub async fn get_expense(
	State(pool): State<PgPool>,
	Path(id): Path<Uuid>,
) -> Result<Json<Expense>, (StatusCode, String)> {
	let expense = ExpenseRepository::get_by_id(&pool, id)
		.await
		.map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, format!("Database error: {}", e)))?
		.ok_or_else(|| (StatusCode::NOT_FOUND, "Expense not found".to_string()))?;

	Ok(Json(expense))
}

pub async fn create_expense(
	State(pool): State<PgPool>,
	Json(req): Json<CreateExpenseRequest>,
) -> Result<(StatusCode, Json<Expense>), (StatusCode, String)> {
	// TODO: Get user ID from authentication
	// For now, use a placeholder UUID - in production, extract from JWT token
	let created_by = Uuid::parse_str("00000000-0000-0000-0000-000000000001")
		.map_err(|_| (StatusCode::INTERNAL_SERVER_ERROR, "Invalid user ID".to_string()))?;

	// Verify user exists, if not create a default one
	let user_exists: Option<bool> = sqlx::query_scalar::<_, bool>(
		"SELECT EXISTS(SELECT 1 FROM users WHERE id = $1)"
	)
	.bind(created_by)
	.fetch_optional(&pool)
	.await
	.map_err(|e| {
		tracing::error!("Failed to check user existence: {}", e);
		(StatusCode::INTERNAL_SERVER_ERROR, format!("Database error: {}", e))
	})?;
	
	let user_exists = user_exists.unwrap_or(false);

	if !user_exists {
		tracing::info!("Creating default user {}", created_by);
		// Create default user if it doesn't exist
		let result = sqlx::query(
			"INSERT INTO users (id, email, password_hash, full_name, status) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (id) DO NOTHING"
		)
		.bind(created_by)
		.bind("admin@isit.local")
		.bind("$argon2id$v=19$m=65536,t=3,p=4$dummy$hash") // Placeholder
		.bind("System Administrator")
		.bind("active")
		.execute(&pool)
		.await;
		
		match result {
			Ok(_) => tracing::info!("Default user created successfully"),
			Err(e) => {
				tracing::error!("Failed to create default user: {}", e);
				// Continue anyway - maybe user was created by another request
			}
		}
	}

	let expense = ExpenseRepository::create(&pool, &req, created_by)
		.await
		.map_err(|e| {
			tracing::error!("Failed to create expense: {}", e);
			(StatusCode::INTERNAL_SERVER_ERROR, format!("Database error: {}", e))
		})?;

	Ok((StatusCode::CREATED, Json(expense)))
}

pub async fn update_expense(
	State(pool): State<PgPool>,
	Path(id): Path<Uuid>,
	Json(req): Json<UpdateExpenseRequest>,
) -> Result<Json<Expense>, (StatusCode, String)> {
	let expense = ExpenseRepository::update(&pool, id, &req)
		.await
		.map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, format!("Database error: {}", e)))?
		.ok_or_else(|| (StatusCode::NOT_FOUND, "Expense not found".to_string()))?;

	Ok(Json(expense))
}

pub async fn delete_expense(
	State(pool): State<PgPool>,
	Path(id): Path<Uuid>,
) -> Result<StatusCode, (StatusCode, String)> {
	let deleted = ExpenseRepository::delete(&pool, id)
		.await
		.map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, format!("Database error: {}", e)))?;

	if deleted {
		Ok(StatusCode::NO_CONTENT)
	} else {
		Err((StatusCode::NOT_FOUND, "Expense not found".to_string()))
	}
}

