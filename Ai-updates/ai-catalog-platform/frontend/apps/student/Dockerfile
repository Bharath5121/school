FROM node:20-alpine AS builder

RUN corepack enable pnpm
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY frontend/apps/shared/package.json ./frontend/apps/shared/
COPY frontend/apps/student/package.json ./frontend/apps/student/

RUN pnpm install --frozen-lockfile

COPY frontend/apps/shared ./frontend/apps/shared
COPY frontend/apps/student ./frontend/apps/student

WORKDIR /app/frontend/apps/student
ARG BACKEND_URL=http://student-api:4001
ARG NEXT_PUBLIC_SUPABASE_URL=https://ftahafqzsblbojvgovmo.supabase.co
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ENV BACKEND_URL=${BACKEND_URL}
ENV NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}
RUN pnpm build

FROM node:20-alpine

WORKDIR /app
COPY --from=builder /app/frontend/apps/student/.next/standalone ./
COPY --from=builder /app/frontend/apps/student/.next/static ./frontend/apps/student/.next/static
COPY --from=builder /app/frontend/apps/student/public ./frontend/apps/student/public

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
CMD ["node", "frontend/apps/student/server.js"]
