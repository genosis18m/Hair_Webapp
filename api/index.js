import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import Stripe from 'stripe';

const app = express();
const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Health check
app.get('/api/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'healthy', database: 'connected' });
  } catch (error) {
    res.status(500).json({ status: 'unhealthy', database: 'disconnected', error: error.message });
  }
});

// Sync user with backend (create if not exists)
app.post('/api/users/sync', async (req, res) => {
  try {
    const { clerkId, email, name, imageUrl } = req.body;

    let user = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          clerkId,
          email,
          name,
          imageUrl,
          credits: 50,
        },
      });
    } else {
      user = await prisma.user.update({
        where: { clerkId },
        data: { email, name, imageUrl },
      });
    }

    res.json({ user });
  } catch (error) {
    console.error('Error syncing user:', error);
    res.status(500).json({ error: 'Failed to sync user' });
  }
});

// Get user by Clerk ID
app.get('/api/users/:clerkId', async (req, res) => {
  try {
    const { clerkId } = req.params;

    const user = await prisma.user.findUnique({
      where: { clerkId },
      include: {
        analyses: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        subscription: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Save analysis result
app.post('/api/analyses', async (req, res) => {
  try {
    const { clerkId, imageUrl, predictions } = req.body;

    const user = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.credits < 20) {
      return res.status(403).json({ error: 'Insufficient credits. You need at least 20 credits.' });
    }

    const topPrediction = predictions.reduce((prev, current) =>
      prev.probability > current.probability ? prev : current
    );

    const [analysis] = await prisma.$transaction([
      prisma.analysis.create({
        data: {
          userId: user.id,
          imageUrl,
          predictions,
          topResult: topPrediction.className,
          confidence: topPrediction.probability,
        },
      }),
      prisma.user.update({
        where: { id: user.id },
        data: { credits: { decrement: 20 } },
      }),
    ]);

    res.json({ analysis, remainingCredits: user.credits - 20 });
  } catch (error) {
    console.error('Error saving analysis:', error);
    res.status(500).json({ error: 'Failed to save analysis' });
  }
});

// Get user's analysis history
app.get('/api/analyses/:clerkId', async (req, res) => {
  try {
    const { clerkId } = req.params;
    const { limit = 10 } = req.query;

    const user = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const analyses = await prisma.analysis.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit),
    });

    res.json({ analyses });
  } catch (error) {
    console.error('Error fetching analyses:', error);
    res.status(500).json({ error: 'Failed to fetch analyses' });
  }
});

// Create checkout session
app.post('/api/create-checkout-session', async (req, res) => {
  const { planId, planAmount, planCurrency } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: planCurrency || 'inr',
            product_data: {
              name: `${planId} Plan - Hair Analysis`,
              description: `Subscription to ${planId} plan`,
            },
            unit_amount: planAmount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard/analysis?success=true`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/?canceled=true`,
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Stripe error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Export for Vercel serverless
export default app;
