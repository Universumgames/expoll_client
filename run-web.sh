export COMPOSE_PROJECT_NAME=expoll
docker compose -f ./compose-web.yml up --detach --build --force-recreate