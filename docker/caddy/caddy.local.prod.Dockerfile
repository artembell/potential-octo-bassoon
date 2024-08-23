FROM caddy:alpine

EXPOSE 80:80
EXPOSE 443:443

COPY ./caddy/static ./usr/share/caddy
COPY ./caddy/my.Caddyfile /etc/caddy/Caddyfile

CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]