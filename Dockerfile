FROM node:24.13.0

RUN corepack enable

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install

COPY . .

RUN pnpm run prisma:generate

EXPOSE 4000

CMD ["pnpm", "dev"]
