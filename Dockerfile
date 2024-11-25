FROM node:lts-alpine
RUN npm install -g pnpm http-server

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install

COPY . .

RUN pnpm run build

EXPOSE 8080
CMD [ "http-server", "dist" ]