FROM node:latest

WORKDIR /api

COPY . .

RUN rm -rf node_modules
RUN npm install

CMD ["npm", "start"]

EXPOSE 3000