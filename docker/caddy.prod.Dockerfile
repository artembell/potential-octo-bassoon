FROM caddy:alpine

EXPOSE 80:80
EXPOSE 443:443

COPY ./docker/caddy/static ./code/static
COPY ./docker/caddy/prod.Caddyfile /etc/caddy/Caddyfile

CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]