FROM node:18 AS client

WORKDIR /app
COPY ./disk-anywhere .
RUN yarn
RUN npm run build

