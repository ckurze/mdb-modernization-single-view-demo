# https://nodejs.org/en/docs/guides/nodejs-docker-webapp/
FROM node:carbon
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]