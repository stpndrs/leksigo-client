# ==========================================
# TAHAP 1: Proses Build (Membuat Kue)
# ==========================================
FROM node:22-alpine AS build-stage

WORKDIR /app

# Install dependency
COPY package*.json ./
RUN npm install

# Copy semua kode Vue dan jalankan proses build
COPY . .
RUN npm run build

# ==========================================
# TAHAP 2: Proses Production (Menyajikan Kue di Etalase)
# ==========================================
FROM nginx:alpine AS production-stage

# Copy hasil build dari Tahap 1 (folder /dist) ke dalam Nginx
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Buka port 80 (port standar Nginx)
EXPOSE 80

# Nyalakan Nginx
CMD ["nginx", "-g", "daemon off;"]