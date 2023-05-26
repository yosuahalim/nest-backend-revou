FROM --platform=linux/amd64 node:alpine

WORKDIR /app

COPY package.json ./
COPY pnpm-lock.yaml ./

RUN npm i -g pnpm
RUN pnpm fetch --prod
RUN pnpm install -r --offline --prod

COPY . ./
RUN pnpm build

EXPOSE 3000
CMD ["pnpm", "start:prod"]