import { Router, Response } from 'express';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { AuthRequest, authenticate, authorize } from '../middleware/auth.middleware';

const prisma = new PrismaClient();
const router = Router();

router.use(authenticate);

const customerSchema = z.object({
  phoneNumber: z.string().min(10),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email().optional(),
  address: z.string().optional(),
  notes: z.string().optional(),
  tags: z.string().optional(),
});

// ─── Get All Customers ──────────────────────────────────────
router.get('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { page = '1', limit = '50', search } = req.query;

    const where: any = {};
    if (search) {
      where.OR = [
        { firstName: { contains: search as string, mode: 'insensitive' } },
        { lastName: { contains: search as string, mode: 'insensitive' } },
        { phoneNumber: { contains: search as string } },
        { email: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    const [customers, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        include: {
          _count: { select: { callLogs: true, orders: true } },
          orders: { orderBy: { createdAt: 'desc' }, take: 3 },
        },
        orderBy: { createdAt: 'desc' },
        skip: (parseInt(page as string) - 1) * parseInt(limit as string),
        take: parseInt(limit as string),
      }),
      prisma.customer.count({ where }),
    ]);

    res.json({ customers, total });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ─── Lookup by Phone (for incoming call pop-up) ─────────────
router.get('/lookup/:phone', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const customer = await prisma.customer.findUnique({
      where: { phoneNumber: req.params.phone },
      include: {
        orders: { orderBy: { createdAt: 'desc' }, take: 5 },
        callLogs: {
          orderBy: { startTime: 'desc' },
          take: 5,
          select: { id: true, startTime: true, duration: true, notes: true, rating: true },
        },
      },
    });

    if (!customer) {
      // Auto-create for unknown callers
      const newCustomer = await prisma.customer.create({
        data: { phoneNumber: req.params.phone },
        include: { orders: true, callLogs: true },
      });
      res.json({ customer: newCustomer, isNew: true });
      return;
    }

    res.json({ customer, isNew: false });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ─── Get Single Customer ────────────────────────────────────
router.get('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const customer = await prisma.customer.findUnique({
      where: { id: req.params.id },
      include: {
        orders: { orderBy: { createdAt: 'desc' } },
        callLogs: {
          orderBy: { startTime: 'desc' },
          take: 20,
          include: { agent: { select: { firstName: true, lastName: true } } },
        },
      },
    });

    if (!customer) {
      res.status(404).json({ error: 'Customer not found' });
      return;
    }

    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ─── Create Customer ────────────────────────────────────────
router.post('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const data = customerSchema.parse(req.body);
    const customer = await prisma.customer.create({ data });
    res.status(201).json(customer);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation error', details: error.errors });
      return;
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ─── Update Customer ────────────────────────────────────────
router.put('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const data = customerSchema.partial().parse(req.body);
    const customer = await prisma.customer.update({
      where: { id: req.params.id },
      data,
    });
    res.json(customer);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation error', details: error.errors });
      return;
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ─── Delete Customer ────────────────────────────────────────
router.delete('/:id', authorize('ADMIN'), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await prisma.customer.delete({ where: { id: req.params.id } });
    res.json({ message: 'Customer deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
