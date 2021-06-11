FROM node:14-alpine
WORKDIR /src
COPY package*.json ./
RUN npm install
COPY . /src
EXPOSE 5000
CMD ["npm", "start"]