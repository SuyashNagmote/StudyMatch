# Stage 1: Build the React client
FROM node:20-alpine AS client-builder

WORKDIR /app
# We copy package files first for better caching
COPY client/package*.json ./client/
# The client package.json uses "studymatch": "file:.." so we need the root package.json if we run npm install from root,
# but it's simpler to just install in the client folder.
# Wait, "studymatch": "file:.." means there is a local dependency.
# Let's copy everything needed for the client install.
COPY package*.json ./
COPY client ./client
COPY server ./server

WORKDIR /app/client
RUN npm install
RUN npm run build

# Stage 2: Setup the Node Express server
FROM node:20-alpine AS server

WORKDIR /app

# Copy root package.json and server package files
COPY package*.json ./
COPY server/package*.json ./server/

# Install server dependencies
WORKDIR /app/server
RUN npm install --omit=dev

# Copy server source code
COPY server/src ./src

# Copy built client files from the builder stage
COPY --from=client-builder /app/client/dist /app/client/dist

# Expose the port the app runs on
EXPOSE 5000

# Set environment to production
ENV NODE_ENV=production
ENV PORT=5000

# Start the server
CMD ["node", "src/index.js"]
