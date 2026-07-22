FROM node:20-alpine

FROM node:20-alpine

COPY package*.json ./
RUN npm install

COPY . .

ENV NEXT_PUBLIC_API_URL=http://localhost:4000/graphql

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]