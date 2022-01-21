FROM node:latest

COPY ["package.json", "package-lock.json", "/usr/src/"]

WORKDIR /usr/src

RUN npm install
RUN npm rebuild bcrypt

COPY [".", "/usr/src/"]

CMD ["node", "endpointDB.js"]
#CMD ["npx", "nodemon", "--legacy-watch", "endpointDB.js"]
