CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (user_id, user_role, name, hourly_rate, skills)
  VALUES (
    NEW.id,
    COALESCE((NEW.raw_user_meta_data->>'role')::public.user_role, 'student'::public.user_role),
    COALESCE(NEW.raw_user_meta_data->>'name', 'New User'),
    CASE WHEN NEW.raw_user_meta_data->>'hourly_rate' IS NOT NULL 
         THEN (NEW.raw_user_meta_data->>'hourly_rate')::integer 
         ELSE NULL END,
    CASE WHEN NEW.raw_user_meta_data->'skills' IS NOT NULL 
         THEN ARRAY(SELECT jsonb_array_elements_text(NEW.raw_user_meta_data->'skills'))
         ELSE NULL END
  );
  RETURN NEW;
END;
$function$;