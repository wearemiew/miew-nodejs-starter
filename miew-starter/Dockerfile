# ---------- base ----------
FROM node:24-alpine AS base
WORKDIR /app

# ---------- dependencies ----------
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

# ---------- build ----------
FROM deps AS build
COPY tsconfig.json tsconfig.build.json nest-cli.json prisma.config.ts ./
COPY prisma ./prisma
COPY src ./src

# Dummy DATABASE_URL: prisma generate only builds the TypeScript client from the
# schema files and never connects to a database, but prisma.config.ts requires
# the variable to be set at parse time. The real URL is provided at runtime.
RUN DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder" npx prisma generate
RUN npm run build

# ---------- production ----------
FROM base AS production
ENV NODE_ENV=production

COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm install prisma --no-save

# Copy Prisma schema and generate client for production
COPY prisma ./prisma
COPY prisma.config.ts ./
# Same dummy DATABASE_URL trick as in the build stage (see comment above)
RUN DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder" npx prisma generate

# Copy built application and config
COPY --from=build /app/dist ./dist
COPY config ./config
COPY docker-entrypoint.sh ./

RUN chown -R node:node /app
USER node

EXPOSE 3000

ENTRYPOINT ["./docker-entrypoint.sh"]
