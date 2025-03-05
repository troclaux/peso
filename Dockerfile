
FROM node:18-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next

RUN npm ci --only=production

EXPOSE 3000

CMD ["npm", "run", "start"]
