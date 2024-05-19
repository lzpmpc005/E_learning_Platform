FROM node:20

WORKDIR /bank_server

COPY package*.json ./

RUN npm install

COPY prisma ./prisma

RUN npx prisma generate

COPY . .

EXPOSE 8888

CMD ["node", "index.js"]