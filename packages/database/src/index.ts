/**
 * @coquinate/database
 * Database utilities and typed Supabase client for Coquinate
 */

// Export client and types
export {
  supabase,
  TABLES,
  type Database,
  type Tables,
  type Enums,
  type InsertTables,
  type UpdateTables,
} from './client';

// Export server-only client
export { createServiceClient } from './server-client';

// Export auth utilities
export * from './auth';

// Export query utilities
export * from './queries';
