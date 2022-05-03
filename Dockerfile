FROM node:16

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

COPY bower*.json ./
RUN ./node_modules/bower/bin/bower install --allow-root

# Bundle app source
COPY . .

EXPOSE 8080
CMD [ "node", "server.js" ]
