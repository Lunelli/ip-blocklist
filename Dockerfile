FROM node:16.15-alpine

WORKDIR /app

COPY package*.json ./
COPY .env.example ./.env
COPY tsconfig.json ./
COPY . .

RUN npm install

EXPOSE 3000

CMD ["npm", "run", "start"]
