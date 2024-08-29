FROM node:20-alpine

COPY ./frontend /var/stripe-integration/frontend
WORKDIR /var/stripe-integration/frontend

RUN npm ci

ENTRYPOINT [ "npm", "run", "fe:start:prod" ]