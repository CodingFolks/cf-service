FROM node:22

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5000

ENV DB_USER=yourusername
ENV DB_HOST=postgres-container
ENV DB_NAME=yourdatabase
ENV DB_PASSWORD=yourpassword
ENV DB_PORT=5432

CMD ["npm", "start"]
