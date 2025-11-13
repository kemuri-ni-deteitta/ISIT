use std::net::SocketAddr;

use axum::{
	extract::State,
	routing::{delete, get, post, put},
	Json, Router,
};
use axum::http::HeaderValue;
use serde::Serialize;
use sqlx::PgPool;
use tower_http::{
	cors::{Any, CorsLayer},
	trace::TraceLayer,
};
use tracing::{error, info};
use tracing_subscriber::EnvFilter;

mod db;
mod domain;
mod http;
mod repositories;

#[derive(Serialize)]
struct HealthResponse {
	status: &'static str,
	database: &'static str,
}

async fn health_handler(State(pool): State<PgPool>) -> Json<HealthResponse> {
	let db_status = match db::health_check(&pool).await {
		Ok(_) => "ok",
		Err(e) => {
			error!("Database health check failed: {}", e);
			"error"
		}
	};
	Json(HealthResponse {
		status: "ok",
		database: db_status,
	})
}

fn cors_layer_from_env() -> CorsLayer {
	let allowed = std::env::var("ALLOWED_ORIGINS").unwrap_or_else(|_| "*".to_string());
	if allowed == "*" {
		CorsLayer::very_permissive()
	} else {
		// Comma-separated origins
		let origins: Vec<String> = allowed
			.split(',')
			.map(|s| s.trim().to_string())
			.filter(|s| !s.is_empty())
			.collect();
		let mut layer = CorsLayer::new().allow_methods(Any).allow_headers(Any);
		for origin in origins {
			if let Ok(origin) = origin.parse::<HeaderValue>() {
				layer = layer.allow_origin(origin);
			}
		}
		layer
	}
}

#[tokio::main]
async fn main() -> anyhow::Result<()> {
	dotenvy::dotenv().ok();

	// Tracing / logs
	tracing_subscriber::fmt()
		.with_env_filter(
			EnvFilter::try_from_default_env().unwrap_or_else(|_| EnvFilter::new("info,tower_http=info")),
		)
		.with_target(false)
		.compact()
		.init();

	// Database connection
	let database_url = std::env::var("DATABASE_URL")
		.unwrap_or_else(|_| "postgres://isit:isit@localhost:5432/isit".to_string());
	let pool = db::create_pool(&database_url).await?;

	// Run migrations
	db::run_migrations(&pool).await?;

	let cors = cors_layer_from_env();

	let app = Router::new()
		.route("/healthz", get(health_handler))
		.route("/api/v1/health", get(health_handler))
		.nest(
			"/api/v1/expenses",
			Router::new()
				.route("/", get(http::expense_handlers::list_expenses))
				.route("/", post(http::expense_handlers::create_expense))
				.route("/:id", get(http::expense_handlers::get_expense))
				.route("/:id", put(http::expense_handlers::update_expense))
				.route("/:id", delete(http::expense_handlers::delete_expense)),
		)
		.route("/api/v1/departments", get(http::department_handlers::list_departments))
		.nest(
			"/api/v1/categories",
			Router::new()
				.route("/", get(http::category_handlers::list_categories))
				.route("/", post(http::category_handlers::create_category))
				.route("/:id", put(http::category_handlers::update_category))
				.route("/:id", delete(http::category_handlers::delete_category)),
		)
		.layer(TraceLayer::new_for_http())
		.layer(cors)
		.with_state(pool);

	let port: u16 = std::env::var("SERVER_PORT")
		.ok()
		.and_then(|s| s.parse().ok())
		.unwrap_or(8080);
	let addr = SocketAddr::from(([0, 0, 0, 0], port));

	info!("Starting server on http://{addr}");
	let listener = tokio::net::TcpListener::bind(&addr).await?;
	axum::serve(listener, app).await?;

	Ok(())
}


