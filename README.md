# Hair Analysis WebApp

A modern web application for hair analysis with AI-powered features, built with React, TypeScript, and Vite.

## Features

- 🔐 **User Authentication** - Secure login with Clerk (GitHub, Google, Email)
- 📸 **Photo Analysis** - Upload and analyze hair photos
- 💳 **Subscription Plans** - Stripe payment integration
- 🎨 **Modern UI** - Beautiful, responsive design with TailwindCSS

## Tech Stack

### Frontend
- React 18 + TypeScript
- Vite (Build tool)
- TailwindCSS (Styling)
- Clerk (Authentication)
- Stripe (Payments)
- React Three Fiber (3D Graphics)

### Backend
- Node.js + Express
- Stripe API Integration

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Clerk account (for authentication)
- Stripe account (for payments)

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

Create `.env` files based on the examples:

**Frontend (.env)**
```env
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_CLERK_FRONTEND_API=your_clerk_frontend_api
```

**Backend (.env)**
```env
STRIPE_SECRET_KEY=your_stripe_secret_key
```

4. **Run the application**

```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
cd frontend
npm run dev
```

5. **Open in browser**
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## Project Structure

```
Hair_Webapp/
├── frontend/           # React frontend application
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── pages/      # Page components
│   │   ├── styles/     # CSS styles
│   │   └── assets/     # Static assets
│   └── ...
├── backend/            # Express backend server
│   └── index.js        # Main server file
└── README.md
```

## License

MIT License
