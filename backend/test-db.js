const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    await prisma.$connect();
    console.log('Database connected successfully!');
    
    const userCount = await prisma.user.count();
    console.log(`Users in database: ${userCount}`);
    
    const customerCount = await prisma.customer.count();
    console.log(`Customers in database: ${customerCount}`);
    
    const callCount = await prisma.callLog.count();
    console.log(`Call logs in database: ${callCount}`);
    
    await prisma.$disconnect();
    console.log('Test passed!');
  } catch (error) {
    console.error('Test failed:', error);
    process.exit(1);
  }
}

main();
