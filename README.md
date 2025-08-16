# Social Kit Monorepo

This monorepo contains a set of services and applications for a social kit platform, built with Nest.js, React, Kafka, MySQL, MongoDB, and Grafana.

## Architecture

The project is structured as a monorepo, with the following main components:

- **`apps/backend`**: A Nest.js API backend that handles user requests, interacts with MySQL (via Prisma) and MongoDB, and publishes messages to Kafka. It also includes an email sending module.
- **`apps/publish-service`**: A Nest.js microservice that consumes messages from Kafka and prints them to the console.
- **`apps/frontend`**: A React 19 application built with Vite, Sass, and CSS Modules, providing the user interface.
- **`packages/shared`**: A shared package for common types, interfaces, and utilities (currently empty).
- **`grafana`**: Grafana setup for monitoring and visualization.
- **`loki`**: Loki setup for log aggregation.
- **`prometheus`**: Prometheus setup for metrics collection.

## Services

The following services are orchestrated using Docker Compose:

- **`zookeeper`**: Apache ZooKeeper, a dependency for Kafka.
- **`kafka`**: Apache Kafka, a distributed streaming platform for handling real-time data feeds.
- **`mysql`**: MySQL 8.0 database for relational data (e.g., user information, subscriptions).
- **`mongodb`**: MongoDB database for NoSQL data (e.g., posts, metrics).
- **`api-backend`**: The Nest.js API backend application.
- **`publish-service`**: The Nest.js microservice that consumes Kafka messages.
- **`frontend`**: The React frontend application.
- **`grafana`**: Grafana for monitoring.
- **`mailpit`**: A local SMTP server for development, with a web UI for viewing sent emails.
- **`namshi-smtp`**: A simple SMTP server for real email delivery in test/production environments.

## Getting Started

### Prerequisites

- Docker Desktop (or Docker Engine and Docker Compose)
- Node.js (LTS version recommended)
- npm (Node Package Manager)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd social-kit
    ```

2.  **Create a `.env` file:**

    Create a `.env` file in the root of the project with the following content:

    ```env
    JWT_SECRET=supersecret
    STRIPE_SECRET_KEY=supersecret
    FRONTEND_URL=http://localhost:80
    STRIPE_WEBHOOK_SECRET=whsec_test

    # SMTP Configuration (Development - Mailpit)
    SMTP_HOST_DEV=mailpit
    SMTP_PORT_DEV=1025
    SMTP_SECURE_DEV=false
    SMTP_USER_DEV=
    SMTP_PASSWORD_DEV=
    EMAIL_FROM_DEV=dev@example.com

    # SMTP Configuration (Production - Namshi SMTP)
    SMTP_HOST_PROD=namshi-smtp
    SMTP_PORT_PROD=2525
    SMTP_SECURE_PROD=false
    SMTP_USER_PROD=
    SMTP_PASSWORD_PROD=
    EMAIL_FROM_PROD=noreply@example.com
    ```

3.  **Build and run Docker containers:**

    ```bash
    docker compose up -d --build
    ```

    This command will build the Docker images for all services and start them in detached mode.

4.  **Initialize Prisma (for backend and consumer):**

    For `api-backend`:
    ```bash
    cd apps/backend
    npx prisma generate
    cd ../..
    ```

    For `publish-service`:
    ```bash
    cd apps/publish-service
    npx prisma generate
    cd ../..
    ```

5.  **Run database migrations (for MySQL):**

    ```bash
    # For api-backend
    cd apps/backend
    npx prisma migrate dev --name init
    cd ../..

    # For publish-service (if it has its own migrations)
    # cd apps/publish-service
    # npx prisma migrate dev --name init
    # cd ../..
    ```

### Running the Project

Once all containers are up and running, and Prisma migrations are applied:

-   **Frontend:** Access the React application at `http://localhost:80`.
-   **API Backend:** The API will be running on `http://localhost:3000`.
    -   **Hello API:** `GET http://localhost:3000`
    -   **Post Message to Kafka:** `POST http://localhost:3000/message` with a JSON body (e.g., `{ "key": "value" }`).
    -   **Test Email Sending:** `POST http://localhost:3000/email/test` with a JSON body like:
        ```json
        {
          "to": "test@example.com",
          "subject": "Test Email from Social Kit",
          "body": "<h1>Hello from Social Kit!</h1><p>This is a test email sent from the backend.</p>"
        }
        ```
-   **Mailpit (Development SMTP):** Access the Mailpit web UI at `http://localhost:8025` to view sent emails.
-   **Grafana:** Access Grafana at `http://localhost:3001` (default credentials: `admin`/`admin`).

## Development

### Backend (Nest.js API)

-   **Location:** `apps/backend`
-   **Commands:**
    -   `npm install` (from `apps/backend` directory)
    -   `npm run start:dev`

### Kafka Consumer (Nest.js Microservice)

-   **Location:** `apps/publish-service`
-   **Commands:**
    -   `npm install` (from `apps/publish-service` directory)
    -   `npm run start:dev`

### Frontend (React)

-   **Location:** `apps/frontend`
-   **Commands:**
    -   `npm install` (from `apps/frontend` directory)
    -   `npm run dev`

## Contributing

Feel free to contribute to this project by submitting issues or pull requests.