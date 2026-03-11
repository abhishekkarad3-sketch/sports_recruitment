-- ============================================================
--  Sports Talent Recruitment Platform — MySQL Schema
--  ✅ NO Foreign Key Constraints — Full freedom to modify data
-- ============================================================

CREATE DATABASE IF NOT EXISTS sports_recruitment
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE sports_recruitment;

-- ── If upgrading existing DB: drop old tables cleanly ────────
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS feedback;
DROP TABLE IF EXISTS recruitment;
DROP TABLE IF EXISTS coaches;
DROP TABLE IF EXISTS players;
DROP TABLE IF EXISTS users;
SET FOREIGN_KEY_CHECKS = 1;

-- ── Users ─────────────────────────────────────────────────────
-- Unique constraint only on (email + role) so same email
-- can NOT be used for both player and coach accounts.
CREATE TABLE IF NOT EXISTS users (
    user_id            INT           AUTO_INCREMENT PRIMARY KEY,
    name               VARCHAR(100)  NOT NULL,
    email              VARCHAR(150)  NOT NULL,
    password           VARCHAR(255)  NOT NULL,
    role               ENUM('player','coach') NOT NULL,
    is_verified        BOOLEAN       DEFAULT FALSE,
    verification_token VARCHAR(128)  DEFAULT NULL,
    reset_token        VARCHAR(128)  DEFAULT NULL,
    token_expiry       DATETIME      DEFAULT NULL,
    created_at         TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_email_role (email, role)
) ENGINE=MyISAM
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

-- ── Players ───────────────────────────────────────────────────
-- user_id is a plain INT — no FK reference.
-- Insert, update, delete any row freely.
CREATE TABLE IF NOT EXISTS players (
    player_id         INT           AUTO_INCREMENT PRIMARY KEY,
    user_id           INT           NOT NULL,
    age               INT           DEFAULT NULL,
    sport             VARCHAR(100)  DEFAULT NULL,
    height            VARCHAR(20)   DEFAULT NULL,
    achievements      TEXT          DEFAULT NULL,
    competition_level ENUM('District','State','National') DEFAULT 'District',
    contact_email     VARCHAR(150)  DEFAULT NULL,
    created_at        TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_sport   (sport),
    INDEX idx_level   (competition_level)
) ENGINE=MyISAM
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

-- ── Coaches ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS coaches (
    coach_id             INT           AUTO_INCREMENT PRIMARY KEY,
    user_id              INT           NOT NULL,
    sport_specialization VARCHAR(100)  DEFAULT NULL,
    bio                  TEXT          DEFAULT NULL,
    experience           INT           DEFAULT 0,
    contact_email        VARCHAR(150)  DEFAULT NULL,
    created_at           TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_sport   (sport_specialization)
) ENGINE=MyISAM
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

-- ── Recruitment ───────────────────────────────────────────────
-- player_id and coach_id are plain INTs — no FK restrictions.
CREATE TABLE IF NOT EXISTS recruitment (
    recruit_id INT           AUTO_INCREMENT PRIMARY KEY,
    player_id  INT           NOT NULL,
    coach_id   INT           NOT NULL,
    message    TEXT          DEFAULT NULL,
    status     ENUM('pending','accepted','rejected') DEFAULT 'pending',
    date       DATETIME      DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_player (player_id),
    INDEX idx_coach  (coach_id),
    INDEX idx_status (status)
) ENGINE=MyISAM
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

-- ── Feedback ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS feedback (
    feedback_id INT           AUTO_INCREMENT PRIMARY KEY,
    player_id   INT           NOT NULL,
    coach_id    INT           NOT NULL,
    rating      INT           DEFAULT NULL,
    comment     TEXT          DEFAULT NULL,
    created_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_player (player_id),
    INDEX idx_coach  (coach_id)
) ENGINE=MyISAM
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

-- ============================================================
--  VERIFY — confirm zero FK constraints exist:
--  SELECT TABLE_NAME, CONSTRAINT_NAME
--  FROM information_schema.TABLE_CONSTRAINTS
--  WHERE CONSTRAINT_SCHEMA = 'sports_recruitment'
--    AND CONSTRAINT_TYPE   = 'FOREIGN KEY';
--  (should return 0 rows)
-- ============================================================
