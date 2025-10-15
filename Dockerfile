FROM node:18-alpine AS base

FROM base AS deps
RUN apk add --no-cache libc6-compat yarn
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
    if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
    elif [ -f package-lock.json ]; then npm ci; \
    elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i --frozen-lockfile; \
    else echo "Lockfile not found." && exit 1; \
    fi


# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
RUN apk add --no-cache python3 py3-pip build-base gcc make g++ \
    && pip install awscli \
    && ln -sf /usr/bin/python3 /usr/bin/python
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN yarn global add pnpm && pnpm run build
RUN sh ./upload-to-s3.sh

FROM node:18-alpine AS runner
WORKDIR /app

# Install curl for healthcheck
RUN apk add --no-cache curl

ENV NODE_ENV production
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Use /tmp/next/cache for storeing all caching
RUN mkdir -p .next/cache 
RUN chown -R nextjs:nodejs .next

USER nextjs

EXPOSE 3000

ENV PORT 3000
# set hostname to localhost
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]


