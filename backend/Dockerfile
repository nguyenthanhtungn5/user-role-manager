FROM node:20-alpine

ENV NODE_ENV=production
WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

COPY . .

USER node 
ENV PORT=3000
EXPOSE 3000

CMD ["npm", "start"]