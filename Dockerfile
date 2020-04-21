FROM node:10
WORKDIR /app
COPY package.json /app
RUN npm install
COPY . /app
CMD node server.js ; node express.js
EXPOSE 3000