use sqlx::{postgres::PgPoolOptions, PgPool};
use tracing::{error, info};

pub async fn create_pool(database_url: &str) -> anyhow::Result<PgPool> {
	info!("Connecting to database at {}...", mask_password(database_url));
	let pool = PgPoolOptions::new()
		.max_connections(10)
		.connect(database_url)
		.await
		.map_err(|e| {
			error!("Failed to connect to database: {}", e);
			error!("Database URL format: postgres://USER:PASSWORD@HOST:PORT/DATABASE");
			error!("Make sure Postgres is running: sudo docker compose up -d postgres");
			e
		})?;
	info!("Database connection established");
	Ok(pool)
}

fn mask_password(url: &str) -> String {
	if let Some(at_pos) = url.find('@') {
		if let Some(slash_pos) = url[..at_pos].rfind(':') {
			let mut masked = url.to_string();
			masked.replace_range(slash_pos + 1..at_pos, "***");
			return masked;
		}
	}
	url.to_string()
}

pub async fn run_migrations(pool: &PgPool) -> anyhow::Result<()> {
	info!("Running database migrations...");
	sqlx::migrate!("./migrations").run(pool).await?;
	info!("Database migrations completed");
	Ok(())
}

pub async fn health_check(pool: &PgPool) -> anyhow::Result<()> {
	sqlx::query("SELECT 1").execute(pool).await?;
	Ok(())
}

