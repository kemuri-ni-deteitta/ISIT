use axum::{
	extract::{Path, State},
	http::StatusCode,
	Json,
};
use sqlx::PgPool;
use uuid::Uuid;

use crate::domain::category::{Category, CreateCategoryRequest, UpdateCategoryRequest};

pub async fn list_categories(
	State(pool): State<PgPool>,
) -> Result<Json<Vec<Category>>, (StatusCode, String)> {
	let categories = sqlx::query_as::<_, Category>(
		"SELECT id, code, name, parent_id, active FROM categories WHERE active = true ORDER BY name"
	)
	.fetch_all(&pool)
	.await
	.map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, format!("Database error: {}", e)))?;

	Ok(Json(categories))
}

pub async fn create_category(
	State(pool): State<PgPool>,
	Json(req): Json<CreateCategoryRequest>,
) -> Result<(StatusCode, Json<Category>), (StatusCode, String)> {
	// Generate code from name if not provided
	let code = if req.code.is_empty() {
		req.name
			.to_lowercase()
			.chars()
			.map(|c| if c.is_alphanumeric() { c } else { '_' })
			.collect::<String>()
			.chars()
			.take(50)
			.collect::<String>()
	} else {
		req.code
	};

	let category = sqlx::query_as::<_, Category>(
		r#"
		INSERT INTO categories (code, name, parent_id, active)
		VALUES ($1, $2, $3, $4)
		RETURNING id, code, name, parent_id, active
		"#,
	)
	.bind(&code)
	.bind(&req.name)
	.bind(&req.parent_id)
	.bind(req.active.unwrap_or(true))
	.fetch_one(&pool)
	.await
	.map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, format!("Database error: {}", e)))?;

	Ok((StatusCode::CREATED, Json(category)))
}

pub async fn update_category(
	State(pool): State<PgPool>,
	Path(id): Path<Uuid>,
	Json(req): Json<UpdateCategoryRequest>,
) -> Result<Json<Category>, (StatusCode, String)> {
	// Get existing category
	let existing = sqlx::query_as::<_, Category>(
		"SELECT id, code, name, parent_id, active FROM categories WHERE id = $1"
	)
	.bind(id)
	.fetch_optional(&pool)
	.await
	.map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, format!("Database error: {}", e)))?
	.ok_or_else(|| (StatusCode::NOT_FOUND, "Category not found".to_string()))?;

	let code = req.code.as_ref().unwrap_or(&existing.code);
	let name = req.name.as_ref().unwrap_or(&existing.name);
	let parent_id = req.parent_id.or(existing.parent_id);
	let active = req.active.unwrap_or(existing.active);

	let category = sqlx::query_as::<_, Category>(
		r#"
		UPDATE categories
		SET code = $1, name = $2, parent_id = $3, active = $4, updated_at = NOW()
		WHERE id = $5
		RETURNING id, code, name, parent_id, active
		"#,
	)
	.bind(code)
	.bind(name)
	.bind(&parent_id)
	.bind(active)
	.bind(id)
	.fetch_one(&pool)
	.await
	.map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, format!("Database error: {}", e)))?;

	Ok(Json(category))
}

pub async fn delete_category(
	State(pool): State<PgPool>,
	Path(id): Path<Uuid>,
) -> Result<StatusCode, (StatusCode, String)> {
	// Check if category exists
	let category_exists: bool = sqlx::query_scalar(
		"SELECT EXISTS(SELECT 1 FROM categories WHERE id = $1)"
	)
	.bind(id)
	.fetch_one(&pool)
	.await
	.map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, format!("Database error: {}", e)))?;

	if !category_exists {
		return Err((StatusCode::NOT_FOUND, "Category not found".to_string()));
	}

	// Check if category is used by any expenses
	let is_used: bool = sqlx::query_scalar(
		"SELECT EXISTS(SELECT 1 FROM expenses WHERE category_id = $1)"
	)
	.bind(id)
	.fetch_one(&pool)
	.await
	.map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, format!("Database error: {}", e)))?;

	if is_used {
		// Soft delete: set active = false (can't hard delete because expenses reference it)
		let result = sqlx::query(
			"UPDATE categories SET active = false, updated_at = NOW() WHERE id = $1"
		)
		.bind(id)
		.execute(&pool)
		.await
		.map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, format!("Database error: {}", e)))?;

		if result.rows_affected() > 0 {
			Ok(StatusCode::NO_CONTENT)
		} else {
			Err((StatusCode::INTERNAL_SERVER_ERROR, "Failed to soft delete category".to_string()))
		}
	} else {
		// Hard delete: actually remove from database (safe because no expenses use it)
		let result = sqlx::query("DELETE FROM categories WHERE id = $1")
			.bind(id)
			.execute(&pool)
			.await
			.map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, format!("Database error: {}", e)))?;

		if result.rows_affected() > 0 {
			Ok(StatusCode::NO_CONTENT)
		} else {
			Err((StatusCode::INTERNAL_SERVER_ERROR, "Failed to delete category".to_string()))
		}
	}
}

