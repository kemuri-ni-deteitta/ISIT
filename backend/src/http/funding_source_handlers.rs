use axum::{
	extract::{Path, State},
	http::StatusCode,
	Json,
};
use sqlx::PgPool;
use uuid::Uuid;

use crate::domain::funding_source::{CreateFundingSourceRequest, FundingSource, UpdateFundingSourceRequest};

pub async fn list_funding_sources(
	State(pool): State<PgPool>,
) -> Result<Json<Vec<FundingSource>>, (StatusCode, String)> {
	let items = sqlx::query_as::<_, FundingSource>(
		"SELECT id, code, name, active FROM funding_sources WHERE active = true ORDER BY name",
	)
	.fetch_all(&pool)
	.await
	.map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, format!("Database error: {}", e)))?;

	Ok(Json(items))
}

pub async fn create_funding_source(
	State(pool): State<PgPool>,
	Json(req): Json<CreateFundingSourceRequest>,
) -> Result<(StatusCode, Json<FundingSource>), (StatusCode, String)> {
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

	let item = sqlx::query_as::<_, FundingSource>(
		r#"
		INSERT INTO funding_sources (code, name, active)
		VALUES ($1, $2, $3)
		RETURNING id, code, name, active
		"#,
	)
	.bind(&code)
	.bind(&req.name)
	.bind(req.active.unwrap_or(true))
	.fetch_one(&pool)
	.await
	.map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, format!("Database error: {}", e)))?;

	Ok((StatusCode::CREATED, Json(item)))
}

pub async fn update_funding_source(
	State(pool): State<PgPool>,
	Path(id): Path<Uuid>,
	Json(req): Json<UpdateFundingSourceRequest>,
) -> Result<Json<FundingSource>, (StatusCode, String)> {
	let existing = sqlx::query_as::<_, FundingSource>(
		"SELECT id, code, name, active FROM funding_sources WHERE id = $1",
	)
	.bind(id)
	.fetch_optional(&pool)
	.await
	.map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, format!("Database error: {}", e)))?
	.ok_or_else(|| (StatusCode::NOT_FOUND, "Funding source not found".to_string()))?;

	let code = req.code.as_ref().unwrap_or(&existing.code);
	let name = req.name.as_ref().unwrap_or(&existing.name);
	let active = req.active.unwrap_or(existing.active);

	let updated = sqlx::query_as::<_, FundingSource>(
		r#"
		UPDATE funding_sources
		SET code = $1, name = $2, active = $3, updated_at = NOW()
		WHERE id = $4
		RETURNING id, code, name, active
		"#,
	)
	.bind(code)
	.bind(name)
	.bind(active)
	.bind(id)
	.fetch_one(&pool)
	.await
	.map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, format!("Database error: {}", e)))?;

	Ok(Json(updated))
}

pub async fn delete_funding_source(
	State(pool): State<PgPool>,
	Path(id): Path<Uuid>,
) -> Result<StatusCode, (StatusCode, String)> {
	let result = sqlx::query("UPDATE funding_sources SET active = false, updated_at = NOW() WHERE id = $1")
		.bind(id)
		.execute(&pool)
		.await
		.map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, format!("Database error: {}", e)))?;

	if result.rows_affected() > 0 {
		Ok(StatusCode::NO_CONTENT)
	} else {
		Err((StatusCode::NOT_FOUND, "Funding source not found".to_string()))
	}
}


