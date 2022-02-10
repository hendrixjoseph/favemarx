FROM node:14

WORKDIR /usr/src/app

COPY nodejs ./

RUN openssl genrsa -out key.pem
RUN openssl req -new -key key.pem -out csr.pem -subj "/C=US/ST=Ohio/L=JoeHx/O=favemarx/OU=JoeHx/CN=favamarx.com"
RUN openssl x509 -req -days 9999 -in csr.pem -signkey key.pem -out cert.pem
RUN rm csr.pem

RUN npm install

EXPOSE 8080
CMD [ "node", "index.js" ]

# docker build . -f nodejs.dockerfile -t joehx/favemarx
# docker run -p 8080:8080 -d joehx/favemarx