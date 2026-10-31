# =========================================================
# FitSphere (MERN) - Multistage Dockerfile
# =========================================================

# ---------- Stage 1: Build the React (Vite) frontend ----------
FROM node:22 AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build                 # output -> /app/frontend/dist

# ---------- Stage 2: Install backend production dependencies ----------
FROM node:22 AS backend-deps
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci --omit=dev             # no nodemon / dev tools

# ---------- Stage 3: Lightweight runtime image ----------
FROM node:22-slim AS runtime
ENV NODE_ENV=production
WORKDIR /app
COPY --from=backend-deps /app/backend/node_modules ./node_modules
COPY backend/ ./
COPY --from=frontend-build /app/frontend/dist ./public
USER node
EXPOSE 8000
CMD ["node", "server.js"]
