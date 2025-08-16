import { NextApiRequest, NextApiResponse } from 'next';

interface ErrorLog {
  id: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'frontend' | 'backend' | 'payment' | 'auth' | 'database';
  errorMessage: string;
  userId?: string;
  route?: string;
  resolved: boolean;
  context?: Record<string, unknown>;
}

interface ErrorStats {
  total: number;
  critical: number;
  high: number;
  unresolved: number;
  last24h: number;
}

// In-memory error storage (în producție ar fi în baza de date)
let errorLogs: ErrorLog[] = [];

// Add error log (used internally by error logging system)
export function addErrorLog(error: ErrorLog) {
  errorLogs.unshift(error); // Add to beginning

  // Keep only last 1000 errors to prevent memory issues
  if (errorLogs.length > 1000) {
    errorLogs = errorLogs.slice(0, 1000);
  }
}

function calculateStats(): ErrorStats {
  const now = Date.now();
  const last24h = now - 24 * 60 * 60 * 1000;

  return {
    total: errorLogs.length,
    critical: errorLogs.filter((e) => e.severity === 'critical').length,
    high: errorLogs.filter((e) => e.severity === 'high').length,
    unresolved: errorLogs.filter((e) => !e.resolved).length,
    last24h: errorLogs.filter((e) => new Date(e.timestamp).getTime() > last24h).length,
  };
}

/**
 * API endpoint for admin error dashboard data
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Basic auth check (în producție ar fi o verificare mai robustă)
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== `Bearer ${process.env.ADMIN_API_KEY}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    if (req.method === 'GET') {
      const filter = req.query.filter as string;
      const limit = parseInt(req.query.limit as string) || 50;

      let filteredErrors = errorLogs;

      // Apply filters
      if (filter === 'critical') {
        filteredErrors = errorLogs.filter((e) => e.severity === 'critical');
      } else if (filter === 'unresolved') {
        filteredErrors = errorLogs.filter((e) => !e.resolved);
      }

      // Limit results
      const errors = filteredErrors.slice(0, limit);
      const stats = calculateStats();

      return res.status(200).json({
        errors,
        stats,
        total: filteredErrors.length,
      });
    } else if (req.method === 'POST') {
      // Add new error log
      const errorLog: ErrorLog = req.body;

      // Validate required fields
      if (!errorLog.id || !errorLog.timestamp || !errorLog.errorMessage) {
        return res.status(400).json({
          error: 'Missing required fields: id, timestamp, errorMessage',
        });
      }

      addErrorLog(errorLog);

      return res.status(201).json({ success: true });
    } else if (req.method === 'PATCH') {
      // Mark error as resolved
      const { id, resolved } = req.body;

      if (!id || typeof resolved !== 'boolean') {
        return res.status(400).json({
          error: 'Missing required fields: id, resolved',
        });
      }

      const errorIndex = errorLogs.findIndex((e) => e.id === id);
      if (errorIndex === -1) {
        return res.status(404).json({ error: 'Error not found' });
      }

      errorLogs[errorIndex].resolved = resolved;

      return res.status(200).json({ success: true });
    } else {
      res.setHeader('Allow', ['GET', 'POST', 'PATCH']);
      return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error in admin errors API:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
