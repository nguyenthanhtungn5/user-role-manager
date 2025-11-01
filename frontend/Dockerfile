# ---------------------------------------------------------
# 🏗️ STAGE 1 — Build Vue + Vuetify + Sass Frontend
# ---------------------------------------------------------

FROM node:18 AS buildNode
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Vue/Vuetify App bauen (Build Output z. B. /dist)
RUN npm run build

# ---------------------------------------------------------
# 🚀 STAGE 2 — Nginx Production Server
# ---------------------------------------------------------
FROM nginx:alpine
COPY --from=buildNode /app/dist /usr/share/nginx/html

# Optional: eigene Nginx-Config (z. B. für SPA-Routing)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]