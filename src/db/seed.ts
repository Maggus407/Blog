
// import { db } from './index';
// import { users } from './schema';

async function seed() {
    console.log('Seeding database...');

    try {
        // Add your seed data here
        // await db.insert(users).values({ ... });

        console.log('Seeding completed.');
    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        process.exit(0);
    }
}

seed();
