import express from 'express';
import cors from 'cors';
import Stripe from 'stripe';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Prisma
const prisma = new PrismaClient();

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Middleware
app.use(cors());
app.use(express.json());

// ============ USER ROUTES ============

// Sync user from Clerk (called after login)
app.post('/api/users/sync', async (req, res) => {
  try {
    const { clerkId, email, name, imageUrl } = req.body;

    if (!clerkId || !email) {
      return res.status(400).json({ error: 'clerkId and email are required' });
    }

    const user = await prisma.user.upsert({
      where: { clerkId },
      update: { name, imageUrl, email },
      create: {
        clerkId,
        email,
        name,
        imageUrl,
        credits: 50, // Starting credits
      },
    });

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

// Update user credits
app.patch('/api/users/:clerkId/credits', async (req, res) => {
  try {
    const { clerkId } = req.params;
    const { amount } = req.body; // positive to add, negative to subtract

    const user = await prisma.user.update({
      where: { clerkId },
      data: {
        credits: { increment: amount },
      },
    });

    res.json({ credits: user.credits });
  } catch (error) {
    console.error('Error updating credits:', error);
    res.status(500).json({ error: 'Failed to update credits' });
  }
});

// ============ ANALYSIS ROUTES ============

// Save analysis result
app.post('/api/analyses', async (req, res) => {
  try {
    const { clerkId, imageUrl, predictions } = req.body;

    // Find user by Clerk ID
    const user = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check credits
    if (user.credits < 1) {
      return res.status(403).json({ error: 'Insufficient credits' });
    }

    // Find top prediction
    const topPrediction = predictions.reduce((prev, current) =>
      prev.probability > current.probability ? prev : current
    );

    // Create analysis and deduct credit
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
        data: { credits: { decrement: 1 } },
      }),
    ]);

    res.json({ analysis, remainingCredits: user.credits - 1 });
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

// ============ STRIPE PAYMENT ROUTES ============

// Create checkout session
app.post('/create-checkout-session', async (req, res) => {
  const { planId, planAmount, planCurrency, clerkId } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price_data: {
            currency: planCurrency || 'usd',
            product_data: {
              name: planId,
            },
            unit_amount: planAmount,
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        clerkId, // Store clerk ID for webhook processing
      },
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard/analysis?success=true`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard/analysis?cancelled=true`,
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

// Add credits (simple credit purchase)
app.post('/api/credits/purchase', async (req, res) => {
  const { clerkId, credits } = req.body;

  try {
    const user = await prisma.user.update({
      where: { clerkId },
      data: { credits: { increment: credits } },
    });

    res.json({ credits: user.credits });
  } catch (error) {
    console.error('Error purchasing credits:', error);
    res.status(500).json({ error: 'Failed to purchase credits' });
  }
});

// ============ HEALTH CHECK ============

app.get('/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'healthy', database: 'connected' });
  } catch (error) {
    res.status(500).json({ status: 'unhealthy', database: 'disconnected', error: error.message });
  }
});

// ============ START SERVER ============

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📦 Database: ${process.env.DATABASE_URL ? 'Connected to NeonDB' : 'Not configured'}`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
