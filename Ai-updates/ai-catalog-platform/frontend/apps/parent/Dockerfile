FROM node:20-alpine AS builder

RUN corepack enable pnpm
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY frontend/apps/shared/package.json ./frontend/apps/shared/
COPY frontend/apps/parent/package.json ./frontend/apps/parent/

RUN pnpm install --frozen-lockfile

COPY frontend/apps/shared ./frontend/apps/shared
COPY frontend/apps/parent ./frontend/apps/parent

WORKDIR /app/frontend/apps/parent
RUN pnpm build

FROM node:20-alpine

WORKDIR /app
COPY --from=builder /app/frontend/apps/parent/.next/standalone ./
COPY --from=builder /app/frontend/apps/parent/.next/static ./frontend/apps/parent/.next/static
COPY --from=builder /app/frontend/apps/parent/public ./frontend/apps/parent/public

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
CMD ["node", "frontend/apps/parent/server.js"]
