# NestJS Generator

A powerful NestJS generator designed to streamline the development of modern, scalable applications. This tool provides a pre-configured setup with best practices, saving time and improving code quality.

## 🚀 Features

- **Modular Architecture** - Leverages NestJS's module system for maintainability and scalability.
- **MongoDB Integration** - Pre-configured with Mongoose for schema-based data modeling and efficient pagination.
- **Real-Time Communication** - Built-in WebSockets using `@nestjs/websockets` and Socket.IO.
- **Authentication & Authorization** - JWT-based authentication and role-based access control (RBAC).
- **File Upload & Image Handling** - Cloudinary integration for seamless file management.
- **Email & Notifications** - Pre-configured mail system using `@nestjs-modules/mailer` with SMTP and third-party provider support.
- **Caching & Performance Optimization** - Redis integration for enhanced performance.
- **Comprehensive Testing** - Jest setup for unit, integration, and end-to-end (E2E) testing.
- **Code Quality & Linting** - Enforces best practices with ESLint and Prettier.
- **Flexible Configuration** - Centralized app settings using `@nestjs/config` for different environments.
- **Security Best Practices** - Password hashing with Argon2 and custom middleware for logging & validation.
- **API Query & Filtering** - Advanced filtering, sorting, and pagination support via `api-query-params`.

---

## 📂 Project Structure

```
nestjs-generator/
│── .docker/           # Docker configuration files
│── .ecosystem/        # PM2 process manager configurations
│── .github/           # GitHub Actions CI/CD workflows
│── .husky/            # Git hooks for linting and testing enforcement
│── .nginx-configs/    # Nginx reverse proxy configurations
│── .scripts/          # Utility scripts for build & deployment automation
│── .vscode/           # VSCode settings and recommended extensions
│── aws/               # AWS-related configurations and infrastructure templates
│── dist/              # Compiled output after `npm run build`
│── node_modules/      # Project dependencies
│── public/            # Static assets (images, fonts, etc.)
│── sqls/              # Database migration SQL scripts
│── src/               # Application source code
│   ├── base-inherit/      # Base classes and interfaces
│   ├── common/            # Shared constants, utilities, and helpers
│   ├── configurations/    # Centralized configuration files
│   ├── exceptions/        # Custom exception filters
│   ├── guards/            # Authentication & authorization guards
│   ├── helpers/           # Utility functions
│   ├── keys/              # Encryption keys & API credentials (ensure security!)
│   ├── middlewares/       # Custom request/response interceptors
│   ├── modules/           # Feature-specific modules (controllers, services, repositories)
│   ├── shared/            # Common services used across modules
│   ├── utils/             # Additional helper utilities
│   ├── app.controller.ts  # Root controller
│   ├── app.module.ts      # Root module
│   ├── app.service.ts     # Core business logic
│   ├── bootstrap.ts       # App bootstrap initialization
│   ├── main.ts            # Application entry point
│── test/              # Unit, integration, and E2E test cases
│── .dockerignore      # Excludes files from Docker builds
│── .editorconfig      # Editor-specific formatting rules
│── .env              # Environment variables (production settings)
│── .env.local        # Local development environment variables
│── .eslintrc.js      # ESLint configuration
│── .gitignore        # Files and folders ignored by Git
│── .prettierrc       # Prettier configuration for code formatting
│── commitlint.config.js # Commit message linting (enforces conventional commits)
│── nest-cli.json     # NestJS CLI configuration
│── package.json      # Project metadata, scripts, and dependencies
│── pnpm-lock.yaml    # Lock file for dependency versioning
│── README.md         # Project documentation
│── tsconfig.build.json # TypeScript build configuration
│── tsconfig.json     # TypeScript compiler settings
```

---

## 📦 Installation & Usage

### Prerequisites
- Node.js (>=16.x)
- PNPM / NPM / Yarn
- MongoDB
- Redis (optional but recommended)

### Setup
```bash
# Clone the repository
git clone https://github.com/your-username/nestjs-generator.git
cd nestjs-generator

# Install dependencies
pnpm install  # or `npm install` / `yarn install`
```

### Run Application
```bash
# Development mode
pnpm run start:dev

# Production mode
pnpm run build && pnpm run start:prod
```

### Testing
```bash
# Run unit tests
pnpm run test

# Run end-to-end tests
pnpm run test:e2e

# Check test coverage
pnpm run test:cov
```

### Linting & Formatting
```bash
# Run ESLint
pnpm run lint

# Format with Prettier
pnpm run format
```

---

## 🛠️ Deployment

### Docker Setup
```bash
# Build and run the application in a container
docker-compose up -d --build
```

### PM2 Process Manager
```bash
# Start the application using PM2
pm run pm2:start
```

---

## 📜 License
This project is licensed under the **MIT License**.

---

## 🤝 Contributing
Contributions are welcome! To contribute:
1. Fork the repository
2. Create a new feature branch (`git checkout -b feature-name`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature-name`)
5. Open a Pull Request 🚀

---

## 📫 Contact
- **GitHub**: [minh-chiu](https://github.com/minh-chiu)
- **Email**: minhchiu.official@gmail.com

---

This **NestJS Generator** provides a well-structured, scalable, and production-ready setup, making development faster and more efficient! 🚀
