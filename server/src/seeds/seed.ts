import db from '../config/connection.js';



try {
  await db();

  // bulk create each model


  console.log('Seeding completed successfully!');
  process.exit(0);
} catch (error) {
  console.error('Error seeding database:', error);
  process.exit(1);
}
