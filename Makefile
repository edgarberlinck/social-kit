.PHONY: up down build rebuild

up:
	docker compose up -d --build

down:
	docker compose down --remove-orphans

build:
	docker compose build

rebuild: down build --no-cache up --build
