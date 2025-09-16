-- Charset/Collation recommandés
SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

-- 0) Base de données
CREATE DATABASE IF NOT EXISTS portfolio
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
USE portfolio;

-- 1) USER (propriétaire du portfolio)
CREATE TABLE IF NOT EXISTS users (
  id_user       INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(100) NOT NULL,
  email         VARCHAR(190) NOT NULL,
  bio           TEXT NULL,
  photo_url     VARCHAR(255) NULL,
  linkedin_url  VARCHAR(255) NULL,
  github_url    VARCHAR(255) NULL,
  other_links   JSON NULL,
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_users_email (email)
) ENGINE=InnoDB;

-- 2) PRÉSENTATIONS (section “Présentation / About me”, multi-langue possible)
CREATE TABLE IF NOT EXISTS presentations (
  id_presentation  INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  id_user          INT UNSIGNED NOT NULL,
  locale           VARCHAR(10) NOT NULL DEFAULT 'fr',  -- ex: 'fr', 'en'
  headline         VARCHAR(200) NULL,                  -- accroche courte
  content_md       MEDIUMTEXT NULL,                    -- markdown/HTML
  updated_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_presentations_user
    FOREIGN KEY (id_user) REFERENCES users(id_user) ON DELETE CASCADE,
  UNIQUE KEY uk_presentation_user_locale (id_user, locale)
) ENGINE=InnoDB;

-- 3) COMPÉTENCES
CREATE TABLE IF NOT EXISTS skills (
  id_skill   INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,   -- ex: React, Node.js
  category   VARCHAR(100) NULL,       -- ex: Frontend, Backend, Outils
  level      TINYINT UNSIGNED NULL,   -- 0–100 si tu veux une jauge
  UNIQUE KEY uk_skills_name (name)
) ENGINE=InnoDB;

-- 4) PROJETS
CREATE TABLE IF NOT EXISTS projects (
  id_project   INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  id_user      INT UNSIGNED NOT NULL,
  title        VARCHAR(150) NOT NULL,
  slug         VARCHAR(160) NOT NULL,       -- pour l’URL
  short_desc   VARCHAR(300) NULL,
  long_desc    MEDIUMTEXT NULL,
  cover_url    VARCHAR(255) NULL,
  github_url   VARCHAR(255) NULL,
  demo_url     VARCHAR(255) NULL,
  is_featured  TINYINT(1) NOT NULL DEFAULT 0,
  sort_order   INT NOT NULL DEFAULT 0,
  created_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_projects_user
    FOREIGN KEY (id_user) REFERENCES users(id_user) ON DELETE CASCADE,
  UNIQUE KEY uk_projects_slug (slug),
  KEY idx_projects_user (id_user),
  KEY idx_projects_featured (is_featured, sort_order)
) ENGINE=InnoDB;

-- 4b) Images supplémentaires par projet (galerie)
CREATE TABLE IF NOT EXISTS project_images (
  id_image    INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  id_project  INT UNSIGNED NOT NULL,
  image_url   VARCHAR(255) NOT NULL,
  alt_text    VARCHAR(200) NULL,
  sort_order  INT NOT NULL DEFAULT 0,
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_pimg_project
    FOREIGN KEY (id_project) REFERENCES projects(id_project) ON DELETE CASCADE,
  KEY idx_pimg_project (id_project, sort_order)
) ENGINE=InnoDB;

-- 4c) Relation N–N entre projets et compétences
CREATE TABLE IF NOT EXISTS project_skills (
  id_project INT UNSIGNED NOT NULL,
  id_skill   INT UNSIGNED NOT NULL,
  PRIMARY KEY (id_project, id_skill),
  CONSTRAINT fk_ps_project
    FOREIGN KEY (id_project) REFERENCES projects(id_project) ON DELETE CASCADE,
  CONSTRAINT fk_ps_skill
    FOREIGN KEY (id_skill)   REFERENCES skills(id_skill)   ON DELETE CASCADE
) ENGINE=InnoDB;

-- 5) CERTIFICATIONS
CREATE TABLE IF NOT EXISTS certifications (
  id_certification  INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  id_user           INT UNSIGNED NOT NULL,
  title             VARCHAR(180) NOT NULL,         -- ex: "AWS Certified Developer – Associate"
  issuer            VARCHAR(160) NULL,             -- organisme émetteur
  issue_date        DATE NULL,
  expire_date       DATE NULL,
  credential_id     VARCHAR(160) NULL,
  credential_url    VARCHAR(255) NULL,
  description       TEXT NULL,
  created_at        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_cert_user
    FOREIGN KEY (id_user) REFERENCES users(id_user) ON DELETE CASCADE,
  KEY idx_cert_user_date (id_user, issue_date)
) ENGINE=InnoDB;

-- 6) CV (plusieurs versions/langues)
CREATE TABLE IF NOT EXISTS cvs (
  id_cv        INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  id_user      INT UNSIGNED NOT NULL,
  label        VARCHAR(120) NULL,                 -- ex: "CV FR", "CV EN", "CV Dev Front"
  locale       VARCHAR(10) NOT NULL DEFAULT 'fr',
  file_url     VARCHAR(255) NOT NULL,             -- lien vers le PDF
  is_active    TINYINT(1) NOT NULL DEFAULT 0,     -- celui affiché par défaut
  created_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_cvs_user
    FOREIGN KEY (id_user) REFERENCES users(id_user) ON DELETE CASCADE,
  KEY idx_cvs_user_active (id_user, is_active)
) ENGINE=InnoDB;
-- 7) CONTACT (messages reçus via le formulaire de contact)
CREATE TABLE IF NOT EXISTS contacts (
  id_contact   INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  id_user      INT UNSIGNED NOT NULL,
  name         VARCHAR(100) NOT NULL,
  email        VARCHAR(190) NOT NULL,
  subject      VARCHAR(200) NULL,
  message      TEXT NOT NULL,
  is_read      TINYINT(1) NOT NULL DEFAULT 0,
  created_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_contacts_user
    FOREIGN KEY (id_user) REFERENCES users(id_user) ON DELETE CASCADE,
  KEY idx_contacts_user_read (id_user, is_read)
) ENGINE=InnoDB;