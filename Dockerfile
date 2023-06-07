FROM node:18 AS client

WORKDIR /app
COPY ./disk-anywhere .
RUN yarn
RUN prisma generate
RUN npm run build



