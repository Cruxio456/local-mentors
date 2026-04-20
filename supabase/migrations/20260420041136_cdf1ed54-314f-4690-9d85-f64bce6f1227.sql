
-- 1. Verification status enum
CREATE TYPE public.verification_status AS ENUM ('pending', 'approved', 'rejected');

-- 2. Add verification fields to profiles
ALTER TABLE public.profiles
  ADD COLUMN verification_status public.verification_status NOT NULL DEFAULT 'pending',
  ADD COLUMN id_document_url text,
  ADD COLUMN certificate_urls text[] DEFAULT '{}'::text[],
  ADD COLUMN verification_notes text,
  ADD COLUMN verified_at timestamptz;

-- Auto-approve existing mentors so we don't break anything
UPDATE public.profiles SET verification_status = 'approved', verified_at = now()
  WHERE user_role = 'mentor';
-- Students don't need verification; mark them approved as well
UPDATE public.profiles SET verification_status = 'approved'
  WHERE user_role = 'student';

-- 3. Roles enum + user_roles table (separate from profiles for security)
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- has_role security definer function (avoids recursive RLS)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
$$;

-- Anyone authenticated can read their own roles; admins can read all
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT TO authenticated
USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage roles"
ON public.user_roles FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 4. Update handle_new_user so new mentors start as 'pending', students as 'approved'
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_role public.user_role;
BEGIN
  v_role := COALESCE((NEW.raw_user_meta_data->>'role')::public.user_role, 'student'::public.user_role);

  INSERT INTO public.profiles (user_id, user_role, name, hourly_rate, skills, verification_status)
  VALUES (
    NEW.id,
    v_role,
    COALESCE(NEW.raw_user_meta_data->>'name', 'New User'),
    CASE WHEN NEW.raw_user_meta_data->>'hourly_rate' IS NOT NULL
         THEN (NEW.raw_user_meta_data->>'hourly_rate')::integer
         ELSE NULL END,
    CASE WHEN NEW.raw_user_meta_data->'skills' IS NOT NULL
         THEN ARRAY(SELECT jsonb_array_elements_text(NEW.raw_user_meta_data->'skills'))
         ELSE NULL END,
    CASE WHEN v_role = 'mentor' THEN 'pending'::public.verification_status
         ELSE 'approved'::public.verification_status END
  );
  RETURN NEW;
END;
$$;

-- 5. Update can_access_profile so unapproved mentors are hidden from public browse,
--    but visible to themselves and admins.
CREATE OR REPLACE FUNCTION public.can_access_profile(target_profile_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT
    -- Own profile
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = target_profile_id AND user_id = auth.uid()
    )
    OR
    -- Admins see everything
    public.has_role(auth.uid(), 'admin')
    OR
    -- Has booking with this mentor/student
    EXISTS (
      SELECT 1 FROM public.bookings b
      JOIN public.profiles p ON p.user_id = auth.uid()
      WHERE (b.student_id = p.id AND b.mentor_id = target_profile_id)
         OR (b.mentor_id = p.id AND b.student_id = target_profile_id)
    )
    OR
    -- Public mentor profiles (only approved ones)
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = target_profile_id
        AND user_role = 'mentor'
        AND verification_status = 'approved'
    );
$$;

-- 6. Allow admins to UPDATE any profile (for verification decisions)
CREATE POLICY "Admins can update any profile"
ON public.profiles FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 7. Storage bucket for mentor verification documents (private)
INSERT INTO storage.buckets (id, name, public)
VALUES ('mentor-documents', 'mentor-documents', false)
ON CONFLICT (id) DO NOTHING;

-- Mentors manage files only within their own user-id folder
CREATE POLICY "Mentors view own documents"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'mentor-documents'
  AND (auth.uid()::text = (storage.foldername(name))[1] OR public.has_role(auth.uid(), 'admin'))
);

CREATE POLICY "Mentors upload own documents"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'mentor-documents'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Mentors update own documents"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'mentor-documents'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Mentors delete own documents"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'mentor-documents'
  AND auth.uid()::text = (storage.foldername(name))[1]
);
