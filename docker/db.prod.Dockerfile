FROM postgres:16.3

# FROM node:20-alpine

# EXPOSE 5432
EXPOSE 3000

ENV NVM_DIR /usr/local/nvm
ENV NODE_VERSION 20

RUN apt-get update; apt-get install curl gpg -y; \
    mkdir -p /etc/apt/keyrings; \
    curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg; \
    echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_20.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list; \
    apt-get update && apt-get install -y nodejs vim;




COPY ./backend /var/stripe-integration/backend
WORKDIR /var/stripe-integration/backend

RUN npm ci
RUN npm run be:build:prod
RUN npm run be:generate:prod
# RUN npm run be:migrate:prod

ENTRYPOINT [ "npm", "run", "be:start:prod" ]