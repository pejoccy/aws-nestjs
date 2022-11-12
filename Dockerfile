FROM node:16

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN yarn

# Bundle app source
COPY . .

# Build app
RUN yarn build

EXPOSE 3001
CMD [ "node", "dist/src/main" ]