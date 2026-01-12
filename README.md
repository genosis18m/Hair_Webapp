# 💇 Hair Analysis WebApp

<div align="center">

![Hair Analysis Logo](frontend/src/assets/logo.png)

**AI-Powered Hair Health Analysis with Personalized Recommendations**

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-Visit_App-brightgreen?style=for-the-badge)](https://hair-analysis-app.vercel.app/)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-black?style=for-the-badge&logo=github)](https://github.com/genosis18m/Hair_Webapp)

</div>

---

## 🌟 Overview

Hair Analysis WebApp is a modern, full-stack web application that uses **AI/Machine Learning** to analyze your hair health from photos. Get instant insights about your hair type, health condition, and receive personalized product recommendations.

**🔗 Live Demo:** [https://hair-analysis-app.vercel.app/](https://hair-analysis-app.vercel.app/)

---

## ✨ Features

### 🔬 AI-Powered Analysis
- **Teachable Machine Integration** - Uses Google's Teachable Machine for hair type classification
- **Real-time predictions** with confidence scores
- **Multiple hair category detection** (Healthy, Damaged, Oily, Dry, etc.)

### 👤 User Management
- **Clerk Authentication** - Secure Google OAuth login
- **Credit System** - 20 credits per analysis, 50 free credits for new users
- **Persistent User Profiles** - Stored in PostgreSQL database

### 📊 Analysis Features
- **Photo Upload** - Upload hair images for analysis
- **Camera Capture** - Take photos directly in-app
- **Analysis History** - View all past analyses with images and results
- **Personalized Recommendations** - Product suggestions based on hair type

### 💳 Payment Integration
- **Stripe Checkout** - Secure payment processing
- **Multiple Plans** - Free, Pro (₹149/month), Unlimited (₹299/month)
- **Credit Packages** - Purchase additional analysis credits

### 🎨 Modern UI/UX
- **Dark/Light Mode** - Toggle with persistent preference
- **Responsive Design** - Works on mobile, tablet, and desktop
- **Glassmorphism UI** - Modern, premium visual design
- **Smooth Animations** - Enhanced user experience

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| ![React](https://img.shields.io/badge/React-18-61DAFB?logo=react) | UI Framework |
| ![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript) | Type Safety |
| ![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite) | Build Tool |
| ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-06B6D4?logo=tailwindcss) | Styling |
| ![React Router](https://img.shields.io/badge/React_Router-6-CA4245?logo=reactrouter) | Navigation |

### Backend
| Technology | Purpose |
|------------|---------|
| ![Node.js](https://img.shields.io/badge/Node.js-20-339933?logo=nodedotjs) | Runtime |
| ![Express](https://img.shields.io/badge/Express-4-000000?logo=express) | API Framework |
| ![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?logo=prisma) | ORM |
| ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql) | Database |

### Services
| Service | Purpose |
|---------|---------|
| ![Clerk](https://img.shields.io/badge/Clerk-Auth-6C47FF) | Authentication |
| ![Stripe](https://img.shields.io/badge/Stripe-Payments-008CDD?logo=stripe) | Payment Processing |
| ![NeonDB](https://img.shields.io/badge/NeonDB-Database-00E5FF) | Serverless PostgreSQL |
| ![Vercel](https://img.shields.io/badge/Vercel-Hosting-000000?logo=vercel) | Deployment |

### AI/ML
| Technology | Purpose |
|------------|---------|
| ![TensorFlow.js](https://img.shields.io/badge/TensorFlow.js-ML-FF6F00?logo=tensorflow) | Machine Learning |
| ![Teachable Machine](https://img.shields.io/badge/Teachable_Machine-AI-4285F4?logo=google) | Image Classification |

---

## 📁 Project Structure

```
Hair_Analysis_WebApp/
├── frontend/                 # React + Vite frontend
│   ├── src/
│   │   ├── assets/          # Images, logos, sponsor logos
│   │   ├── components/      # Reusable UI components
│   │   ├── context/         # React context (Theme)
│   │   ├── hooks/           # Custom hooks (useUserData)
│   │   ├── pages/           # Page components
│   │   ├── services/        # API service layer
│   │   └── styles/          # Component styles
│   ├── package.json
│   └── vite.config.ts
├── backend/                  # Express.js backend (local dev)
│   ├── prisma/
│   │   └── schema.prisma    # Database schema
│   ├── index.js             # API routes
│   └── package.json
├── api/                      # Vercel serverless functions
│   ├── index.js             # API handler
│   ├── prisma/              # Prisma schema
│   └── package.json
└── vercel.json              # Vercel configuration
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ 
- **npm** or **yarn**
- **Git**

### 1. Clone the Repository

```bash
git clone https://github.com/genosis18m/Hair_Webapp.git
cd Hair_Webapp
```

### 2. Set Up Backend

```bash
cd backend
npm install
```

Create `.env` file:
```env
DATABASE_URL=your_neondb_connection_string
STRIPE_SECRET_KEY=your_stripe_secret_key
```

Generate Prisma client and sync database:
```bash
npx prisma generate
npx prisma db push
```

Start the backend:
```bash
node index.js
```

### 3. Set Up Frontend

```bash
cd frontend
npm install
```

Create `.env` file:
```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
VITE_API_URL=http://localhost:5000
```

Start the frontend:
```bash
npm run dev
```

### 4. Open in Browser

Visit **http://localhost:5173**

---

## 🌐 Deployment (Vercel)

### One-Click Deploy

1. Push code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import your repository
4. Add environment variables:
   - `DATABASE_URL`
   - `STRIPE_SECRET_KEY`
   - `VITE_CLERK_PUBLISHABLE_KEY`
   - `VITE_STRIPE_PUBLISHABLE_KEY`
5. Deploy!

---

## 📱 Screenshots

| Home Page | Dashboard | Analysis |
|-----------|-----------|----------|
| Landing page with features, sponsors, and pricing | User dashboard with sidebar navigation | AI-powered hair analysis with results |

---

## 🔑 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Health check |
| `POST` | `/api/users/sync` | Sync/create user |
| `GET` | `/api/users/:clerkId` | Get user profile |
| `POST` | `/api/analyses` | Save analysis (deducts 20 credits) |
| `GET` | `/api/analyses/:clerkId` | Get analysis history |
| `POST` | `/api/create-checkout-session` | Create Stripe checkout |

---

## 💡 Usage

1. **Sign in** with Google via Clerk
2. **Navigate** to Dashboard → Analysis
3. **Upload** a photo or use camera capture
4. **Wait 5 seconds** for AI analysis
5. **View results** with hair type and confidence score
6. **Check history** for past analyses
7. **Purchase credits** when running low

---

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

---

## 📄 License

This project is for educational and demonstration purposes.

---

## 👨‍💻 Author

**Mohit Adoni**

- GitHub: [@genosis18m](https://github.com/genosis18m)

---

<div align="center">

**⭐ Star this repo if you found it helpful! ⭐**

Made with ❤️ using React, Node.js, and AI

</div>
