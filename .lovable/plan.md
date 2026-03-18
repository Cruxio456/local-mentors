

## Mentor Profile Detail Page

### What we're building
A new page at `/mentor/:id` that displays a mentor's complete profile with bio, skills, ratings, and a booking button. Mentor cards on `/find` will link to this page.

### Plan

**1. Create `src/pages/MentorProfilePage.tsx`**
- Use `useParams` to get the mentor `id` from the URL
- Fetch the mentor profile from `profiles` table by `id` where `user_role = 'mentor'`
- Display:
  - Avatar (initials-based, matching existing style), name, location, availability badge
  - Full bio section
  - All skills as tags/badges
  - Rating (star display) and total sessions count
  - Hourly rate prominently
  - "Book Session" button opening `BookSessionDialog`
  - "Message" button to start/navigate to chat (reuse logic from `FindMentorPage`)
- Include loading skeleton and 404 state if mentor not found
- Wrap in `Navbar` and `Footer` like other pages

**2. Add route in `src/App.tsx`**
- Add `<Route path="/mentor/:id" element={<MentorProfilePage />} />`

**3. Link mentor cards to profile page**
- In `FindMentorPage.tsx`, wrap the mentor name/avatar area in a `Link` to `/mentor/${mentor.id}` so users can click through to the detail page

**4. No database changes needed**
- The existing `can_access_profile` function already allows viewing mentor profiles publicly
- No new tables or RLS policies required

