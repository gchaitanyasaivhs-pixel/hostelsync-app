# HostelSync Production Deployment Guide

HostelSync has been completely re-engineered into a modern, serverless **MERN-equivalent architecture** powered natively by **React (Vite)** and **Firebase (Auth + Firestore)**.

Follow these strict steps to take this system into production.

---

## Part 1: Initializing Firebase (The Master Backend)

1. **Create the Project**: Open the [Firebase Console](https://console.firebase.google.com/), click "Add Project", and name it `HostelSync`.
2. **Enable Authentication**:
   - Navigate to **Build > Authentication**.
   - Click **Get Started** and enable the **Email/Password** provider.
3. **Initialize Firestore**:
   - Navigate to **Build > Firestore Database**.
   - Click **Create Database**. Start in **Production Mode**.
   - Choose a geographic location close to your primary users.
4. **Deploy Security Rules**:
   - In the Firestore tab, navigate to the **Rules** section.
   - Copy the contents of the `firestore.rules` file generated in your repository and paste it exactly, then click **Publish**.
5. **Generates Keys**:
   - Go to **Project Settings** (the gear icon on the top left).
   - Under the "Your Apps" section, click the `</>` (Web) icon to register an app.
   - Name it `HostelSync Web`.
   - Copy the generated `firebaseConfig` object and populate it inside your local project at `src/services/firebase/config.js`.

---

## Part 2: Preparing the Frontend for Production

1. Navigate into the freshly generated project folder:
   ```bash
   cd d:\software\Antigravity\hostelsync-app
   ```
2. Build the optimized static assets:
   ```bash
   npm run build
   ```
   *(This ensures Vite utilizes Tailwind 4's new engine correctly and validates syntaxes).*

---

## Part 3: Deploying to Vercel (Frontend Hosting)

Vercel provides native, extreme-performance edge deployment for Vite React apps.

1. **Push to GitHub**: Initialize a Git repository in `hostelsync-app` and push it to a private GitHub repo.
2. **Import to Vercel**: 
   - Log into [Vercel](https://vercel.com/) and click **Add New > Project**.
   - Select your newly created GitHub repository.
3. **Configure Settings**:
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. **Deploy**: Click the deploy button. Upon completion, Vercel will grant you a highly optimized production URI (e.g., `https://hostelsync-prod.vercel.app`).

## Part 4: Seeding The Initial Administrator
Since `HostelSync` utilizes strict role-based access checks (RBAC) natively in Firestore:
1. Load the new Vercel URI.
2. Click **Create an Account**. Sign up with your intended master email and select the `Administrator` account type.
3. Your database `users` collection is now seeded with your primary Admin node. You may now access the administrative backend to dynamically inject new Hostel listings!
