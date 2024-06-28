FROM node:16.17.1-alpine
ENV PORT="3001"
RUN mkdir -p /home/app/node_modules && chown -R node:node /home/app
WORKDIR /home/app
COPY --chown=node:node package*.json ./
USER node
RUN npm i  --no-cache
COPY --chown=node:node . .
CMD [ "npm", "run", "start" ]
EXPOSE ${PORT}
