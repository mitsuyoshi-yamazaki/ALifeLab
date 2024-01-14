# Fullstack Authentication Example with Next.js and NextAuth.js

This is the starter project for the fullstack tutorial with Next.js and Prisma. You can find the final version of this project in the [`final`](https://github.com/prisma/blogr-nextjs-prisma/tree/final) branch of this repo.

## Installation
```sh
$ docker compose up -d --build

# docker exec -it alife_lab sh
$ docker exec -it <container-name> sh

$ vercel env pull .env
```

## Development
### Migration
```sh
# change src/prisma/schema.prisma
$ yarn prisma db push
```

### Reset DB
```sh
$ yarn prisma db push --force-reset
```