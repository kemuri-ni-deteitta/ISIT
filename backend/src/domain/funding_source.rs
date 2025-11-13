use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct FundingSource {
	pub id: Uuid,
	pub code: String,
	pub name: String,
	pub active: bool,
}

#[derive(Debug, Deserialize)]
pub struct CreateFundingSourceRequest {
	#[serde(default)]
	pub code: String,
	pub name: String,
	pub active: Option<bool>,
}

#[derive(Debug, Deserialize)]
pub struct UpdateFundingSourceRequest {
	pub code: Option<String>,
	pub name: Option<String>,
	pub active: Option<bool>,
}


