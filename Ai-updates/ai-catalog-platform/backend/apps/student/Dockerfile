FROM node:20-alpine AS builder

RUN apk add --no-cache openssl
RUN corepack enable pnpm

WORKDIR /app
COPY package.json ./
COPY prisma ./prisma/
RUN pnpm install --no-frozen-lockfile

COPY . .
RUN npx prisma generate
RUN pnpm run build

FROM node:20-alpine

RUN apk add --no-cache openssl
WORKDIR /app
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

RUN addgroup -g 1001 -S appgroup && adduser -u 1001 -S appuser -G appgroup
RUN chown -R appuser:appgroup /app
USER appuser

EXPOSE 4001
CMD ["node", "dist/server.js"]
