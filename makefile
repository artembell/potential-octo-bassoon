up:
	docker compose --file ./docker/docker-compose.local.dev.yaml up
	# docker compose --file ./docker/docker-compose.yaml up stripe-caddy --force-recreate
	# docker compose --file ./docker/docker-compose.yaml up stripe-api
	# docker compose --file ./docker/docker-compose.yaml up stripe-frontend
	# docker compose --file ./docker/docker-compose.yaml up 
	
down:
	docker compose --file ./docker/docker-compose.local.dev.yaml down

migrate:
	npm run be:migrate --prefix backend

generate:
	npm run be:generate --prefix backend

fe:
	npm run fe:start

be:
	npm run be:start

seed:
	npm run be:seed --prefix backend

prod-db:
	docker compose --file ./docker/docker-compose.local.prod.yaml down --volumes db db-admin
	docker compose --file ./docker/docker-compose.local.prod.yaml up --detach --build --force-recreate db db-admin

prod-rabbit:
	docker compose --file ./docker/docker-compose.local.prod.yaml down --volumes rabbitmq
	docker compose --file ./docker/docker-compose.local.prod.yaml up --detach --build --force-recreate rabbitmq

prod-be:	
	docker compose --file ./docker/docker-compose.local.prod.yaml down --volumes stripe-api
	docker compose --file ./docker/docker-compose.local.prod.yaml up --detach --build --force-recreate stripe-api

prod-fe:	
	docker compose --file ./docker/docker-compose.local.prod.yaml down --volumes stripe-frontend
	docker compose --file ./docker/docker-compose.local.prod.yaml up --detach --build --force-recreate stripe-frontend

prod-caddy:	
	docker compose --file ./docker/docker-compose.local.prod.yaml down --volumes stripe-caddy
	docker compose --file ./docker/docker-compose.local.prod.yaml up --detach --build --force-recreate stripe-caddy

prod-all:
	docker compose --file ./docker/docker-compose.local.prod.yaml down --volumes db db-admin rabbitmq stripe-frontend stripe-caddy
	docker compose --file ./docker/docker-compose.local.prod.yaml up --detach --build --force-recreate  db db-admin rabbitmq stripe-frontend stripe-caddy
