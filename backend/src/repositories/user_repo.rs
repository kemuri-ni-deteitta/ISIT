use crate::domain::user::{User, UserWithRole};
use sqlx::PgPool;
use uuid::Uuid;

pub struct UserRepository;

impl UserRepository {
	pub async fn create(
		pool: &PgPool,
		email: &str,
		full_name: &str,
		password_hash: &str,
	) -> Result<User, sqlx::Error> {
		let user = sqlx::query_as::<_, User>(
			r#"
			INSERT INTO users (email, password_hash, full_name, status)
			VALUES ($1, $2, $3, 'active')
			RETURNING id, email, full_name, status, created_at, updated_at
			"#,
		)
		.bind(email)
		.bind(password_hash)
		.bind(full_name)
		.fetch_one(pool)
		.await?;

		Ok(user)
	}

	pub async fn get_by_id(pool: &PgPool, id: Uuid) -> Result<Option<User>, sqlx::Error> {
		let user = sqlx::query_as::<_, User>(
			"SELECT id, email, full_name, status, created_at, updated_at FROM users WHERE id = $1"
		)
		.bind(id)
		.fetch_optional(pool)
		.await?;

		Ok(user)
	}

	pub async fn list(pool: &PgPool) -> Result<Vec<UserWithRole>, sqlx::Error> {
		// Get users with their roles
		let rows = sqlx::query(
			r#"
			SELECT 
				u.id,
				u.email,
				u.full_name,
				u.status,
				u.created_at,
				u.updated_at,
				COALESCE(
					(SELECT r.name FROM user_roles ur 
					 JOIN roles r ON ur.role_id = r.id 
					 WHERE ur.user_id = u.id 
					 LIMIT 1),
					'employee'
				) as role
			FROM users u
			ORDER BY u.created_at DESC
			"#,
		)
		.fetch_all(pool)
		.await?;

		let users: Result<Vec<UserWithRole>, sqlx::Error> = rows
			.into_iter()
			.map(|r| -> Result<UserWithRole, sqlx::Error> {
				use sqlx::Row;
				Ok(UserWithRole {
					id: r.get("id"),
					email: r.get("email"),
					full_name: r.get("full_name"),
					status: r.get("status"),
					role: r.get("role"),
					created_at: r.get("created_at"),
					updated_at: r.get("updated_at"),
				})
			})
			.collect();

		users
	}

	pub async fn update(
		pool: &PgPool,
		id: Uuid,
		email: Option<&str>,
		full_name: Option<&str>,
		status: Option<&str>,
	) -> Result<Option<User>, sqlx::Error> {
		// Get existing user
		let existing = Self::get_by_id(pool, id).await?;
		if existing.is_none() {
			return Ok(None);
		}

		let user = existing.unwrap();
		let email = email.unwrap_or(&user.email);
		let full_name = full_name.or(user.full_name.as_deref());
		let status = status.unwrap_or(&user.status);

		let updated = sqlx::query_as::<_, User>(
			r#"
			UPDATE users
			SET email = $1, full_name = $2, status = $3, updated_at = NOW()
			WHERE id = $4
			RETURNING id, email, full_name, status, created_at, updated_at
			"#,
		)
		.bind(email)
		.bind(full_name)
		.bind(status)
		.bind(id)
		.fetch_optional(pool)
		.await?;

		Ok(updated)
	}

	pub async fn delete(pool: &PgPool, id: Uuid) -> Result<bool, sqlx::Error> {
		// Soft delete by setting status to 'inactive'
		let result = sqlx::query("UPDATE users SET status = 'inactive', updated_at = NOW() WHERE id = $1")
			.bind(id)
			.execute(pool)
			.await?;

		Ok(result.rows_affected() > 0)
	}

	pub async fn assign_role(
		pool: &PgPool,
		user_id: Uuid,
		role_name: &str,
	) -> Result<(), sqlx::Error> {
		// Get or create role
		let role_id: Option<Uuid> = sqlx::query_scalar(
			"SELECT id FROM roles WHERE name = $1"
		)
		.bind(role_name)
		.fetch_optional(pool)
		.await?;

		let role_id = if let Some(id) = role_id {
			id
		} else {
			// Create role if it doesn't exist
			let new_id = Uuid::new_v4();
			sqlx::query("INSERT INTO roles (id, name) VALUES ($1, $2) ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name RETURNING id")
				.bind(new_id)
				.bind(role_name)
				.execute(pool)
				.await?;
			new_id
		};

		// Remove existing roles for user
		sqlx::query("DELETE FROM user_roles WHERE user_id = $1")
			.bind(user_id)
			.execute(pool)
			.await?;

		// Assign new role
		sqlx::query("INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2) ON CONFLICT DO NOTHING")
			.bind(user_id)
			.bind(role_id)
			.execute(pool)
			.await?;

		Ok(())
	}
}

