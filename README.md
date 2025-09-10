# LinkBird - Lead Management Platform

A professional B2B SaaS platform for lead management and campaign tracking built with Next.js, TypeScript, and modern web technologies.

## 🚀 Features

- **Lead Management**: Comprehensive lead tracking with status updates, contact information, and campaign associations
- **Campaign Management**: Create, monitor, and analyze marketing campaigns with detailed metrics
- **Dashboard Analytics**: Real-time overview of campaign performance, lead statistics, and recent activity
- **Authentication**: Secure user authentication with email/password and Google OAuth integration
- **Responsive Design**: Modern, mobile-first UI built with Tailwind CSS and Radix UI components
- **Database Management**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Real-time Updates**: React Query for efficient data fetching and caching

## 🛠️ Tech Stack

### Frontend

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **React Query** - Data fetching and state management
- **Zustand** - Lightweight state management

### Backend

- **PostgreSQL** - Primary database
- **Drizzle ORM** - Type-safe database toolkit
- **Better Auth** - Authentication library
- **Zod** - Schema validation

### Development Tools

- **Bun** - Fast JavaScript runtime and package manager
- **ESLint** - Code linting
- **Drizzle Kit** - Database migrations and introspection

## 🗄️ Database Schema

The application uses PostgreSQL with the following main entities:

### Campaigns

- **id**: UUID primary key
- **name**: Campaign name
- **status**: Enum (draft, active, paused, completed)
- **totalLeads**: Total number of leads
- **successfulLeads**: Number of successful conversions
- **responseRate**: Percentage response rate
- **createdAt**: Creation timestamp

### Leads

- **id**: UUID primary key
- **name**: Lead's full name
- **email**: Contact email (unique)
- **company**: Company name
- **title**: Job title
- **campaignId**: Foreign key to campaigns table
- **status**: Enum (pending, contacted, responded, converted)
- **lastContactDate**: Last contact timestamp

## 📋 Prerequisites

Before running this project, make sure you have:

- **Bun** (recommended) or Node.js 18+
- **PostgreSQL** database
- **Google OAuth credentials** (optional, for social login)

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/abhirajthakur/kandid-assignment
cd kandid-assignment
```

### 2. Install dependencies

```bash
bun install # use any package npm, pnpm, yarn or bun
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/linkbird"

# Authentication
BETTER_AUTH_SECRET="your-secret-key-here"
BETTER_AUTH_URL="http://localhost:3000"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### 4. Database Setup

Generate and run database migrations:

```bash
# Generate migration files
bun run db:generate

# Apply migrations to database
bun run db:migrate

# Seed database with sample data
bun run db:seed
```

### 5. Start the development server

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.
