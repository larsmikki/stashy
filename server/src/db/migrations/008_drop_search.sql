-- Drop the FTS5 search infrastructure added in 006 (file removed). Triggers
-- must go first since they reference the virtual table.
DROP TRIGGER IF EXISTS media_files_au;
DROP TRIGGER IF EXISTS media_files_ad;
DROP TRIGGER IF EXISTS media_files_ai;
DROP TABLE IF EXISTS media_search;
