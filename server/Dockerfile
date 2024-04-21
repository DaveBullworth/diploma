FROM node:12-alpine

WORKDIR /app

COPY package*.json ./
RUN apk --no-cache add --virtual builds-deps build-base python3
RUN npm install
RUN npm install -g nodemon

COPY . .

EXPOSE 5000

CMD ["npm", "run", "dev"]
