use axum::{
	extract::State,
	Json,
};
use sqlx::PgPool;

use crate::domain::department::Department;

pub async fn list_departments(
	State(pool): State<PgPool>,
) -> Result<Json<Vec<Department>>, (axum::http::StatusCode, String)> {
	let departments = sqlx::query_as::<_, Department>(
		"SELECT id, code, name, parent_id, active FROM departments WHERE active = true ORDER BY code"
	)
	.fetch_all(&pool)
	.await
	.map_err(|e| (axum::http::StatusCode::INTERNAL_SERVER_ERROR, format!("Database error: {}", e)))?;

	Ok(Json(departments))
}

