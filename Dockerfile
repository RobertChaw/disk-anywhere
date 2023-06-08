FROM node:18
WORKDIR /app
COPY . .
RUN yarn
RUN npx prisma migrate dev
RUN npx prisma generate
RUN npm run build
EXPOSE 3000
CMD ["npm","start"]
