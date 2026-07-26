// Promote a user to admin by email.
// Usage: node make-admin.mjs user@itclub.com
//
// Requires DATABASE_URL env var (or falls back to the .env file).

import { Pool } from "pg";

const email = process.argv[2];

if (!email) {
  console.error(
    "Harap masukkan email. Contoh: node make-admin.mjs user@itclub.com"
  );
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

try {
  // Find user
  const findResult = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);

  if (findResult.rows.length === 0) {
    console.error(
      `User dengan email ${email} tidak ditemukan. Pastikan sudah mendaftar terlebih dahulu.`
    );
    process.exit(1);
  }

  const userBefore = findResult.rows[0];

  // Promote to admin
  await pool.query("UPDATE users SET role = $1 WHERE email = $2", [
    "admin",
    email,
  ]);

  const afterResult = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  const user = afterResult.rows[0];

  console.log(
    `Berhasil! User ${user.name} (${user.email}) sekarang memiliki role '${user.role}'.`
  );
} catch (err) {
  console.error("Gagal menjalankan script:", err.message);
  process.exit(1);
} finally {
  await pool.end();
}
