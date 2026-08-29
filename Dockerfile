# ============================================================
# Stage 1: Install dependencies
# ============================================================
FROM node:20-alpine AS deps

# libc6-compat is required for certain native npm packages on Alpine
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copy lockfile + manifest and install with clean, reproducible installs
COPY package.json package-lock.json* ./
RUN npm ci

# ============================================================
# Stage 2: Build the application
# ============================================================
FROM node:20-alpine AS builder

WORKDIR /app

# Bring in installed node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy the rest of the source
COPY . .

# `NEXT_PUBLIC_*` values must be present at build time for the client bundle.
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY

# Disable Next.js telemetry during build
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# ============================================================
# Stage 3: Production runner (minimal image)
# ============================================================
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create a non-root user for security
RUN addgroup --system --gid 1001 nodejs \
 && adduser  --system --uid 1001 nextjs

# Copy static assets
COPY --from=builder /app/public ./public

# Pre-create .next dir and hand ownership to nextjs user
RUN mkdir .next && chown nextjs:nodejs .next

# Copy the standalone server bundle produced by output: "standalone"
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./

# Copy static chunks (CSS, JS) into the expected location
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# standalone output emits a self-contained server.js at the root
CMD ["node", "server.js"]
