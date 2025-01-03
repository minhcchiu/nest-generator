# NestJS Generator

This is a NestJS generator designed to accelerate the development of modern and scalable applications. With a set of pre-configured modules and tools, this generator enables rapid application setup, saving time for developers and improving code quality.

## Features

- **Modular Architecture**: Leverages NestJS's modular structure for easy maintenance and scalability.
- **MongoDB Integration**: Pre-configured MongoDB setup with Mongoose for schema-based data modeling and pagination.
- **Real-Time Communication**: Out-of-the-box support for real-time communication using Socket.IO and @nestjs/websockets.
- **Authentication & Authorization**: JWT-based authentication and role-based access control (RBAC) for secure user management.
- **File Uploads & Image Handling**: Integrated with Cloudinary for easy image and file handling with transformations and optimizations.
- **Email & Notifications**: Built-in email system using @nestjs-modules/mailer with support for SMTP and third-party providers.
- **Cache & Performance Optimization**: Redis integration for caching and improving application performance.
- **Testing Setup**: Jest pre-configured for unit tests, integration tests, and e2e testing. Coverage reports included.
- **Code Quality & Linting**: ESLint and Prettier integrated for consistent code style and quality.
- **Flexible Configuration Management**: Centralized configuration management using @nestjs/config for different environments.
- **Security**: Password hashing using argon2 for secure password storage.
- **Custom Middleware & Interceptors**: Easily extendable with custom middleware and interceptors for logging, validation, and exception handling.
- **API Query & Filtering**: Supports flexible filtering, sorting, and pagination with api-query-params.


## Directory and File Descriptions

- **.docker**: Contains files related to Docker configuration and custom setup for Docker containers.
- **.ecosystem**: Contains configuration files for PM2, which is used to manage the application in production.
- **.github**: Stores GitHub Actions configurations for continuous integration and deployment (CI/CD).
- **.husky**: Contains configuration for Husky git hooks to enforce linting, tests, and other pre-commit checks.
- **.nginx-configs**: Holds the configurations for deploying the application with Nginx as a reverse proxy.
- **.scripts**: Scripts for automating build, deployment, and other processes.
- **.vscode**: Contains settings for Visual Studio Code users, including recommended extensions and workspace settings.
- **aws**: Configuration files related to AWS, such as CloudFormation templates or AWS SDK setup.
- **dist**: The directory where the compiled output of the project is stored after running `npm run build`.
- **node_modules**: Standard directory for Node.js dependencies.
- **public**: Stores static files like images, fonts, and other assets that are served by the application.
- **sqls**: SQL files for database migrations, setup, and other database-related operations.
- **src**: The main source directory that contains all application-related code.
  - **base-inherit**: Contains base classes and interfaces for the application's core functionality.
  - **common**: Holds shared constants, utility functions, and helpers used throughout the app.
  - **configurations**: Stores configuration files like database connections, application settings, and other environment-specific configurations.
  - **exceptions**: Defines custom exception filters for centralized error handling.
  - **guards**: Contains authentication and authorization guards that control access to routes.
  - **helpers**: A collection of utility functions for general-purpose use in the application.
  - **keys**: Stores sensitive data such as encryption keys, third-party API keys, and more.
  - **middlewares**: Defines middlewares that can be used to intercept requests and responses.
  - **modules**: Feature-specific modules that group together related controllers, services, and other components.
  - **shared**: Common services and helpers used across different modules.
  - **utils**: Additional utility functions for generic application logic.
  - **app.controller.ts**: The root controller that manages incoming HTTP requests.
  - **app.module.ts**: The root module that imports and wires up other modules.
  - **app.service.ts**: The root service that contains the application's core business logic.
  - **bootstrap.ts**: Initializes and bootstraps the NestJS application.
  - **main.ts**: The main entry point to start the application.
- **test**: Contains test files for unit, integration, and end-to-end testing.
- **.dockerignore**: Specifies files to be ignored when building Docker images.
- **.editorconfig**: Defines file types and code style rules for consistent formatting across different editors.
- **.env**: Environment-specific configuration, including secrets and credentials for production.
- **.env.local**: Local environment configuration, used during development.
- **.eslintrc.js**: Configuration file for ESLint to enforce coding standards.
- **.gitignore**: Specifies files and directories that should be ignored by Git.
- **.prettierrc**: Configuration file for Prettier to ensure consistent code formatting.
- **commitlint.config.js**: Configures commit message linting to enforce conventional commit standards.
- **nest-cli.json**: NestJS CLI configuration that contains project-specific settings for the NestJS application.
- **package.json**: Metadata about the project, including dependencies, scripts, and versioning information.
- **pnpm-lock.yaml**: Lock file for `pnpm`, a fast and efficient package manager.
- **README.md**: The project's main README file, containing information about the project, its setup, and usage.
- **tsconfig.build.json**: TypeScript configuration specific to building the application.
- **tsconfig.json**: TypeScript configuration file for general project settings.

This structure is designed to make the application easy to maintain, scalable, and adaptable for different environments.
