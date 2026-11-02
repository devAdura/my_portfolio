CREATE TABLE IF NOT EXISTS enquiries (
 id UUID PRIMARY KEY,
 name TEXT NOT NULL,
 email TEXT NOT NULL,
 topic TEXT NOT NULL,
 message TEXT NOT NULL,
 created_at BIGINT NOT NULL,
 read BOOLEAN NOT NULL DEFAULT FALSE
);
CREATE INDEX IF NOT EXISTS enquiries_email_created_idx ON enquiries(email, created_at);
CREATE TABLE IF NOT EXISTS inbox_login_attempts (
 client_key TEXT PRIMARY KEY,
 attempts INTEGER NOT NULL DEFAULT 0,
 window_start BIGINT NOT NULL
);
