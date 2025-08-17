.PHONY: up down build rebuild

up:
	docker compose up

down:
	docker compose down --remove-orphans

build:
	docker compose build

rebuild: down build --no-cache up --build
