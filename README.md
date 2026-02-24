This README.md provides a comprehensive guide for your project, incorporating the specific architecture and deployment requirements you defined.

# Next.js & Supabase Starter

This project is a robust boilerplate for building full-stack applications using Next.js for the frontend and Supabase for the backend. It includes a pre-configured CI/CD pipeline for automated database migrations and frontend deployments via GitHub Actions.

## Prerequisites

To develop on this project, ensure your machine meets the following requirements:
*   **Node.js**: Version 22 or higher.
*   **Docker**: Installed and running (required for local Supabase containers).
*   **Package Manager**: npm (standard with Node.js).

## Quick Start

To initialize the project into a usable state, run the following command from the project root:

```bash
node setup.js
```

This script automates the following tasks:
1. Installs all required Node.js packages from npm.
2. Initializes the Supabase local environment via Node and Docker.
3. Starts the Supabase services.

Once the script completes, the project should run locally without further configuration.

After intialization, you can start and stop each service using the following commands in your terminal:

### *Frontend Next JS Application*

Start:
```bash
npm run dev
```
Stop:

`CTRL+C` where `npm run dev` was started from

### *Backend Supabase Local Deployment*

Start:
```bash
npx supabase start
```

Stop:
```bash
npx supabase stop
```

## Manual Setup

If you prefer to set up the environment step-by-step:

1. **Install Dependencies**:
   ```bash
   npm install
   ```
2. **Initialize Supabase**:
   ```bash
   npx supabase init
   ```
3. **Start Local Database**:
   ```bash
   npx supabase start
   ```
4. **Add Environment Variables to `.env.local` File**
    ```bash
    NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=REPLACE_WITH_SUPABASE_PUBLISHABLE_KEY
    ```

## Project Structure

The project follows a standard Next.js directory structure with a focus on modularity:

*   `/components`: Reusable frontend UI components.
*   `/lib`: Helper functions and utility TypeScript files.
*   `/types`: Global TypeScript interface and type definitions.
*   `/supabase`: Contains migrations and database configuration files.

## Starting New Projects

To use this starter as a template for a new project:

1. Clone the repository to your local machine.
2. Remove the existing git history:
   ```bash
   rm -rf .git
   ```
3. Initialize a new git repository:
   ```bash
   git init
   ```
4. Set your new remote repository:
   ```bash
   git remote add origin <your-github-repo-url>
   ```

## Environment Variables

Ensure the following variables are defined in your `.env.local` for local development and in GitHub Secrets for production.

| Variable | Description |
| :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | The API URL for your Supabase project. |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | The `anon` public key for client-side auth. |
| `SUPABASE_SERVICE_ROLE_KEY` | Private key for bypass RLS (Server-side only). |

## Database Schema & Authentication

### Authentication Flow
Users are authenticated via email and password using Supabase's built-in Auth system and JWT tokens. 

### User Profiles
Every user in the `auth.users` table has a corresponding entry in the `public.profiles` table linked via the `id` foreign key.
*   `id`: UUID (Primary Key, references `auth.users`).
*   `email`: User's email address.
*   `first_name`: User's given name.
*   `last_name`: User's family name.
*   `created_at`: Timestamp of account creation.
*   `updated_at`: Timestamp of last modification (automatically updated via trigger).

## Deployment

### Production Deploy
To deploy to production, simply push your changes to the `main` branch. 

```bash
git add .
git commit -m "feat: your feature description"
git push origin main
```

### GitHub Actions Configuration
The included workflow automates database migrations and Vercel deployments. You must add the following secrets to your GitHub Repository Settings:

#### Supabase Secrets
*   `SUPABASE_ACCESS_TOKEN`: Generate in Supabase Dashboard -> Account -> Access Tokens.
*   `SUPABASE_PROJECT_ID`: Found in Supabase Dashboard -> Project Settings -> General.
*   `SUPABASE_DB_PASSWORD`: The password you set when creating the Supabase project.

#### Vercel Secrets
*   `VERCEL_TOKEN`: Generate in Vercel Account Settings -> Tokens.
*   `VERCEL_ORG_ID`: Found in Vercel Team/Account Settings -> General.
*   `VERCEL_PROJECT_ID`: Found in Vercel Project Settings -> General.

#### Project Secrets:
*   `NEXT_PUBLIC_SUPABASE_URL`: The public URL for your deployed Supabase database for the project.
*   `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`: The publishable key from the Supabase dashboard for the project.
*   `SUPABASE_SERVICE_ROLE_KEY`: The private key from the Supabase database project settings from API Keys page.


#### IMPORTANT: Disable Vercel Auto-Build
To prevent double-billing and ensure migrations run before the frontend build:
1. Go to Vercel Project Settings -> Git.
2. Find **Ignored Build Step**.
3. Enter `exit 0` in the command field.
4. This ensures only the GitHub Action performs the deployment.

## Troubleshooting

*   **Docker Errors**: Ensure Docker Desktop is running and you have sufficient permissions to manage containers.
*   **Migration Mismatch**: If the remote database schema diverges, run `supabase db remote commit` to sync your local state.
*   **Vercel Build Failure**: Ensure all `NEXT_PUBLIC_` variables are added to the GitHub Secrets as the build happens on the runner.
*   **Port Conflicts**: If port 5432 is already in use by a local Postgres installation, modify the `config.toml` in the supabase folder to use a different port.