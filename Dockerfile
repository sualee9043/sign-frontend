FROM node:alpine as builder

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

RUN npm run build



FROM nginx 

EXPOSE 3000

COPY ./conf/default.conf /etc/nginx/conf.d/nginx.conf 

COPY --from=builder app/build  /usr/share/nginx/html 
