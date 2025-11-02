import {
  clearDatabase,
  seedTestData,
  setupTestDatabase,
} from "./test-database-setup";

export async function globalSetup() {
  await setupTestDatabase();
  await clearDatabase();
  await seedTestData();
}
