docker-compose up --build -d
docker-compose run --rm certbot
docker-compose restart nginx
docker-compose run --rm certbot renew
