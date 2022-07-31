FROM node:16

# Create app directory
WORKDIR /usr/src/app

COPY package*.json ./
USER node
RUN npm install

# Bundle app source
COPY . .

EXPOSE 3000
CMD [ "npm", "start" ]