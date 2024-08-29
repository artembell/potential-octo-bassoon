FROM node:20-alpine

COPY ./backend /var/stripe-integration/backend
WORKDIR /var/stripe-integration/backend

RUN npm ci
RUN npm run be:build:prod
RUN npm run be:generate:prod
# RUN npm run be:migrate:prod

ENTRYPOINT npm run be:migrate:prod && npm run be:start:prod

# ENTRYPOINT [ "npm", "run", "be:start:prod" ]
