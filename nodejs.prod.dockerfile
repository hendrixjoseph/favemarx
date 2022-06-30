FROM node:14

WORKDIR /usr/src/app

COPY nodejs ./

RUN npm install

EXPOSE 80 443

CMD [ "npm", "start", "--", "--staging" ]

# docker build . -f nodejs.prod.dockerfile -t joehx/favemarx
# docker run -p 80:80 -p 443:443 -d joehx/favemarx