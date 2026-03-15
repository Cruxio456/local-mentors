
-- Allow profiles to have nullable user_id for seeded mentor profiles
ALTER TABLE profiles ALTER COLUMN user_id DROP NOT NULL;
