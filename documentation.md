# AdiShila System Documentation

## Section 11 — Architecture & Firebase Schema
The AdiShila tech stack is a **React 19 + TypeScript + Vite** single-page application.
It uses **Firebase Firestore** as its real-time data layer, replacing the initial local storage setup to allow 30 field teams and 5 admins to collaborate simultaneously.

### Tech Stack
- **Frontend Framework**: React 19 (Hooks, Context API)
- **Typing**: TypeScript (Strict mode enabled)
- **Build Tool**: Vite
- **Database**: Firebase Firestore
- **Icons**: `lucide-react`
- **Styling**: Vanilla CSS (`index.css`) with CSS Variables for theme consistency

### System Modules
1. **Dashboard**: High-level overview of metrics and progress towards the 1,000 unit breakeven goal.
2. **Task Management**: Assignment and grading of operational tasks (S, A, B, C grades) with built-in task comments.
3. **CRM**: Pipeline tracking for B2B and B2C leads, featuring real-time search, multi-field filtering, and column sorting.
4. **Content Schedule**: Social media planning for Instagram, WhatsApp, Amazon.in, and IndiaMART.
5. **Analytics**: Real-time sales visualization with an SVG Pipeline Funnel, timeline charts, and a CSV export utility.
6. **Communication Hub**: Team announcements and a persistent onboarding checklist.

## Section 12 — Firestore Schema

### `users` Collection
- `id` (string)
- `name` (string)
- `role` (Member | Admin | Chief Administrator)
- `teamId` (string)
- `gbp` (number)
- `onboardingComplete` (boolean)

#### `users/{userId}/onboarding/data` (Sub-document)
- `checklist` (boolean[])

### `tasks` Collection
- `id` (string)
- `title` (string)
- `grade` (string)
- `gbp` (number)
- `status` (Pending | In Progress | Completed)
- `assigneeId` (string)
- `comments` (Array of objects)

### `leads` Collection
- `id` (string)
- `name` (string)
- `city` (string)
- `tier` (B2B | B2C)
- `skuInterest` (string)
- `phone` (string)
- `lastContact` (ISO string)
- `status` (Cold | Warm | Hot | Converted)
- `assigneeId` (string)

### `content` Collection
- `id` (string)
- `title` (string)
- `platform` (string)
- `status` (Draft | Scheduled | Published)
- `authorId` (string)

### `announcements` & `notifications` Collections
- Basic objects containing `text`/`message`, `author`, `date`/`timestamp`.

## Section 13 — State Management & Mobile Guide
The `AppContext` is the central nervous system. It initializes `onSnapshot` listeners to Firestore collections, caching the synchronized data in React state.
- **GBP Auto-Credit**: When a task moves to "Completed", the system dynamically credits the assigned user's GBP pool.
- **Notification System**: Most mutation operations dispatch a notification event.
- **Mobile Guide**: The sidebar collapses into a fixed bottom navigation bar on mobile devices.

---

## Section 1 — System Overview
The AdiShila Integrated Tech Stack is a bespoke operational platform built using React and Vite. It serves as the central hub for Task Management, CRM, Content Scheduling, Analytics, and Internal Communications. The system is designed as a fast, responsive Single Page Application (SPA) leveraging React Context and Firebase to provide a robust, concurrent-ready architecture, prioritizing immediate deployment and offline-capable field usage.

### Architecture Diagram
```
[ User Browser (Mobile-first) ]
         |
[ React SPA (Vite + TS) ]
         |
[ State Manager (React Context) ]
         |
[ Live Persistence (Firebase Firestore) ]
```

### Live System URL
[https://adishila-system.vercel.app](https://adishila-system.vercel.app)

---

## Section 2 — Module Descriptions

- **Task Management**: A centralized kanban/list system to track all GO-BRICS operational tasks (e.g., PR05, T14). It highlights high-priority Grade S tasks and tracks the GBP value associated with each assignment.
- **CRM (Customer Relationship Management)**: A lead pipeline to manage B2B inquiries (e.g., from IndiaMART) and B2C direct customers. It tracks the customer persona, SKU interest, and pipeline status (Cold/Warm/Hot/Converted).
- **Content Scheduling**: A robust calendar system to plan and schedule multi-channel content (Instagram Reels, WhatsApp Broadcasts). It supports tagging content with specific target personas (Arjun/Priya/Riya) and products.
- **Analytics Dashboard**: A high-level visual dashboard tracking real-time GBP earnings across the 30 teams on a leaderboard, while monitoring cumulative monthly sales volume against breakeven thresholds (50, 200, 500, 1000 units).
- **Communication Hub**: An internal messaging module for Tech Leads and Admins to push announcements, distribute the Sales Guide, and provide an onboarding checklist for new field members.

---

## Section 3 — Permission Tier Guide

| Feature / Action | Tier 1 (Member) | Tier 2 (Admin) | Tier 3 (Chief Admin) |
| :--- | :---: | :---: | :---: |
| View own tasks and GBP score | ✅ | ✅ | ✅ |
| Log new leads & update status | ✅ | ✅ | ✅ |
| Submit content for scheduling | ✅ | ✅ | ✅ |
| View full CRM pipeline | ❌ | ✅ | ✅ |
| Approve & Publish Content | ❌ | ✅ | ✅ |
| Post Team Announcements | ❌ | ✅ | ✅ |
| Edit Permission Tiers | ❌ | ❌ | ✅ |
| Final sign-off & Override | ❌ | ❌ | ✅ |

**Assigning Tiers:**
Currently, roles are hardcoded for the demo. In a live database environment, the Chief Administrator can assign roles via the Settings module.

---

## Section 4 — Product & SKU Reference

| SKU Name | Wholesale (MWP) | MRP | Margin | MOQ | Target Persona | GBP/Sale |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Kavach Shield — OM** | ₹800 | ₹1,499 | ~47% | 50 pcs | Arjun, Riya | 75 |
| **Kali Yuga Lingam** | ₹1,700 | ₹3,499 | ~51% | 25 pcs | Priya, Arjun | 165 |
| **Vastu Dosh Pyramid** | ₹1,100 | ₹2,199 | ~50% | 25 pcs | Priya | 120 |
| **Rudra-Shila Raksha Mala** | ₹900 | ₹1,499 | ~40% | 50 pcs | Arjun | 90 |
| **Amrit Jal Shuddhi Set** | ₹950 | ₹1,999 | ~52% | 25 sets | Priya | 105 |
| **Trishul Shield** | ₹800 | ₹1,499 | ~47% | 50 pcs | Arjun, Riya | 75 |
| **Shila Raksha Pendant** | ₹700 | ₹1,299 | ~46% | 50 pcs | Riya | 75 |

---

## Section 5 — CRM Usage Guide

1. **Logging an IndiaMART Lead**: Navigate to the CRM tab and click `+ Log New Lead`. Fill in the contact details and ensure "IndiaMART" is set as the source.
2. **Updating Lead Status**: Locate your lead in the table and use the dropdown menu in the Status column to advance them from Cold → Warm → Hot → Converted.
3. **Filtering**: Use the search and filter functions to isolate leads by city or SKU interest.
4. **Exporting**: The Sales Lead can use the `Export Report` button on the Analytics page to download the current pipeline.

---

## Section 6 — GBP Tracking Guide

1. **Earning GBP**: You earn GBP by completing assigned GO-BRICS tasks, logging converted sales (see SKU table for rates), or when your scheduled content hits view milestones (e.g., 10K views = +200 GBP).
2. **Claiming GBP**: When a task is moved to `Completed` in the Task Management module, the GBP is automatically credited to the assignee's profile.
3. **Leaderboard**: The Analytics module displays a live leaderboard tracking all members' GBP scores to encourage team competition.

---

## Section 7 — Content Scheduling Guide

1. **Submitting Content**: Go to the Content Schedule tab. Click `+ Schedule Content`.
2. **Tagging**: Ensure you select the correct Platform (e.g., WhatsApp) and target Persona (e.g., Priya for Hindi broadcasts).
3. **Approval Pipeline**: Members submit content as "Draft". Admins review and click `Approve & Publish`.
4. **Hindi Content**: Hindi content for the Priya persona (e.g., family packs) should be strictly tagged to WhatsApp broadcasts.

---

## Section 8 — Analytics & Reporting Guide

1. **Sales Tracker**: Monitor the current monthly volume via the progress bar in the Analytics tab.
2. **Breakeven Targets**: The tracker visualizes progress toward marginal (50), viable (200), strong (500), and target (1000) unit thresholds.
3. **Exporting**: Click `Export Report` to generate a summary for the Chief Administrator's weekly review.

---

## Section 9 — Onboarding Checklist for New Members

**Day 1 Checklist:**
1. ✅ **Receive system access link** from your Admin.
2. ✅ **Set up profile**: Log in, verify your name, city, and WhatsApp number.
3. ✅ **Read the AdiShila Sales Guide**: Accessible via the Communication Hub.
4. ✅ **Review the 7 SKU library**: Familiarize yourself with the products in the Analytics tab.
5. ✅ **Log your first CRM lead**: Enter a B2B or B2C contact in the CRM tab.
6. ✅ **Check assigned tasks**: Navigate to Task Management and filter by "My Tasks".
7. ✅ **Understand GBP rules**: Review Section 6 of this document.

---

## Section 10 — Troubleshooting & FAQs

- **Q: What if I can't access the system?**
  A: Ensure you are using the correct live URL. If it fails, clear your browser cache (LocalStorage) or contact the Tech Lead.
- **Q: How to report a CRM data error?**
  A: Add a comment to the specific lead or post an alert in the Communication Hub.
- **Q: Who to contact for Tech Lead escalation?**
  A: Post an announcement tagged `[ESCALATION]` or contact the Tech Lead directly via WhatsApp.
- **Q: How to request a feature change?**
  A: Create a new Task in the Task Management module with Grade 'C' and assign it to the Tech Lead.
