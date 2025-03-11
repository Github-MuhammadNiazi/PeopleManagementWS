# People Management Web Service

This repository contains the People Management Web Service, which includes both the API and the web client.

## API

The API is built using Node.js and Express. It includes various routes, middlewares, and database configurations.

### Getting Started

1. Install dependencies:
    ```sh
    cd api
    npm install
    ```

2. Create a `.env` file in the `api` directory with the following variables:
    ```
    DB_USER=<your_db_user>
    DB_HOST=<your_db_host>
    DB_NAME=<your_db_name>
    DB_PASSWORD=<your_db_password>
    DB_PORT=<your_db_port>
    JWT_SECRET=<your_jwt_secret>
    ```

3. Start the server:
    ```sh
    npm start
    ```

### Directory Structure

- `bin/www`: Entry point for the API server.
- `db/`: Database configuration and controllers.
- `middlewares/`: Custom middleware functions.
- `routes/`: API routes and controllers.
- `schemas/`: Request validation schemas.
- `utils/`: Utility functions and constants.

## Web Client

The web client is built using React and TypeScript, with Vite as the build tool.

### Getting Started

1. Install dependencies:
    ```sh
    cd web
    npm install
    ```

2. Start the development server:
    ```sh
    npm run dev
    ```

### Directory Structure

- `src/`: Source code for the React application.
- `public/`: Public assets and index.html.
- `scss/`: SCSS stylesheets.

## License

This project is licensed under the MIT License.
