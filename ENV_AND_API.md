# Environment Variables and API Documentation

This document outlines the environment variables required to run the application and how to access the API documentation using Swagger.

## Environment Variables

### Required Variables

The following environment variables are essential for the application to function correctly:

- **`PORT`**: Specifies the port number on which the server will listen for incoming requests.
  - **Example:** `PORT=3000`
  - **Description:** This is the port that the application will use to serve requests.
- **`SERVER_IP`**: Specifies the IP address that the server will bind to.
  - **Example:** `SERVER_IP=127.0.0.1`
  - **Description:** This is the IP address that the application will use to serve requests.

### Setting Environment Variables

The method for setting environment variables depends on your operating system and environment. Here are a few common approaches:

- **Directly in the terminal (for temporary use):**
  ```bash
  export PORT=3000
  export SERVER_IP=127.0.0.1
  ```
- **In a `.env` file (recommended for development):**
  Create a `.env` file in the root directory of your project and add the variables:
  ```
  PORT=3000
  SERVER_IP=127.0.0.1
  ```
  Then, use a library like `dotenv` (in Node.js) or similar to load these variables into your application.
- **In your operating system's environment settings (for persistent use):**
  This method varies depending on your OS (e.g., Control Panel in Windows, `~/.bashrc` or `~/.zshrc` in Linux/macOS).

## API Documentation with Swagger

Swagger is used to generate interactive API documentation, making it easy to understand and test the application's endpoints.

### Accessing the Swagger UI

1.  **Start the Application:** Ensure that the application is running.
2.  **Navigate to the Swagger Endpoint:** Open your web browser and go to the Swagger UI endpoint. Typically, this is located at:
    - `http://<SERVER_IP>:<PORT>/docs`
    - Replace `<SERVER_IP>` and `<PORT>` with the actual values you've configured. For example, if you're running locally and using port 3000, the URL would be `http://127.0.0.1:3000/docs`.

## Conclusion

Properly configuring environment variables and utilizing Swagger documentation are crucial for developing, testing, and deploying the application. This guide provides the necessary information to get started.
