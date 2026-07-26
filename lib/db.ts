import { Pool, PoolClient } from "pg";
import { randomUUID } from "crypto";

// Singleton connection pool — survives across hot reloads in dev,
// and persists across invocations on Vercel serverless.
let pool: Pool | null = null;

function getPool(): Pool {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === "production"
        ? { rejectUnauthorized: false }
        : false,
    });
  }
  return pool;
}

// ====== Schema: create tables on first use ======

let schemaReady: Promise<void> | null = null;

async function ensureSchema(): Promise<void> {
  const client: PoolClient = await getPool().connect();
  try {
    await client.query("BEGIN");

    // Drop old tables if they exist (handles TEXT created_at from previous bad deploy)
    await client.query("DROP TABLE IF EXISTS task_submissions CASCADE");
    await client.query("DROP TABLE IF EXISTS projects CASCADE");
    await client.query("DROP TABLE IF EXISTS users CASCADE");

    await client.query(`
      CREATE TABLE users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'member',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);
    await client.query(`
      CREATE TABLE task_submissions (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        link_url TEXT NOT NULL,
        user_id TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    await client.query(`
      CREATE TABLE projects (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        category TEXT NOT NULL DEFAULT 'Programming',
        link_url TEXT,
        image_url TEXT,
        author_name TEXT,
        is_featured INTEGER NOT NULL DEFAULT 1,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);

    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

/**
 * Ensures schema is ready exactly once. All DB functions await this
 * before running their queries.
 */
function getSchemaReady(): Promise<void> {
  if (!schemaReady) {
    schemaReady = ensureSchema();
  }
  return schemaReady;
}

// ====== User Functions ======

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  created_at: string;
}

export async function findUserByEmail(email: string): Promise<User | undefined> {
  await getSchemaReady();
  const db = getPool();
  const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);
  return result.rows[0] as User | undefined;
}

export async function findUserById(id: string): Promise<User | undefined> {
  await getSchemaReady();
  const db = getPool();
  const result = await db.query("SELECT * FROM users WHERE id = $1", [id]);
  return result.rows[0] as User | undefined;
}

export async function createUser(
  name: string,
  email: string,
  hashedPassword: string,
  role: string = "member"
): Promise<User> {
  await getSchemaReady();
  const db = getPool();
  const id = randomUUID();
  await db.query(
    "INSERT INTO users (id, name, email, password, role) VALUES ($1, $2, $3, $4, $5)",
    [id, name, email, hashedPassword, role]
  );
  return (await findUserById(id)) as User;
}

export async function updateUserRole(
  email: string,
  role: string
): Promise<User | undefined> {
  await getSchemaReady();
  const db = getPool();
  await db.query("UPDATE users SET role = $1 WHERE email = $2", [role, email]);
  return findUserByEmail(email);
}

// ====== Task Functions ======

export interface TaskSubmission {
  id: string;
  title: string;
  description: string;
  link_url: string;
  user_id: string;
  created_at: string;
  // Joined fields
  user_name?: string;
  user_email?: string;
}

export async function getTasksByUserId(userId: string): Promise<TaskSubmission[]> {
  await getSchemaReady();
  const db = getPool();
  const result = await db.query(
    `SELECT t.*, u.name as user_name, u.email as user_email
     FROM task_submissions t
     JOIN users u ON t.user_id = u.id
     WHERE t.user_id = $1
     ORDER BY t.created_at DESC`,
    [userId]
  );
  return result.rows as TaskSubmission[];
}

export async function getAllTasks(): Promise<TaskSubmission[]> {
  await getSchemaReady();
  const db = getPool();
  const result = await db.query(
    `SELECT t.*, u.name as user_name, u.email as user_email
     FROM task_submissions t
     JOIN users u ON t.user_id = u.id
     ORDER BY t.created_at DESC`
  );
  return result.rows as TaskSubmission[];
}

export async function createTask(
  title: string,
  description: string,
  linkUrl: string,
  userId: string
): Promise<TaskSubmission> {
  await getSchemaReady();
  const db = getPool();
  const id = randomUUID();
  await db.query(
    "INSERT INTO task_submissions (id, title, description, link_url, user_id) VALUES ($1, $2, $3, $4, $5)",
    [id, title, description, linkUrl, userId]
  );
  const result = await db.query("SELECT * FROM task_submissions WHERE id = $1", [id]);
  return result.rows[0] as TaskSubmission;
}

export async function deleteTask(id: string): Promise<boolean> {
  await getSchemaReady();
  const db = getPool();
  const result = await db.query("DELETE FROM task_submissions WHERE id = $1", [id]);
  return result.rowCount !== null && result.rowCount > 0;
}

// ====== Project Functions ======

export interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  link_url: string | null;
  image_url: string | null;
  author_name: string | null;
  is_featured: number;
  created_at: string;
}

export async function getAllProjects(): Promise<Project[]> {
  await getSchemaReady();
  const db = getPool();
  const result = await db.query("SELECT * FROM projects ORDER BY created_at DESC");
  return result.rows as Project[];
}

export async function getFeaturedProjects(): Promise<Project[]> {
  await getSchemaReady();
  const db = getPool();
  const result = await db.query(
    "SELECT * FROM projects WHERE is_featured = 1 ORDER BY created_at DESC"
  );
  return result.rows as Project[];
}

export async function createProject(data: {
  title: string;
  description: string;
  category: string;
  link_url?: string;
  image_url?: string;
  author_name?: string;
}): Promise<Project> {
  await getSchemaReady();
  const db = getPool();
  const id = randomUUID();
  await db.query(
    `INSERT INTO projects (id, title, description, category, link_url, image_url, author_name)
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [
      id,
      data.title,
      data.description,
      data.category,
      data.link_url || null,
      data.image_url || null,
      data.author_name || null,
    ]
  );
  const result = await db.query("SELECT * FROM projects WHERE id = $1", [id]);
  return result.rows[0] as Project;
}

export async function deleteProject(id: string): Promise<boolean> {
  await getSchemaReady();
  const db = getPool();
  const result = await db.query("DELETE FROM projects WHERE id = $1", [id]);
  return result.rowCount !== null && result.rowCount > 0;
}

export async function updateProject(
  id: string,
  data: {
    title?: string;
    description?: string;
    category?: string;
    link_url?: string;
    image_url?: string;
    author_name?: string;
    is_featured?: number;
  }
): Promise<Project | undefined> {
  await getSchemaReady();
  const db = getPool();
  const fields: string[] = [];
  const values: unknown[] = [];

  if (data.title !== undefined) { fields.push("title = $" + (fields.length + 1)); values.push(data.title); }
  if (data.description !== undefined) { fields.push("description = $" + (fields.length + 1)); values.push(data.description); }
  if (data.category !== undefined) { fields.push("category = $" + (fields.length + 1)); values.push(data.category); }
  if (data.link_url !== undefined) { fields.push("link_url = $" + (fields.length + 1)); values.push(data.link_url); }
  if (data.image_url !== undefined) { fields.push("image_url = $" + (fields.length + 1)); values.push(data.image_url); }
  if (data.author_name !== undefined) { fields.push("author_name = $" + (fields.length + 1)); values.push(data.author_name); }
  if (data.is_featured !== undefined) { fields.push("is_featured = $" + (fields.length + 1)); values.push(data.is_featured); }

  if (fields.length === 0) return undefined;

  values.push(id);
  await db.query(
    `UPDATE projects SET ${fields.join(", ")} WHERE id = $${values.length}`,
    values
  );
  const result = await db.query("SELECT * FROM projects WHERE id = $1", [id]);
  return result.rows[0] as Project | undefined;
}
