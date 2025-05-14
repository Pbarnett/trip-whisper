# TripWhisper MVP
Automated booking of nonstop Delta flights (NYC ⇄ MVY).

## Stack
Loveable (Next.js), Supabase (DB/Auth/Edge), Amadeus API, Stripe.

## Flow
1. User logs in
2. Trip form → `search-flight` edge function
3. User selects offer → Stripe payment
4. `book-flight` edge function stores booking
5. Reminder email 24 h before departure
