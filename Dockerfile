# Car Vibro-Logger — статическая презентация (zero-dep static server).
FROM node:20-alpine
WORKDIR /app
COPY . .
ENV PORT=8080
ENV HOST=0.0.0.0
EXPOSE 8080
CMD ["node", "server.js"]
