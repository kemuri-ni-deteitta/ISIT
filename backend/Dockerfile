# syntax=docker/dockerfile:1.7

FROM rust:1.81-slim AS builder
WORKDIR /app

# Create a dummy project to leverage Docker layer caching
RUN USER=root cargo new --bin backend
WORKDIR /app/backend

# Copy manifests first
COPY Cargo.toml .

# Build deps
RUN cargo build --release || true

# Now copy source and build
COPY src ./src
RUN cargo build --release

FROM debian:bookworm-slim AS runtime
RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates && rm -rf /var/lib/apt/lists/*
WORKDIR /app

COPY --from=builder /app/backend/target/release/backend /usr/local/bin/backend

ENV RUST_LOG=info
EXPOSE 8080

# Run as non-root user
RUN useradd -m -u 10001 appuser
USER appuser

CMD ["/usr/local/bin/backend"]


