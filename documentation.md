# AdiShila System Documentation

## Architecture Overview
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

## Firestore Schema

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
  - `id` (string)
  - `authorId` (string)
  - `text` (string)
  - `timestamp` (ISO string)

### `leads` Collection
- `id` (string)
- `name` (string)
- `city` (string)
- `tier` (B2B | B2C)
- `skuInterest` (string)
- `phone` (string)
- `lastContact` (ISO string)
- `status` (Cold | Warm | Hot | Converted)
- `notes` (string)
- `source` (string)
- `assigneeId` (string)
- `assigneeName` (string)

### `content` Collection
- `id` (string)
- `title` (string)
- `platform` (string)
- `persona` (string)
- `sku` (string)
- `scheduledDate` (ISO string)
- `status` (Draft | Scheduled | Published)
- `gbpEarned` (number)
- `authorId` (string)

### `announcements` Collection
- `id` (string)
- `text` (string)
- `author` (string)
- `date` (ISO string)

### `notifications` Collection
- `id` (string)
- `type` (string)
- `message` (string)
- `timestamp` (ISO string)
- `read` (boolean)

## State Management (`AppContext.tsx`)
The `AppContext` is the central nervous system. It initializes `onSnapshot` listeners to Firestore collections, caching the synchronized data in React state.
It also houses centralized mutations (`addLead`, `updateTask`, etc.) ensuring UI actions optimisticly or seamlessly sync to the cloud.

## Key Mechanisms
- **GBP Auto-Credit**: When a task moves to "Completed", the system dynamically credits the assigned user's GBP pool.
- **Notification System**: Most mutation operations (adding leads, completing tasks, publishing content) dispatch a notification event.
- **Error Boundaries**: A global React ErrorBoundary prevents localized component crashes from taking down the entire SPA.
- **Responsive Layout**: The sidebar collapses into a fixed bottom navigation bar on mobile devices.
