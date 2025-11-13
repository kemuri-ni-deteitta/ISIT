use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct Department {
	pub id: Uuid,
	pub code: String,
	pub name: String,
	pub parent_id: Option<Uuid>,
	pub active: bool,
}

#[derive(Debug, Deserialize)]
pub struct CreateDepartmentRequest {
	pub code: String,
	pub name: String,
	pub parent_id: Option<Uuid>,
	pub active: Option<bool>,
}

#[derive(Debug, Deserialize)]
pub struct UpdateDepartmentRequest {
	pub code: Option<String>,
	pub name: Option<String>,
	pub parent_id: Option<Uuid>,
	pub active: Option<bool>,
}

