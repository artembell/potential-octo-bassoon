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
	