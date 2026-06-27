import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const passwordHash = await bcrypt.hash('password123', 12);

  // Create admin user
  await prisma.user.upsert({
    where: { email: 'admin@callcenter.com' },
    update: {},
    create: {
      email: 'admin@callcenter.com',
      passwordHash,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      sipExtension: '100',
      status: 'AVAILABLE',
    },
  });

  // Create agent users
  const agents = [
    { email: 'agent1@callcenter.com', firstName: 'Ahmed', lastName: 'Ali', ext: '101' },
    { email: 'agent2@callcenter.com', firstName: 'Sara', lastName: 'Mohamed', ext: '102' },
    { email: 'agent3@callcenter.com', firstName: 'Omar', lastName: 'Hassan', ext: '103' },
    { email: 'supervisor@callcenter.com', firstName: 'Fatima', lastName: 'Khaled', ext: '104', role: 'SUPERVISOR' },
  ];

  for (const agent of agents) {
    await prisma.user.upsert({
      where: { email: agent.email },
      update: {},
      create: {
        email: agent.email,
        passwordHash,
        firstName: agent.firstName,
        lastName: agent.lastName,
        role: agent.role || 'AGENT',
        sipExtension: agent.ext,
        status: 'AVAILABLE',
      },
    });
  }

  // Create sample customers
  const customers = [
    { phoneNumber: '+966501234567', firstName: 'محمد', lastName: 'العلي', email: 'mohammed@example.com' },
    { phoneNumber: '+966509876543', firstName: 'نورة', lastName: 'السالم', email: 'noura@example.com' },
    { phoneNumber: '+966505551234', firstName: 'خالد', lastName: 'الشمري', email: 'khalid@example.com' },
  ];

  for (const customer of customers) {
    await prisma.customer.upsert({
      where: { phoneNumber: customer.phoneNumber },
      update: {},
      create: customer,
    });
  }

  // Create sample queue
  await prisma.queue.upsert({
    where: { name: 'sales' },
    update: {},
    create: {
      name: 'sales',
      description: 'Sales Department Queue',
      strategy: 'ringall',
      maxWaitTime: 300,
    },
  });

  // Create sample call logs
  const adminUser = await prisma.user.findUnique({ where: { email: 'admin@callcenter.com' } });
  const agent1 = await prisma.user.findUnique({ where: { email: 'agent1@callcenter.com' } });
  const cust1 = await prisma.customer.findUnique({ where: { phoneNumber: '+966501234567' } });

  if (adminUser && agent1 && cust1) {
    const now = new Date();
    const calls = [
      {
        callId: 'demo-call-001',
        customerId: cust1.id,
        agentId: agent1.id,
        direction: 'INBOUND',
        fromNumber: '+966501234567',
        toNumber: '101',
        startTime: new Date(now.getTime() - 3600000),
        endTime: new Date(now.getTime() - 3540000),
        duration: 60,
        status: 'COMPLETED',
        notes: 'Customer inquiry about order status',
      },
      {
        callId: 'demo-call-002',
        customerId: cust1.id,
        agentId: agent1.id,
        direction: 'INBOUND',
        fromNumber: '+966501234567',
        toNumber: '101',
        startTime: new Date(now.getTime() - 7200000),
        endTime: new Date(now.getTime() - 7170000),
        duration: 30,
        status: 'COMPLETED',
        rating: 5,
      },
      {
        callId: 'demo-call-003',
        direction: 'OUTBOUND',
        fromNumber: '100',
        toNumber: '+966509876543',
        startTime: new Date(now.getTime() - 1800000),
        status: 'MISSED',
      },
    ];

    for (const call of calls) {
      try {
        await prisma.callLog.create({ data: call as any });
      } catch (e) {
        // Skip duplicates
      }
    }
  }

  console.log('Database seeded successfully!');
  console.log('');
  console.log('=================================');
  console.log('  Default Login Credentials:');
  console.log('  Email: admin@callcenter.com');
  console.log('  Password: password123');
  console.log('=================================');
  console.log('');
  console.log('  Agent accounts:');
  console.log('  agent1@callcenter.com / password123');
  console.log('  agent2@callcenter.com / password123');
  console.log('  agent3@callcenter.com / password123');
  console.log('=================================');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
