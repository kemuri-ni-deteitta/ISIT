use axum::{
	extract::{Path, State},
	http::StatusCode,
	Json,
};
use sqlx::PgPool;
use uuid::Uuid;

use crate::domain::department::{CreateDepartmentRequest, Department, UpdateDepartmentRequest};

pub async fn list_departments(
	State(pool): State<PgPool>,
) -> Result<Json<Vec<Department>>, (axum::http::StatusCode, String)> {
	let departments = sqlx::query_as::<_, Department>(
		"SELECT id, code, name, parent_id, active FROM departments WHERE active = true ORDER BY name"
	)
	.fetch_all(&pool)
	.await
	.map_err(|e| (axum::http::StatusCode::INTERNAL_SERVER_ERROR, format!("Database error: {}", e)))?;

	Ok(Json(departments))
}

pub async fn create_department(
	State(pool): State<PgPool>,
	Json(req): Json<CreateDepartmentRequest>,
) -> Result<(StatusCode, Json<Department>), (StatusCode, String)> {
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

	let department = sqlx::query_as::<_, Department>(
		r#"
		INSERT INTO departments (code, name, parent_id, active)
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

	Ok((StatusCode::CREATED, Json(department)))
}

pub async fn update_department(
	State(pool): State<PgPool>,
	Path(id): Path<Uuid>,
	Json(req): Json<UpdateDepartmentRequest>,
) -> Result<Json<Department>, (StatusCode, String)> {
	let existing = sqlx::query_as::<_, Department>(
		"SELECT id, code, name, parent_id, active FROM departments WHERE id = $1",
	)
	.bind(id)
	.fetch_optional(&pool)
	.await
	.map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, format!("Database error: {}", e)))?
	.ok_or_else(|| (StatusCode::NOT_FOUND, "Department not found".to_string()))?;

	let code = req.code.as_ref().unwrap_or(&existing.code);
	let name = req.name.as_ref().unwrap_or(&existing.name);
	let parent_id = req.parent_id.or(existing.parent_id);
	let active = req.active.unwrap_or(existing.active);

	let department = sqlx::query_as::<_, Department>(
		r#"
		UPDATE departments
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

	Ok(Json(department))
}

pub async fn delete_department(
	State(pool): State<PgPool>,
	Path(id): Path<Uuid>,
) -> Result<StatusCode, (StatusCode, String)> {
	let result = sqlx::query("UPDATE departments SET active = false, updated_at = NOW() WHERE id = $1")
		.bind(id)
		.execute(&pool)
		.await
		.map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, format!("Database error: {}", e)))?;

	if result.rows_affected() > 0 {
		Ok(StatusCode::NO_CONTENT)
	} else {
		Err((StatusCode::NOT_FOUND, "Department not found".to_string()))
	}
}

