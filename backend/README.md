Ydays backend (Express + Supabase)

This small backend exposes CRUD endpoints for `products` and `shops` tables in Supabase.

Setup

1. Copy `.env.example` to `.env` and fill SUPABASE_URL and SUPABASE_KEY.

2. Install dependencies and run

   npm install
   npm run dev

API

- GET /api/products
- GET /api/products/:id
- POST /api/products  (JSON body)
- PUT /api/products/:id
- DELETE /api/products/:id

- GET /api/shops
- GET /api/shops/:id
- POST /api/shops  (JSON body)
- PUT /api/shops/:id
- DELETE /api/shops/:id

Notes

- This project expects tables named `products` and `shops` in Supabase. Adapt field names as needed.
- For production, use a service_role key carefully and restrict network access.
