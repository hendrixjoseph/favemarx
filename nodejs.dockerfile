FROM node:14

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY *.js ./
COPY static static

EXPOSE 8080
CMD [ "node", "index.js" ]

# docker build . -f nodejs.dockerfile -t joehx/favemarx
# docker run -p 8080:8080 -d joehx/favemarx