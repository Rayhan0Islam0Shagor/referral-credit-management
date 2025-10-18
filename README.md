# Referral Credit Management

A full-stack TypeScript application with separate frontend (Next.js) and backend (Express.js) directories.

## Project Structure

```
referral-credit-management/
├── backend/                 # Express.js API server
│   ├── src/
│   │   └── index.ts        # Main server file
│   ├── package.json        # Backend dependencies
│   ├── tsconfig.json       # TypeScript config
│   └── env.example         # Environment variables template
├── frontend/               # Next.js application
│   ├── src/
│   │   └── app/            # Next.js app directory
│   ├── package.json        # Frontend dependencies
│   ├── tsconfig.json       # TypeScript config
│   ├── next.config.ts      # Next.js configuration
│   └── README.md           # Frontend documentation
├── package.json            # Root package with scripts
└── README.md              # This file
```

## Tech Stack

### Backend

- **Node.js** with **Express.js**
- **TypeScript** for type safety
- **CORS** for cross-origin requests
- **Helmet** for security headers
- **dotenv** for environment variables

### Frontend

- **Next.js 15** with TypeScript App Router
- **React 19**
- **Tailwind CSS** for styling

## Quick Start

### 1. Install Dependencies

Run this command from the root directory to install all dependencies:

```bash
npm run install:all
```

This will install dependencies for:

- Root project (concurrently for running both servers)
- Backend project
- Frontend project

### 2. Environment Setup

Copy the environment example file in the backend directory:

```bash
cp backend/env.example backend/.env
```

The default configuration:

- Backend runs on port `3001`
- Frontend runs on port `3000` (Next.js default)
- Frontend can make API calls to backend

### 3. Run the Application

Start both frontend and backend servers simultaneously:

```bash
npm run dev
```

This will start:

- **Backend API**: http://localhost:3001
- **Frontend**: http://localhost:3000

## Available Scripts

### Root Level Commands

| Command                    | Description                                         |
| -------------------------- | --------------------------------------------------- |
| `npm run dev`              | Start both frontend and backend in development mode |
| `npm run dev:backend`      | Start only backend in development mode              |
| `npm run dev:frontend`     | Start only frontend in development mode             |
| `npm run build`            | Build both frontend and backend for production      |
| `npm run build:backend`    | Build only backend for production                   |
| `npm run build:frontend`   | Build only frontend for production                  |
| `npm run start`            | Start both applications in production mode          |
| `npm run start:backend`    | Start only backend in production mode               |
| `npm run start:frontend`   | Start only frontend in production mode              |
| `npm run install:all`      | Install dependencies for all projects               |
| `npm run install:backend`  | Install only backend dependencies                   |
| `npm run install:frontend` | Install only frontend dependencies                  |
| `npm run clean`            | Clean build directories for both projects           |

### Individual Commands

#### Backend

```bash
cd backend
npm run dev      # Start development server with hot reload
npm run build    # Build TypeScript to JavaScript
npm start        # Start production server
npm run clean    # Clean dist directory
```

#### Frontend

```bash
cd frontend
npm run dev      # Start Next.js development server
npm run build    # Build for production
npm start        # Start production server
npm run clean    # Clean .next directory
```

## Development Features

### Backend

- **Hot reload** with `tsx watch`
- **TypeScript** compilation
- **CORS** enabled for frontend communication
- **Security headers** with Helmet
- **Environment variables** support

### Frontend

- **Hot Module Replacement** with Next.js
- **TypeScript** support
- **App Router** with React Server Components
- **Tailwind CSS** for styling
- **Modern React** with hooks
- **Server-side rendering** capabilities

## Production Deployment

### Build for Production

```bash
npm run build
```

This creates:

- `backend/dist/` - Compiled JavaScript
- `frontend/.next/` - Built Next.js application

### Start Production Servers

```bash
npm start
```

### Environment Variables

Edit `backend/.env` to customize:

- `PORT` - Backend server port (default: 3001)
- `NODE_ENV` - Environment mode (development/production)
