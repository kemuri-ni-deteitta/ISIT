use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct Category {
	pub id: Uuid,
	pub code: String,
	pub name: String,
	pub parent_id: Option<Uuid>,
	pub active: bool,
}

#[derive(Debug, Deserialize)]
pub struct CreateCategoryRequest {
	#[serde(default)]
	pub code: String,
	pub name: String,
	pub parent_id: Option<Uuid>,
	pub active: Option<bool>,
}

#[derive(Debug, Deserialize)]
pub struct UpdateCategoryRequest {
	pub code: Option<String>,
	pub name: Option<String>,
	pub parent_id: Option<Uuid>,
	pub active: Option<bool>,
}

