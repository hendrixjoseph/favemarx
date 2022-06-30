FROM node:14

WORKDIR /usr/src/app

COPY nodejs ./

RUN openssl genrsa -out key.pem
RUN openssl req -new -key key.pem -out csr.pem -subj "/C=US/ST=Ohio/L=JoeHx/O=favemarx/OU=JoeHx/CN=favamarx.com"
RUN openssl x509 -req -days 9999 -in csr.pem -signkey key.pem -out cert.pem
RUN rm csr.pem

RUN npm install

EXPOSE 80 443

CMD [ "node", "local.js" ]

# docker build . -f nodejs.local.dockerfile -t joehx/favemarx
# docker run -p 80:80 -p 443:443 -d joehx/favemarx