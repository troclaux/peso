
FROM nginx:latest

RUN apt update && apt install -y certbot python3-certbot-nginx

COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]
