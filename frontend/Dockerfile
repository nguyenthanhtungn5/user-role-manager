FROM node:18 AS buildNode
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=buildNode /app/dist /usr/share/nginx/html