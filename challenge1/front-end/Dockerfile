FROM node:14-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
RUN npm run build

FROM nginx:stable-alpine
COPY --from=build /app/build /bin/www
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 8001
CMD [ "nginx", "-g", "daemon off;" ]