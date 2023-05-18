FROM node AS build

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm run frontend:build

FROM nginx

COPY frontend/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /usr/src/app/frontend/dist /usr/share/nginx/html

# docker build . -f frontend/Dockerfile -t favemarx/frontend
# docker run -d -p 8080:80 favemarx/frontend