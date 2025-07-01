const { PrismaClient } = require('@prisma/client');
const { hash } = require('bcryptjs');

// Create a new Prisma client instance for this script
const prisma = new PrismaClient();

async function addTestUser() {
  try {
    // Create a hashed password
    const hashedPassword = await hash('password123', 10);
    
    // Add the user to the database
    const user = await prisma.user.create({
      data: {
        email: 'test2@example.com',
        name: 'Test User',
        password: 'test123',
      },
    });
    
    console.log('Test user created successfully:');
    console.log({
      id: user.id,
      email: user.email,
      name: user.name
    });
  } catch (error) {
    console.error('Failed to create test user:', error);
  } finally {
    // Disconnect from the database
    await prisma.$disconnect();
  }
}

// Run the function
addTestUser();