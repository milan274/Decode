import express from "express";
import { createServer as createViteServer } from "vite";
import { Pool } from "pg";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const PORT = parseInt(process.env.PORT || "3000", 10);
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('localhost') ? false : { rejectUnauthorized: false }
});

// Initialize Database
async function initDatabase() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        username TEXT NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS problems (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS submissions (
        id SERIAL PRIMARY KEY,
        problem_id INTEGER REFERENCES problems(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        code TEXT NOT NULL,
        submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS cheaters (
        id SERIAL PRIMARY KEY,
        problem_id INTEGER REFERENCES problems(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        reason TEXT NOT NULL,
        details TEXT,
        detected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Seed Admin
    const adminCheck = await pool.query("SELECT * FROM users WHERE email = $1", ["milangupta980@gmail.com"]);
    if (adminCheck.rows.length === 0) {
      const hashedPassword = await bcrypt.hash("ELYJwL48", 10);
      await pool.query(
        "INSERT INTO users (email, username, password, role) VALUES ($1, $2, $3, $4)",
        ["milangupta980@gmail.com", "Admin", hashedPassword, "admin"]
      );
      console.log("✓ Admin user created");
    }

    console.log("✓ Database initialized successfully");
  } catch (error) {
    console.error("Database initialization error:", error);
  }
}

// API Routes

// Auth
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    const user = result.rows[0];

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "24h" });
    res.json({ id: user.id, email: user.email, username: user.username, role: user.role, token });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/register", async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (email, username, password, role) VALUES ($1, $2, $3, $4) RETURNING id, email, username, role",
      [email, username, hashedPassword, "user"]
    );
    const user = result.rows[0];
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "24h" });
    res.json({ ...user, token });
  } catch (error: any) {
    res.status(400).json({ error: error.code === '23505' ? "User already exists" : "Server error" });
  }
});

// Problems
app.get("/api/problems", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM problems ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/problems", async (req, res) => {
  try {
    const { title, description } = req.body;
    const result = await pool.query(
      "INSERT INTO problems (title, description) VALUES ($1, $2) RETURNING *",
      [title, description]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

app.delete("/api/problems/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM problems WHERE id = $1", [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/admin/clear-database", async (req, res) => {
  try {
    // Delete all data except admin user
    await pool.query("DELETE FROM cheaters");
    await pool.query("DELETE FROM submissions");
    await pool.query("DELETE FROM problems");
    await pool.query("DELETE FROM users WHERE role != 'admin'");
    res.json({ success: true, message: "Database cleared successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Submissions
app.post("/api/submit", async (req, res) => {
  try {
    const { problem_id, user_id, code } = req.body;
    await pool.query("INSERT INTO submissions (problem_id, user_id, code) VALUES ($1, $2, $3)", [problem_id, user_id, code]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/api/admin/submissions/:problemId", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT s.*, u.username, u.email 
      FROM submissions s 
      JOIN users u ON s.user_id = u.id 
      WHERE s.problem_id = $1
      ORDER BY s.submitted_at DESC
    `, [req.params.problemId]);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Cheaters
app.post("/api/report-cheater", async (req, res) => {
  try {
    const { problem_id, user_id, reason, details } = req.body;
    await pool.query(
      "INSERT INTO cheaters (problem_id, user_id, reason, details) VALUES ($1, $2, $3, $4)",
      [problem_id, user_id, reason, details || ""]
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/api/admin/cheaters/:problemId", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT c.*, u.username, u.email 
      FROM cheaters c 
      JOIN users u ON c.user_id = u.id 
      WHERE c.problem_id = $1
      ORDER BY c.detected_at DESC
    `, [req.params.problemId]);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Health check
app.get("/api/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "ok", database: "connected" });
  } catch (error) {
    res.status(500).json({ status: "error", database: "disconnected" });
  }
});

async function startServer() {
  try {
    await initDatabase();

    // Check if running in production (Railway)
    const isProduction = process.env.RAILWAY_ENVIRONMENT || process.env.NODE_ENV === "production";

    if (isProduction) {
      // Serve built files
      app.use(express.static("dist"));
      app.get("*", (req, res) => {
        res.sendFile(path.resolve("dist/index.html"));
      });
      console.log("✓ Serving production build");
    } else {
      // Use Vite dev server
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa",
      });
      app.use(vite.middlewares);
      console.log("✓ Using Vite dev server");
    }

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`✓ Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
