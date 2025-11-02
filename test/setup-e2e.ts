import {
  clearDatabase,
  seedTestData,
  setupTestDatabase,
} from "./test-database-setup";

// eslint-disable-next-line import/no-default-export
export default async function globalSetup() {
  await setupTestDatabase();
  await clearDatabase();
  await seedTestData();
}
