FROM node:10.16.3

WORKDIR /app

ADD package.json /app

RUN npm i

ADD . /app

EXPOSE 8080

CMD [ "npm", "run", "dev" ]