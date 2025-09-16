USE portfolio;

-- Ajout champs d'auth
ALTER TABLE users
  ADD COLUMN password_hash VARCHAR(255) NULL AFTER email,
  ADD COLUMN role ENUM('admin','visitor') NOT NULL DEFAULT 'visitor' AFTER password_hash;

-- Index utile
CREATE INDEX idx_users_role ON users (role);

-- ⚠️ Mets TON email ici pour devenir admin
UPDATE users SET role = 'admin' WHERE email = 'yyhamri@gmail.com';