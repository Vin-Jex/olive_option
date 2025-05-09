# OliveOption Backend

This project is the backend for the OliveOption application. It is built with TypeScript, Node.js, and Docker for containerization. It uses Kafka for message brokering and Zookeeper for managing Kafka brokers.

## Prerequisites

Before running the application, ensure that you have the following installed on your system:

- **Docker**: [Download and install Docker Desktop](https://www.docker.com/products/docker-desktop)
- **Docker Compose**: (usually included with Docker Desktop)
- **Node.js**: [Install Node.js](https://nodejs.org/) (If you are building locally outside of Docker)
- **npm**: (installed with Node.js)
  
## Setting Up the Application

### 1. Clone the Repository

```bash
git clone git@github.com:GrandGaleTechnologies/oliveoption_backend_ts.git
cd oliveoption_backend_ts
```

### 2. Install Dependencies

Before building or running the application, you need to install the dependencies:

```bash
npm install
```

### 3. Set Environment Variables

Create a `.env` file in the root of the project (or copy the `.env.example` if available) to set the environment variables required for the application. Here are some examples of required variables:

```dotenv
PORT=3000
DB_CONNECTION_STRING=your-database-connection-string
SECRET_KEY=your-secret-key
HASH_SALT=your-salt-value
SMTP_HOST=your-smtp-host
SMTP_PORT=your-smtp-port
SMTP_USER=your-smtp-user
SMTP_PASS=your-smtp-password
SMTP_SENDER=your-sender-email
SMTP_SENDER_NAME=your-sender-name
AZURE_STORAGE_NAME=your-azure-storage-name
AZURE_CONTAINER_NAME=your-azure-container-name
AZURE_STORAGE_KEY=your-azure-storage-key
KAFKA_BROKER_URL=your-kafka-broker-url

POLYGON_BASEURL=your-polygon-baseurl
POLYGON_SOCKET=your-polygon-socket
POLYGON_API_KEY=your-polygon-api-key
```

### 4. Build the Docker Images

If you're using Docker, you can build the images and start the containers using Docker Compose. From the root of the project, run:

```bash
docker compose -f docker-kafdrop-compose.yaml up -d
```

This will:
- Build the Docker images for your services (`zookeeper`, `kafka`, and the Node.js application).
- Start the containers in the background (`-d` flag).
- Use the environment variables set in the `.env` file.

### 5. Running the Application (Locally)

After installing dependencies and building the application, you can run the backend locally using:

```bash
npm run dev
```

This will start the application in development mode with `nodemon`, automatically reloading the server on code changes.

### 6. Accessing the Application

Once the backend application is running in Docker or locally, you can access it via:

```bash
http://localhost:9999
```

If running in Docker, it will still be accessible on `localhost` unless specified otherwise.

### 7. Accessing Swagger Documentation

You can view the Swagger API documentation at:

```bash
http://localhost:9999/doc
```

### 8. Health Check

You can check if the backend is up and running with the health check endpoint:

```bash
http://localhost:9999/health
```

### 9. Telegram Webhook (Optional)

If you need to set up a Telegram webhook for your application, it will be automatically initialized when the server starts (in the development environment). The server will connect to the Telegram API and set the webhook URL.

---

## Docker Compose Services

This project uses Docker Compose to manage services. Below are the services configured in `docker-compose.yml`:

### **1. Zookeeper**
- **Image**: `confluentinc/cp-zookeeper:latest`
- **Ports**: `2181:2181`
- **Environment Variables**:
  - `ZOOKEEPER_CLIENT_PORT=2181`
  - `ZOOKEEPER_TICK_TIME=2000`

### **2. Kafka**
- **Image**: `confluentinc/cp-kafka:latest`
- **Ports**: `9092:9092`
- **Environment Variables**:
  - `KAFKA_BROKER_ID=1`
  - `KAFKA_ZOOKEEPER_CONNECT=zookeeper:2181`
  - `KAFKA_LISTENER_SECURITY_PROTOCOL_MAP=PLAINTEXT:PLAINTEXT`
  - `KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://localhost:9092`
  - `KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR=1`

### **3. Backend Application (Node.js)**
- **Image**: Your custom Node.js Docker image built from `Dockerfile`.
- **Ports**: `9999:9999`
- **Environment Variables**: Refer to the `.env` file for required values.

## Additional Docker Commands

- **To rebuild the application and start the containers**:

  ```bash
  docker-compose up --build
  ```

- **To stop the containers**:

  ```bash
  docker-compose down
  ```

- **To view logs from the containers**:

  ```bash
  docker-compose logs -f
  ```

- **To restart the containers**:

  ```bash
  docker-compose restart
  ```

- **To run the application directly using Docker** (without Compose):

  1. Build the Docker image:

     ```bash
     docker build -t oliveoption-backend .
     ```

  2. Run the container:

     ```bash
     docker run -d -p 9999:9999 --env-file .env oliveoption-backend
     ```

## Troubleshooting

- If you face issues with Docker permissions, make sure Docker Desktop is running, and check the ownership of the Docker socket (`/Users/mac/.docker/run/docker.sock`).
- If you encounter errors related to Kafka or Zookeeper, ensure both services are up and running properly by checking Docker logs.
# olive_option
