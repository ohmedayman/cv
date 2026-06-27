import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest, authenticate, authorize } from '../middleware/auth.middleware';

const prisma = new PrismaClient();
const router = Router();

router.use(authenticate);

// ─── Get All Queues ─────────────────────────────────────────
router.get('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const queues = await prisma.queue.findMany();

    // Get live queue stats
    const queueStats = await prisma.callLog.groupBy({
      by: ['toNumber'],
      where: { status: 'QUEUED' },
      _count: true,
    });

    res.json({ queues, stats: queueStats });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ─── Create Queue ───────────────────────────────────────────
router.post('/', authorize('ADMIN'), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, description, strategy, maxWaitTime } = req.body;
    const queue = await prisma.queue.create({
      data: { name, description, strategy, maxWaitTime },
    });
    res.status(201).json(queue);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ─── Get Queue Members ──────────────────────────────────────
router.get('/:id/members', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const agents = await prisma.user.findMany({
      where: { role: 'AGENT', status: 'AVAILABLE' },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        sipExtension: true,
        status: true,
      },
    });

    res.json(agents);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
