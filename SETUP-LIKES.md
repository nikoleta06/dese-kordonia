# Ρύθμιση πραγματικού μετρητή «like» (Supabase)

Ο μετρητής **δουλεύει ήδη** χωρίς τίποτα — αλλά τοπικά (ο αριθμός κρατιέται μόνο
στον browser του κάθε επισκέπτη). Για **πραγματικό κοινό μέτρημα** (ίδιος αριθμός
για όλους), ακολούθησε τα παρακάτω. Είναι δωρεάν και θέλει ~5 λεπτά.

## 1. Φτιάξε project στο Supabase
1. Πήγαινε στο https://supabase.com και κάνε «Start your project» (σύνδεση με GitHub).
2. **New project** → δώσε όνομα (π.χ. `dese-kordonia`), βάλε ένα password και περιοχή
   (π.χ. Frankfurt). Πάτα **Create**. Περίμενε 1-2 λεπτά να ετοιμαστεί.

## 2. Φτιάξε τον πίνακα + τις συναρτήσεις
Στο μενού αριστερά → **SQL Editor** → **New query**, κάνε επικόλληση τα παρακάτω
και πάτα **Run**:

```sql
-- Πίνακας με τα like ανά άρθρο
create table if not exists public.article_likes (
  slug  text primary key,
  count integer not null default 0
);

alter table public.article_likes enable row level security;

-- Ανάγνωση πλήθους
create or replace function public.get_likes(article_slug text)
returns integer
language sql
security definer
set search_path = public
as $$
  select coalesce((select count from public.article_likes where slug = article_slug), 0);
$$;

-- Αύξηση / μείωση (delta = +1 ή -1)
create or replace function public.increment_likes(article_slug text, delta integer)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  new_count integer;
begin
  insert into public.article_likes (slug, count)
  values (article_slug, greatest(0, delta))
  on conflict (slug)
  do update set count = greatest(0, public.article_likes.count + delta)
  returning count into new_count;
  return new_count;
end;
$$;

-- Δικαίωμα κλήσης για τους επισκέπτες (anon)
grant execute on function public.get_likes(text)            to anon;
grant execute on function public.increment_likes(text, integer) to anon;
```

## 3. Πάρε τα δύο κλειδιά
Μενού αριστερά → **Project Settings** → **API**:
- **Project URL** (π.χ. `https://abcd1234.supabase.co`)
- **anon public** key (το μακρύ κλειδί κάτω από «Project API keys»)

> Το `anon public` key είναι ασφαλές να μπει στον κώδικα — γι' αυτό υπάρχει.

## 4. Βάλ' τα στον κώδικα
Άνοιξε `src/js/main.js` και συμπλήρωσε στην αρχή:

```js
const DK_SUPABASE_URL = 'https://abcd1234.supabase.co';   // το δικό σου Project URL
const DK_SUPABASE_KEY = 'eyJhbGciOi...';                  // το δικό σου anon public key
```

## 5. Ανέβασέ το
Άλλαξε το `?v=12` σε `?v=13` (ή μεγαλύτερο) στο `<script src="../js/main.js?v=...">`
**σε όλες τις σελίδες** (για να μην κρατήσει ο browser την παλιά έκδοση), κάνε commit
και push. Από εδώ και πέρα ο αριθμός είναι κοινός για όλους τους επισκέπτες.

---

**Σημείωση:** Το αν ο κάθε χρήστης έχει ήδη πατήσει «like» / έχει αποθηκεύσει ένα
άρθρο κρατιέται πάντα τοπικά στον browser του (localStorage) — έτσι δεν χρειάζεται
λογαριασμός/σύνδεση. Το Supabase κρατάει μόνο το **συνολικό πλήθος**.
