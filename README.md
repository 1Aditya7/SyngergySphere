🌐 SynergySphere

A collaborative project management platform built with Next.js 15, Prisma, and PostgreSQL (Neon).
Designed for :fast setup, clean UI, and extendable backend.


🛠️ Tech Stack

Next.js 15 (App Router)

React 19

Prisma ORM
 + Neon Postgres

TailwindCSS
 + Radix UI + Lucide Icons

JWT Authentication
 + bcrypt

🚀 Getting Started
1. Clone repo
git clone https://github.com/1Aditya7/SyngergySphere.git
cd SyngergySphere/synergysphere

2. Install dependencies
npm install

3. Setup environment

Create .env in project root:

DATABASE_URL="postgresql://<user>:<password>@<host>/<dbname>?sslmode=require"
JWT_SECRET="yoursecretkey"

4. Prisma setup
npx prisma migrate dev --name init
npx prisma generate

5. Run dev server
npm run dev


App will be available at http://localhost:3000

📂 Project Structure
src/
 ├─ app/           # Next.js app router pages
 │   ├─ api/       # API routes (auth, projects, tasks)
 │   └─ projects/  # Dashboard + project detail
 ├─ components/    # Reusable UI components
 ├─ features/      # Feature modules (auth, chat, tasks)
 ├─ lib/           # Helpers (Prisma, utils, constants)
 └─ styles/        # Global styles

👥 Team Contributions

Aditya Parthiban – Auth, Project Detail, UI Polish, Branding

Aditya Verghese Cherian – Dashboard, Responsive UI, Docs, Landing Page

Arindam Kalita – Auth Backend, Tasks, Discussions, Notifications

📌 Roadmap

📊 Advanced project analytics

☁️ Offline cache & PWA support

