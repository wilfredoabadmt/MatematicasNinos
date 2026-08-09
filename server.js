import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import Database from 'better-sqlite3';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 80;

app.use(cors());
app.use(express.json());

// Directorio de persistencia para la base de datos (Volumen en Docker/Coolify)
const dataDir = process.env.DATABASE_DIR || path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'dinomath.db');
const db = new Database(dbPath);

// Configuración de tablas SQLite
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    is_paid INTEGER DEFAULT 1,
    subscription_status TEXT DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS profiles (
    id TEXT PRIMARY KEY,
    user_email TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    total_stars INTEGER DEFAULT 0,
    total_eggs INTEGER DEFAULT 0,
    activity_eggs TEXT DEFAULT '{}',
    unlocked_rewards TEXT DEFAULT '[]',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_email) REFERENCES users(email) ON DELETE CASCADE
  );
`);

// Cuentas de demostración predeterminadas
const seedUser = db.prepare('INSERT OR IGNORE INTO users (email, is_paid, subscription_status) VALUES (?, ?, ?)');
seedUser.run('demo@dinomath.com', 1, 'active');
seedUser.run('padre@ejemplo.com', 1, 'active');
seedUser.run('prueba@ejemplo.com', 0, 'pending_payment');

// ─── ENDPOINTS DE API ───

// Verificar o registrar correo de padre y obtener estado de pago
app.post('/api/auth/check-email', (req, res) => {
  const { email } = req.body;
  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'El correo electrónico es requerido' });
  }

  const cleanEmail = email.trim().toLowerCase();
  let user = db.prepare('SELECT * FROM users WHERE email = ?').get(cleanEmail);

  if (!user) {
    // Registra nuevo usuario (por defecto activo/pagado para permitir registro fácil)
    const autoPaid = process.env.DEFAULT_PAID_STATUS !== 'false' ? 1 : 0;
    db.prepare('INSERT INTO users (email, is_paid, subscription_status) VALUES (?, ?, ?)')
      .run(cleanEmail, autoPaid, autoPaid ? 'active' : 'pending_payment');
    user = db.prepare('SELECT * FROM users WHERE email = ?').get(cleanEmail);
  }

  res.json({
    email: user.email,
    isPaid: Boolean(user.is_paid),
    subscriptionStatus: user.subscription_status,
  });
});

// Cambiar estado de pago (para pruebas y panel de administración)
app.post('/api/auth/toggle-paid', (req, res) => {
  const { email, isPaid } = req.body;
  if (!email) return res.status(400).json({ error: 'El correo es requerido' });

  const cleanEmail = email.trim().toLowerCase();
  const paidVal = isPaid ? 1 : 0;
  const statusVal = isPaid ? 'active' : 'pending_payment';

  db.prepare('UPDATE users SET is_paid = ?, subscription_status = ? WHERE email = ?')
    .run(paidVal, statusVal, cleanEmail);

  res.json({ success: true, email: cleanEmail, isPaid: Boolean(paidVal), subscriptionStatus: statusVal });
});

// Obtener perfiles de niños asociados al correo del padre
app.get('/api/profiles', (req, res) => {
  const email = req.query.email;
  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'Parámetro email requerido' });
  }

  const cleanEmail = email.trim().toLowerCase();
  const rows = db.prepare('SELECT * FROM profiles WHERE user_email = ?').all(cleanEmail);

  const profiles = rows.map((r) => ({
    id: r.id,
    firstName: r.first_name,
    lastName: r.last_name,
    totalStars: r.total_stars,
    totalEggs: r.total_eggs,
    activityEggs: JSON.parse(r.activity_eggs || '{}'),
    unlockedRewards: JSON.parse(r.unlocked_rewards || '[]'),
    createdAt: r.created_at,
  }));

  res.json({ profiles });
});

// Guardar o actualizar perfil de niño en la BD
app.post('/api/profiles', (req, res) => {
  const { email, profile } = req.body;
  if (!email || !profile || !profile.firstName) {
    return res.status(400).json({ error: 'Correo y datos válidos del niño requeridos' });
  }

  const cleanEmail = email.trim().toLowerCase();
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(cleanEmail);

  if (!user || !user.is_paid) {
    return res.status(403).json({ error: 'Acceso denegado. La cuenta no tiene suscripción activa de pago.' });
  }

  const profileId = profile.id || `p_${Date.now()}`;
  const firstName = profile.firstName.trim();
  const lastName = (profile.lastName || '').trim();
  const totalStars = profile.totalStars || 0;
  const totalEggs = profile.totalEggs || 0;
  const activityEggsStr = JSON.stringify(profile.activityEggs || {});
  const unlockedRewardsStr = JSON.stringify(profile.unlockedRewards || []);

  const stmt = db.prepare(`
    INSERT INTO profiles (id, user_email, first_name, last_name, total_stars, total_eggs, activity_eggs, unlocked_rewards)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      first_name = excluded.first_name,
      last_name = excluded.last_name,
      total_stars = excluded.total_stars,
      total_eggs = excluded.total_eggs,
      activity_eggs = excluded.activity_eggs,
      unlocked_rewards = excluded.unlocked_rewards
  `);

  stmt.run(profileId, cleanEmail, firstName, lastName, totalStars, totalEggs, activityEggsStr, unlockedRewardsStr);

  res.json({
    success: true,
    profile: {
      id: profileId,
      firstName,
      lastName,
      totalStars,
      totalEggs,
      activityEggs: profile.activityEggs || {},
      unlockedRewards: profile.unlockedRewards || [],
    },
  });
});

// Servir archivos estáticos del cliente en producción
const distDir = path.join(__dirname, 'dist');
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
  app.use((_req, res) => {
    res.sendFile(path.join(distDir, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`🚀 Servidor Dino Math iniciado en puerto ${PORT}`);
  console.log(`📁 Base de Datos SQLite: ${dbPath}`);
});
