FROM node

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

CMD [ "npm", "run", "backend:run" ]

# docker build . -f backend/Dockerfile -t favemarx/backend
# docker run -d -p 4430:443 favemarx/backend