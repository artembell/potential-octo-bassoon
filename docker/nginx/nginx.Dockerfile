FROM nginx:alpine


COPY ./public /usr/share/data
COPY ./nginx.conf /etc/nginx/nginx.conf

ENTRYPOINT ["nginx", "-g", "daemon off;"]