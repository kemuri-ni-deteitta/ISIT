SHELL := /usr/bin/bash

.PHONY: run dev fmt lint build docker-build

run:
	cargo run

fmt:
	cargo fmt --all

lint:
	cargo clippy --all-targets -- -D warnings

build:
	cargo build --release

docker-build:
	docker build -t isit-backend:dev .


