FROM node:20-alpine AS builder

RUN corepack enable pnpm
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY frontend/apps/shared/package.json ./frontend/apps/shared/
COPY frontend/apps/admin/package.json ./frontend/apps/admin/

RUN pnpm install --frozen-lockfile

COPY frontend/apps/shared ./frontend/apps/shared
COPY frontend/apps/admin ./frontend/apps/admin

WORKDIR /app/frontend/apps/admin

ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ARG BACKEND_URL=http://admin-api:4003
ENV BACKEND_URL=${BACKEND_URL}
ENV NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}

RUN pnpm build

FROM node:20-alpine

WORKDIR /app
COPY --from=builder /app/frontend/apps/admin/.next/standalone ./
COPY --from=builder /app/frontend/apps/admin/.next/static ./frontend/apps/admin/.next/static
COPY --from=builder /app/frontend/apps/admin/public ./frontend/apps/admin/public

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
CMD ["node", "frontend/apps/admin/server.js"]
