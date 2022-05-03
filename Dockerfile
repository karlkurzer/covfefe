FROM node:16

# Create app directory
WORKDIR /usr/src/app

# Copy app code
COPY . .

# Install app dependencies
RUN npm install

RUN ./node_modules/bower/bin/bower install --allow-root

EXPOSE 8080
CMD [ "node", "server.js" ]
