# AdiShila Integrated Tech Stack

![AdiShila System](https://adishila-system.vercel.app/favicon.ico)

The **AdiShila Integrated Tech Stack** is a bespoke operational platform built for the AdiShila spiritual wellness brand. It serves as the central hub for 30 field teams and 5 administrators to collaborate, track progress, manage CRM leads, and earn Go-Brics Points (GBP).

**Live Demo:** [https://adishila-system.vercel.app](https://adishila-system.vercel.app)

---

## 🚀 Key Features

*   **Real-Time Data Sync:** Powered by Firebase Firestore, ensuring instantaneous updates across all users for tasks, leads, and content.
*   **CRM Pipeline:** Robust Lead tracking with real-time search, B2B/B2C multi-field filtering, and ascending/descending column sorting.
*   **Task Management & Auto-Credit:** Kanban-style task tracking with threaded comments. Moving a task to "Completed" dynamically auto-credits the assigned user's GBP pool.
*   **Content Scheduling:** Social media planning calendar with a dedicated Admin "Approve & Publish" workflow.
*   **Live Analytics:** Auto-updating SVG Pipeline Funnel and Content Timeline visualizations. Includes a 1-click `.csv` Export Report utility.
*   **Communication Hub:** Broadcast announcements and track personalized Onboarding Checklists.
*   **Premium "Liquid Glass" UI:** Modern, dynamic aesthetic with deep obsidian tones, striking gold highlights, glassmorphism translucency, and micro-animations. Fully responsive, including a mobile-first bottom navigation bar.

---

## 🛠️ Tech Stack

*   **Frontend:** React 19, TypeScript
*   **Build Tool:** Vite
*   **Database:** Firebase Firestore (Real-time DB)
*   **Styling:** Vanilla CSS (`index.css`) with global CSS variables and responsive breakpoints.
*   **Icons:** `lucide-react`
*   **Deployment:** Vercel

---

## ⚙️ Local Development Setup

To run the AdiShila System locally on your machine:

### 1. Clone the Repository
```bash
git clone https://github.com/akulattre-31/adishila-system.git
cd adishila-system
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory and add your Firebase configuration:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 4. Start the Development Server
```bash
npm run dev
```
Navigate to `http://localhost:5173` in your browser.

---

## ☁️ Deployment

The project is optimized for deployment on Vercel. A `vercel.json` file is included in the root to ensure React SPA routing (rewriting all traffic to `/index.html`) works flawlessly in production.

To deploy manually via the Vercel CLI:
```bash
vercel --prod
```

---

## 📚 Documentation

For an in-depth breakdown of the Firestore schema, user roles, permission tiers, and step-by-step usage guides, please refer to the internal documentation:
- [System Documentation](documentation.md)
- [Onboarding Session Notes](onboarding-session.md)
