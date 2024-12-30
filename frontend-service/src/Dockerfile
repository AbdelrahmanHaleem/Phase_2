FROM node:18
WORKDIR /app
COPY package.json tsconfig.json ./
RUN npm install
COPY ./src ./src
COPY ./public ./public
EXPOSE 3000
CMD ["npm", "start"]
