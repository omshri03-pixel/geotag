import { Router, Request, Response } from 'express';
import { query } from '../lib/db';

const router = Router();

// GET /api/projects
router.get('/', async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId as string;
    const role = req.query.role as string;

    let dbRes;
    if (role === 'superadmin') {
      dbRes = await query(`
        SELECT 
          p.id, p.name,
          p.client_name as "clientName",
          p.notes,
          p.created_at as "createdAt",
          COUNT(i.id)::int as "imageCount",
          COUNT(CASE WHEN i.status = 'success' THEN 1 END)::int as "successCount"
        FROM projects p
        LEFT JOIN images i ON p.id = i.project_id
        GROUP BY p.id
        ORDER BY p.created_at DESC
      `);
    } else {
      dbRes = await query(`
        SELECT 
          p.id, p.name,
          p.client_name as "clientName",
          p.notes,
          p.created_at as "createdAt",
          COUNT(i.id)::int as "imageCount",
          COUNT(CASE WHEN i.status = 'success' THEN 1 END)::int as "successCount"
        FROM projects p
        LEFT JOIN images i ON p.id = i.project_id
        WHERE p.user_id = $1
        GROUP BY p.id
        ORDER BY p.created_at DESC
      `, [userId ? parseInt(userId) : 0]);
    }

    return res.json({ projects: dbRes.rows });
  } catch (error: any) {
    console.error('GET /api/projects error:', error);
    return res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// POST /api/projects
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, clientName, notes, userId } = req.body;
    if (!name) return res.status(400).json({ error: 'Project name is required' });

    const dbRes = await query(
      `INSERT INTO projects (name, client_name, notes, user_id) VALUES ($1, $2, $3, $4) RETURNING id, name, client_name as "clientName", notes, created_at as "createdAt"`,
      [name, clientName || '', notes || '', userId ? parseInt(userId) : 1]
    );

    return res.json({ project: dbRes.rows[0] });
  } catch (error: any) {
    console.error('POST /api/projects error:', error);
    return res.status(500).json({ error: 'Failed to create project' });
  }
});

// GET /api/projects/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const projectId = parseInt(req.params.id);
    if (isNaN(projectId)) return res.status(400).json({ error: 'Invalid project ID' });

    const projectRes = await query(
      `SELECT id, name, client_name as "clientName", notes, created_at as "createdAt" FROM projects WHERE id = $1`,
      [projectId]
    );

    if (projectRes.rows.length === 0) return res.status(404).json({ error: 'Project not found' });

    const imageRes = await query(
      `SELECT id, original_filename as "originalFilename", output_filename as "outputFilename", file_size as "fileSize", status, latitude, longitude, business_name as "businessName", keywords, created_at as "createdAt" 
       FROM images WHERE project_id = $1 ORDER BY created_at DESC`,
      [projectId]
    );

    return res.json({ project: projectRes.rows[0], images: imageRes.rows });
  } catch (error: any) {
    console.error('GET /api/projects/:id error:', error);
    return res.status(500).json({ error: 'Failed to fetch project details' });
  }
});

// DELETE /api/projects/:id
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const projectId = parseInt(req.params.id);
    if (isNaN(projectId)) return res.status(400).json({ error: 'Invalid project ID' });

    const dbRes = await query(`DELETE FROM projects WHERE id = $1 RETURNING id`, [projectId]);
    if (dbRes.rowCount === 0) return res.status(404).json({ error: 'Project not found' });

    return res.json({ success: true, message: 'Project deleted successfully' });
  } catch (error: any) {
    console.error('DELETE /api/projects/:id error:', error);
    return res.status(500).json({ error: 'Failed to delete project' });
  }
});

export default router;
