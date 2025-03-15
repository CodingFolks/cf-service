COMPOSE_PROJECT_NAME = myproject

FRONTEND_SERVICE = frontend
BACKEND_SERVICE = backend

DC = docker-compose

start:
	$(DC) up --build

stop:
	$(DC) down

restart: stop start

logs:
	$(DC) logs -f

logs-backend:
	$(DC) logs -f $(BACKEND_SERVICE)

logs-frontend:
	$(DC) logs -f $(FRONTEND_SERVICE)

clean:
	$(DC) down --volumes --remove-orphans
	docker system prune -f

test-backend:
	$(DC) exec $(BACKEND_SERVICE) npm test

build-backend:
	$(DC) build $(BACKEND_SERVICE)

build-frontend:
	$(DC) build $(FRONTEND_SERVICE)
