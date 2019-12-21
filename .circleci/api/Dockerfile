FROM node:13.3-alpine

WORKDIR /home/docker-tp
RUN chown -R node:node /home/docker-tp
USER node

COPY package.json ./
RUN npm install

EXPOSE 3000
ENTRYPOINT ["npm", "start"]