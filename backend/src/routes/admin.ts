import { Router, Request, Response } from 'express';
import { query } from '../lib/db';

const router = Router();

// GET /api/admin/stats
router.get('/stats', async (req: Request, res: Response) => {
  try {
    const plansRes = await query(`SELECT plan, COUNT(*)::int as count FROM users GROUP BY plan`);

    let mrr = 0;
    let usersCount = 0;
    plansRes.rows.forEach((row: { plan: string; count: number }) => {
      usersCount += row.count;
      if (row.plan === 'Pro') mrr += row.count * 49;
      else if (row.plan === 'Agency') mrr += row.count * 199;
    });

    const arr = mrr * 12;

    const statsRes = await query(`
      SELECT 
        (SELECT COUNT(*)::int FROM projects) as "projectsCount",
        (SELECT COUNT(*)::int FROM images) as "imagesCount",
        (SELECT COUNT(*)::int FROM images WHERE status = 'success') as "successCount",
        (SELECT COUNT(*)::int FROM images WHERE status = 'failed') as "failedCount"
    `);

    const dbStats = statsRes.rows[0] || { projectsCount: 0, imagesCount: 0, successCount: 0, failedCount: 0 };
    const stats = {
      ...dbStats,
      usersCount,
      mrr,
      arr,
      arpu: usersCount > 0 ? parseFloat((mrr / usersCount).toFixed(2)) : 0
    };

    const logsRes = await query(`
      SELECT 
        i.id,
        i.original_filename as "originalFilename",
        i.output_filename as "outputFilename",
        i.file_size as "fileSize",
        i.status,
        i.latitude,
        i.longitude,
        i.business_name as "businessName",
        i.keywords,
        i.created_at as "createdAt",
        p.name as "projectName",
        p.id as "projectId"
      FROM images i
      LEFT JOIN projects p ON i.project_id = p.id
      ORDER BY i.created_at DESC
      LIMIT 100
    `);

    const usersRes = await query(`
      SELECT id, name, email, plan, role, created_at as "createdAt"
      FROM users
      ORDER BY created_at DESC
    `);

    return res.json({ stats, logs: logsRes.rows, users: usersRes.rows });
  } catch (error: any) {
    console.error('GET /api/admin/stats error:', error);
    return res.status(500).json({ error: 'Failed to fetch admin statistics' });
  }
});

// DELETE /api/admin/clean
router.delete('/clean', async (req: Request, res: Response) => {
  try {
    const dbRes = await query(`DELETE FROM images RETURNING id`);
    return res.json({ success: true, message: `Cleared ${dbRes.rowCount} processed image logs successfully.` });
  } catch (error: any) {
    console.error('DELETE /api/admin/clean error:', error);
    return res.status(500).json({ error: 'Failed to clear database logs' });
  }
});

export default router;
