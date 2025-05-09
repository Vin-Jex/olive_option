# Use the official Node.js 20 image as the base
FROM node:20

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json first to take advantage of Docker cache
COPY package*.json ./
COPY tsconfig.json ./
COPY babel.config.js ./
COPY swagger-output-0044556661.json ./

# Install dependencies and TypeScript globally in one step to reduce image layers
RUN npm install && npm install -g typescript

# Copy the source code to the working directory
COPY src/ ./src/

# Build the TypeScript code
RUN npm run build

# Copy the rest of the application files (if any)
COPY . .

# Set environment variables
ENV PORT=3000
ENV DB_CONNECTION_STRING=
ENV SECRET_KEY=
ENV HASH_SALT=
ENV SMTP_HOST=
ENV SMTP_PORT=
ENV SMTP_USER=
ENV SMTP_PASS=
ENV SMTP_SENDER=
ENV SMTP_SENDER_NAME=
ENV AZURE_STORAGE_NAME=
ENV AZURE_CONTAINER_NAME=
ENV AZURE_STORAGE_KEY=
ENV KAFKA_BROKER_URL=

ENV POLYGON_BASEURL=
ENV POLYGON_SOCKET=
ENV POLYGON_API_KEY=

# Expose the port the app will run on
EXPOSE ${PORT}

# Start the application
CMD ["sh", "-c", "npm start"]
