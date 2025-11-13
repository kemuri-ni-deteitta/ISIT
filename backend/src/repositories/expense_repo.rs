use crate::domain::expense::Expense;
use chrono::NaiveDate;
use sqlx::{PgPool, Row};
use std::str::FromStr;
use uuid::Uuid;

pub struct ExpenseRepository;

impl ExpenseRepository {
	pub async fn create(
		pool: &PgPool,
		req: &crate::domain::expense::CreateExpenseRequest,
		created_by: Uuid,
	) -> Result<Expense, sqlx::Error> {
		// Convert Decimal to string for SQLx, then parse back
		let amount_str = req.amount.to_string();
		let row = sqlx::query(
			r#"
			INSERT INTO expenses (department_id, category_id, amount, currency, incurred_on, description, status, funding_source, performer, created_by)
			VALUES ($1, $2, $3::numeric, $4, $5, $6, 'pending', $7, $8, $9)
			RETURNING 
				id,
				department_id,
				category_id,
				amount::text as amount,
				currency,
				incurred_on,
				description,
				status,
				funding_source,
				performer,
				created_by,
				created_at,
				updated_at
			"#,
		)
		.bind(req.department_id)
		.bind(req.category_id)
		.bind(&amount_str)
		.bind(&req.currency)
		.bind(req.incurred_on)
		.bind(&req.description)
		.bind(&req.funding_source)
		.bind(&req.performer)
		.bind(created_by)
		.fetch_one(pool)
		.await?;

		Ok(Expense {
			id: row.try_get("id")?,
			department_id: row.try_get("department_id")?,
			category_id: row.try_get("category_id")?,
			amount: rust_decimal::Decimal::from_str_exact(row.try_get::<String, _>("amount")?.as_str()).unwrap_or_default(),
			currency: row.try_get("currency")?,
			incurred_on: row.try_get("incurred_on")?,
			description: row.try_get("description")?,
			status: row.try_get("status")?,
			funding_source: row.try_get("funding_source")?,
			performer: row.try_get("performer")?,
			created_by: row.try_get("created_by")?,
			created_at: row.try_get("created_at")?,
			updated_at: row.try_get("updated_at")?,
		})
	}

	pub async fn get_by_id(pool: &PgPool, id: Uuid) -> Result<Option<Expense>, sqlx::Error> {
		let row = sqlx::query(
			r#"
			SELECT 
				id,
				department_id,
				category_id,
				amount::text as amount,
				currency,
				incurred_on,
				description,
				status,
				funding_source,
				performer,
				created_by,
				created_at,
				updated_at
			FROM expenses
			WHERE id = $1
			"#,
		)
		.bind(id)
		.fetch_optional(pool)
		.await?;

		match row {
			Some(r) => Ok(Some(Expense {
				id: r.try_get("id")?,
				department_id: r.try_get("department_id")?,
				category_id: r.try_get("category_id")?,
				amount: rust_decimal::Decimal::from_str_exact(r.try_get::<String, _>("amount")?.as_str()).unwrap_or_default(),
				currency: r.try_get("currency")?,
				incurred_on: r.try_get("incurred_on")?,
				description: r.try_get("description")?,
				status: r.try_get("status")?,
				funding_source: r.try_get("funding_source")?,
				performer: r.try_get("performer")?,
				created_by: r.try_get("created_by")?,
				created_at: r.try_get("created_at")?,
				updated_at: r.try_get("updated_at")?,
			})),
			None => Ok(None),
		}
	}

	pub async fn list(
		pool: &PgPool,
		page: u32,
		page_size: u32,
		department_id: Option<Uuid>,
		category_id: Option<Uuid>,
		status: Option<String>,
		date_from: Option<NaiveDate>,
		date_to: Option<NaiveDate>,
	) -> Result<(Vec<Expense>, i64), sqlx::Error> {
		let offset = (page.saturating_sub(1)) * page_size;

		// Simple version first - we'll add filtering later
		let rows = sqlx::query(
			r#"
			SELECT 
				id,
				department_id,
				category_id,
				amount::text as amount,
				currency,
				incurred_on,
				description,
				status,
				funding_source,
				performer,
				created_by,
				created_at,
				updated_at
			FROM expenses
			ORDER BY incurred_on DESC, created_at DESC
			LIMIT $1 OFFSET $2
			"#,
		)
		.bind(page_size as i64)
		.bind(offset as i64)
		.fetch_all(pool)
		.await?;

		let expenses: Result<Vec<Expense>, sqlx::Error> = rows
			.into_iter()
			.map(|r| -> Result<Expense, sqlx::Error> {
				Ok(Expense {
					id: r.try_get("id")?,
					department_id: r.try_get("department_id")?,
					category_id: r.try_get("category_id")?,
					amount: rust_decimal::Decimal::from_str_exact(r.try_get::<String, _>("amount")?.as_str()).unwrap_or_default(),
					currency: r.try_get("currency")?,
					incurred_on: r.try_get("incurred_on")?,
					description: r.try_get("description")?,
					status: r.try_get("status")?,
					funding_source: r.try_get("funding_source")?,
					performer: r.try_get("performer")?,
					created_by: r.try_get("created_by")?,
					created_at: r.try_get("created_at")?,
					updated_at: r.try_get("updated_at")?,
				})
			})
			.collect();
		let expenses = expenses?;

		let total = sqlx::query_scalar::<_, i64>(
			r#"
			SELECT COUNT(*) as count
			FROM expenses
			"#,
		)
		.fetch_one(pool)
		.await?;

		Ok((expenses, total))
	}

	pub async fn update(
		pool: &PgPool,
		id: Uuid,
		req: &crate::domain::expense::UpdateExpenseRequest,
	) -> Result<Option<Expense>, sqlx::Error> {
		// For now, implement a simple version that updates all fields
		// In production, you'd want to build a dynamic UPDATE query
		let existing = Self::get_by_id(pool, id).await?;
		if existing.is_none() {
			return Ok(None);
		}

		let expense = existing.unwrap();

		let department_id = req.department_id.unwrap_or(expense.department_id);
		let category_id = req.category_id.unwrap_or(expense.category_id);
		let amount = req.amount.unwrap_or(expense.amount);
		let amount_str = amount.to_string();
		let currency = req.currency.as_ref().unwrap_or(&expense.currency).clone();
		let incurred_on = req.incurred_on.unwrap_or(expense.incurred_on);
		let description = req.description.as_ref().or(expense.description.as_ref()).cloned();
		let status = req.status.as_ref().unwrap_or(&expense.status).clone();
		let funding_source = req.funding_source.as_ref().unwrap_or(&expense.funding_source).clone();
		let performer = req.performer.as_ref().or(expense.performer.as_ref()).cloned();

		let row = sqlx::query(
			r#"
			UPDATE expenses
			SET 
				department_id = $1,
				category_id = $2,
				amount = $3::numeric,
				currency = $4,
				incurred_on = $5,
				description = $6,
				status = $7,
				funding_source = $8,
				performer = $9,
				updated_at = NOW()
			WHERE id = $10
			RETURNING 
				id,
				department_id,
				category_id,
				amount::text as amount,
				currency,
				incurred_on,
				description,
				status,
				funding_source,
				performer,
				created_by,
				created_at,
				updated_at
			"#,
		)
		.bind(department_id)
		.bind(category_id)
		.bind(&amount_str)
		.bind(&currency)
		.bind(incurred_on)
		.bind(&description)
		.bind(&status)
		.bind(&funding_source)
		.bind(&performer)
		.bind(id)
		.fetch_optional(pool)
		.await?;

		match row {
			Some(r) => Ok(Some(Expense {
				id: r.try_get("id")?,
				department_id: r.try_get("department_id")?,
				category_id: r.try_get("category_id")?,
				amount: rust_decimal::Decimal::from_str_exact(r.try_get::<String, _>("amount")?.as_str()).unwrap_or_default(),
				currency: r.try_get("currency")?,
				incurred_on: r.try_get("incurred_on")?,
				description: r.try_get("description")?,
				status: r.try_get("status")?,
				funding_source: r.try_get("funding_source")?,
				performer: r.try_get("performer")?,
				created_by: r.try_get("created_by")?,
				created_at: r.try_get("created_at")?,
				updated_at: r.try_get("updated_at")?,
			})),
			None => Ok(None),
		}
	}

	pub async fn delete(pool: &PgPool, id: Uuid) -> Result<bool, sqlx::Error> {
		let result = sqlx::query("DELETE FROM expenses WHERE id = $1")
			.bind(id)
			.execute(pool)
			.await?;

		Ok(result.rows_affected() > 0)
	}
}
