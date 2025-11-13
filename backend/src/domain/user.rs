use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct User {
	pub id: Uuid,
	pub email: String,
	pub full_name: Option<String>,
	pub status: String,
	pub created_at: DateTime<Utc>,
	pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Deserialize)]
pub struct CreateUserRequest {
	pub email: String,
	pub last_name: String,
	pub first_name: String,
	pub middle_name: Option<String>,
	pub role: String,
	#[serde(default)]
	pub password: String,
}

#[derive(Debug, Deserialize)]
pub struct UpdateUserRequest {
	pub email: Option<String>,
	pub last_name: Option<String>,
	pub first_name: Option<String>,
	pub middle_name: Option<String>,
	pub role: Option<String>,
	pub status: Option<String>,
}

#[derive(Debug, Serialize)]
pub struct UserWithRole {
	pub id: Uuid,
	pub email: String,
	pub full_name: Option<String>,
	pub status: String,
	pub role: String,
	pub created_at: DateTime<Utc>,
	pub updated_at: DateTime<Utc>,
}

