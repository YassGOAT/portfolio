USE portfolio;

CREATE TABLE IF NOT EXISTS contact_messages (
  id_message  BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(120) NOT NULL,
  email       VARCHAR(190) NOT NULL,
  message     TEXT NOT NULL,
  is_read     TINYINT(1) NOT NULL DEFAULT 0,
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_contact_created (created_at),
  KEY idx_contact_read (is_read)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
