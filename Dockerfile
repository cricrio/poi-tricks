# syntax = docker/dockerfile:1

# Adjust NODE_VERSION as desired
ARG NODE_VERSION=20
FROM node:${NODE_VERSION}-slim as build

# Remix/Prisma app lives here
WORKDIR /app

# Set production environment
ENV NODE_ENV="production"

# Install packages needed to build node modules
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential node-gyp openssl pkg-config python-is-python3

# Install node modules and generate prisma client
COPY --link package-lock.json package.json ./
COPY --link app/database ./app/database/
RUN npm ci --include=dev
RUN npx prisma generate

# Copy application code
COPY --link . .

# Build application
RUN npm run build

# Remove development dependencies
RUN npm prune --omit=dev


# Final stage for app image
FROM gcr.io/distroless/nodejs${NODE_VERSION}

LABEL fly_launch_runtime="Remix/Prisma"

# Remix/Prisma app lives here
WORKDIR /app

# Set production environment
ENV NODE_ENV="production"

# Install packages needed for deployment
# RUN apt-get update -qq && \
#     apt-get install --no-install-recommends -y openssl && \
#     rm -rf /var/lib/apt/lists /var/cache/apt/archives

# Copy built application
COPY --from=build /app /app

# Start the server by default, this can be overwritten at runtime
EXPOSE 3000
CMD [ "remix-serve", "./build/index.js" ]
