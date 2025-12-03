# Task Management Dashboard

## Project Overview

A secure, scalable task management platform with JWT authentication, real-time updates, and a beautiful dashboard experience.

## Getting Started

**Use your preferred IDE**

To work locally, clone this repo and follow these steps:

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

### Deploy to Vercel

1. **Connect your GitHub repository to Vercel:**
   - Go to [vercel.com](https://vercel.com) and sign in
   - Click "Add New Project"
   - Import your GitHub repository: `RajivRa12/Scalable-Web-App`
   - Vercel will auto-detect Vite settings

2. **Configure Environment Variables:**
   - In Vercel project settings, go to "Environment Variables"
   - Add the following variables:
     - `VITE_SUPABASE_URL` - Your Supabase project URL
     - `VITE_SUPABASE_PUBLISHABLE_KEY` - Your Supabase anon/public key

3. **Deploy:**
   - Click "Deploy"
   - Vercel will build and deploy your app automatically
   - Your app will be live at `https://your-project.vercel.app`

### Environment Variables

Make sure to set up your environment variables in Vercel (or your hosting platform):

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_key
```

**Note:** For Vite projects, environment variables must be prefixed with `VITE_` to be accessible in the browser.
