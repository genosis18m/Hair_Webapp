# Hair Analysis WebApp

A modern web application for AI-powered hair analysis, built with React, TypeScript, and Vite.

## Features

- 🔐 **User Authentication** - Secure login with Clerk (GitHub, Google, Email)
- 📸 **Photo Analysis** - Upload or capture photos for AI hair analysis
- 🧠 **AI-Powered** - Uses Teachable Machine for hair classification
- 📊 **Analysis History** - View past analyses with confidence scores
- 💳 **Subscription Plans** - Stripe payment integration
- 🗄️ **PostgreSQL Database** - NeonDB for persistent data storage
- 💰 **Credit System** - Manage analysis credits per user

## Tech Stack

### Frontend
- React 18 + TypeScript
- Vite (Build tool)
- TailwindCSS (Styling)
- Clerk (Authentication)
- Stripe (Payments)
- Teachable Machine (AI Model)

### Backend
- Node.js + Express
- Prisma ORM
- NeonDB (PostgreSQL)
- Stripe API

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Clerk account (for authentication)
- Stripe account (for payments)
- NeonDB account (for database)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/genosis18m/Hair_Webapp.git
cd Hair_Webapp
```

2. **Install dependencies**
```bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install
```

3. **Configure environment variables**

**Frontend (.env)**
```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxx
VITE_CLERK_FRONTEND_API=xxx.clerk.accounts.dev
VITE_API_URL=http://localhost:5000
```

**Backend (.env)**
```env
STRIPE_SECRET_KEY=sk_test_xxx
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
```

4. **Set up the database**
```bash
cd backend
npx prisma db push
npx prisma generate
```

5. **Run the application**

```bash
# Terminal 1 - Backend
cd backend
node index.js

# Terminal 2 - Frontend
cd frontend
npm run dev
```

6. **Open in browser**
- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- Health Check: http://localhost:5000/health

## API Endpoints

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | `/api/users/sync` | Sync user from Clerk |
| GET    | `/api/users/:clerkId` | Get user profile |
| PATCH  | `/api/users/:clerkId/credits` | Update credits |

### Analysis
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | `/api/analyses` | Save analysis result |
| GET    | `/api/analyses/:clerkId` | Get analysis history |

### Payments
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | `/create-checkout-session` | Create Stripe checkout |
| POST   | `/api/credits/purchase` | Purchase credits |

## Project Structure

```
Hair_Webapp/
├── frontend/
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── services/      # API service layer
│   │   ├── styles/        # CSS styles
│   │   └── assets/        # Static assets
│   └── ...
├── backend/
│   ├── prisma/
│   │   └── schema.prisma  # Database schema
│   └── index.js           # Express server
└── README.md
```

## Database Schema

```prisma
model User {
  id        String   @id
  clerkId   String   @unique
  email     String   @unique
  credits   Int      @default(50)
  analyses  Analysis[]
}

model Analysis {
  id          String   @id
  userId      String
  topResult   String
  confidence  Float
  predictions Json
}
```

## License

MIT License
