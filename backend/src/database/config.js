import pkg from 'pg';
import dotenv from 'dotenv';
import { createLogger, format, transports } from 'winston';

const { Pool } = pkg;
dotenv.config();

const logger = createLogger({
  level: 'info',
  format: format.combine(format.timestamp(), format.json()),
  transports: [new transports.Console()]
});

// Database configuration
const dbConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20, // Maximum number of clients in pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return error after 2 seconds if connection could not be established
};

// Create connection pool
const pool = new Pool(dbConfig);

// Test database connection
async function testConnection() {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW() as current_time');
    logger.info('✅ Database connected successfully:', result.rows[0]);
    client.release();
    
    // Check for required extensions
    await checkExtensions();
  } catch (error) {
    logger.error('❌ Database connection failed:', error.message);
    throw error;
  }
}

// Check and install required extensions
async function checkExtensions() {
  try {
    const client = await pool.connect();
    
    // Check PostGIS
    const postgisResult = await client.query(
      "SELECT EXISTS(SELECT 1 FROM pg_extension WHERE extname = 'postgis')"
    );
    
    if (!postgisResult.rows[0].exists) {
      logger.info('Installing PostGIS extension...');
      await client.query('CREATE EXTENSION IF NOT EXISTS postgis');
    }
    
    // Check pgvector
    const vectorResult = await client.query(
      "SELECT EXISTS(SELECT 1 FROM pg_extension WHERE extname = 'vector')"
    );
    
    if (!vectorResult.rows[0].exists) {
      logger.info('Installing pgvector extension...');
      await client.query('CREATE EXTENSION IF NOT EXISTS vector');
    }
    
    logger.info('✅ All required extensions are available');
    client.release();
  } catch (error) {
    logger.warn('⚠️  Extension check failed (may need manual installation):', error.message);
  }
}

// Graceful pool shutdown
async function closePool() {
  try {
    await pool.end();
    logger.info('🔐 Database pool closed');
  } catch (error) {
    logger.error('❌ Error closing database pool:', error.message);
  }
}

// Handle process termination
process.on('SIGINT', closePool);
process.on('SIGTERM', closePool);

export { pool, testConnection, closePool }; 