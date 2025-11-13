use chrono::{DateTime, NaiveDate, Utc};
use serde::{Deserialize, Deserializer, Serialize};
use sqlx::FromRow;
use std::str::FromStr;
use uuid::Uuid;

fn deserialize_optional_decimal<'de, D>(deserializer: D) -> Result<Option<rust_decimal::Decimal>, D::Error>
where
	D: Deserializer<'de>,
{
	use serde::de::Error;
	let s: Option<String> = Option::deserialize(deserializer)?;
	match s {
		Some(ref s) => rust_decimal::Decimal::from_str_exact(s)
			.map(Some)
			.map_err(D::Error::custom),
		None => Ok(None),
	}
}

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct Expense {
	pub id: Uuid,
	pub department_id: Uuid,
	pub category_id: Uuid,
	#[sqlx(rename = "amount")]
	#[serde(with = "rust_decimal::serde::str")]
	pub amount: rust_decimal::Decimal,
	pub currency: String,
	pub incurred_on: NaiveDate,
	pub description: Option<String>,
	#[sqlx(rename = "status")]
	pub status: String,
	#[serde(default = "default_funding_source")]
	pub funding_source: String,
	pub performer: Option<String>,
	pub created_by: Uuid,
	pub created_at: DateTime<Utc>,
	pub updated_at: DateTime<Utc>,
}

fn default_funding_source() -> String {
	"internal".to_string()
}

#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum ExpenseStatus {
	Pending,
	Approved,
	Rejected,
	Paid,
}

impl ExpenseStatus {
	pub fn as_str(&self) -> &'static str {
		match self {
			ExpenseStatus::Pending => "pending",
			ExpenseStatus::Approved => "approved",
			ExpenseStatus::Rejected => "rejected",
			ExpenseStatus::Paid => "paid",
		}
	}

	pub fn from_str(s: &str) -> Option<Self> {
		match s {
			"pending" => Some(ExpenseStatus::Pending),
			"approved" => Some(ExpenseStatus::Approved),
			"rejected" => Some(ExpenseStatus::Rejected),
			"paid" => Some(ExpenseStatus::Paid),
			_ => None,
		}
	}
}

#[derive(Debug, Deserialize)]
pub struct CreateExpenseRequest {
	pub department_id: Uuid,
	pub category_id: Uuid,
	#[serde(with = "rust_decimal::serde::str")]
	pub amount: rust_decimal::Decimal,
	#[serde(default = "default_currency")]
	pub currency: String,
	pub incurred_on: NaiveDate,
	pub description: Option<String>,
	#[serde(default = "default_funding_source")]
	pub funding_source: String,
	pub performer: Option<String>,
}

fn default_currency() -> String {
	"USD".to_string()
}

#[derive(Debug, Deserialize)]
pub struct UpdateExpenseRequest {
	pub department_id: Option<Uuid>,
	pub category_id: Option<Uuid>,
	#[serde(default, deserialize_with = "deserialize_optional_decimal")]
	pub amount: Option<rust_decimal::Decimal>,
	pub currency: Option<String>,
	pub incurred_on: Option<NaiveDate>,
	pub description: Option<String>,
	pub status: Option<String>,
	pub funding_source: Option<String>,
	pub performer: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ExpenseListResponse {
	pub expenses: Vec<Expense>,
	pub total: i64,
	pub page: u32,
	pub page_size: u32,
}
