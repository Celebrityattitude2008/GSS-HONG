# GSS Hong — Government Secondary School, Hong

<div align="center">

![GSS Hong](https://img.shields.io/badge/GSS_Hong-Official_Portal-0D3B6E?style=for-the-badge&logo=bookstack&logoColor=F59E0B)
![Stack](https://img.shields.io/badge/React_+_Vite-TypeScript-3178C6?style=for-the-badge&logo=typescript)
![Firebase](https://img.shields.io/badge/Firebase-Auth_%26_Firestore-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**Official web portal of Government Secondary School, Hong, Adamawa State, Nigeria.**

[🌐 Live Site](https://gsshong.edu.ng) · [📋 Student Portal](#student-portal) · [🔧 Firebase Setup](docs/FIREBASE_SETUP.md) · [👨‍💼 Admin Guide](docs/ADMIN_GUIDE.md)

</div>

---

## 📖 Table of Contents

- [About the School](#about-the-school)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Firebase Setup](#firebase-setup)
- [Student Portal](#student-portal)
- [Admin Portal](#admin-portal)
- [SEO & Performance](#seo--performance)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [About the Developer](#about-the-developer)
- [License](#license)

---

## 🏫 About the School

**Government Secondary School, Hong** (GSS Hong) is a public secondary school located in Hong, Gombi Local Government Area, Adamawa State, Nigeria. Established in 1967 through a Danish mission partnership, the school was formally transferred to government ownership in 1971 and later expanded to include both **Science** and **Arts** academic tracks.

GSS Hong consistently achieves among the highest WAEC pass rates in Adamawa State, with a **94% distinction rate** in recent examinations.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🏠 **Home / About** | School history, mission, key statistics, and campus gallery |
| 📚 **Academics** | Departments: Sciences, Arts & Humanities, Computer Science, Mathematics |
| 📰 **News & Events** | School announcements, WAEC results, events calendar |
| 📞 **Contact** | Faculty directory, contact form, school address |
| 🎓 **Student Portal** | Firebase-authenticated results portal — students view and print term results |
| 🛠️ **Admin Portal** | Hidden staff dashboard — enter scores, save drafts, publish results |
| 👨‍💻 **Developer Page** | About the developer (Paul Adamu / PA_ZTI) |
| 📱 **Fully Responsive** | Mobile-first layout, works on all screen sizes |
| 🖨️ **Print-friendly** | Student result slips are formatted for A4 printing |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | React 19 + Vite 6 |
| **Language** | TypeScript 5.9 |
| **Styling** | Tailwind CSS v4 (theme tokens, glassmorphism) |
| **Routing** | `wouter` (lightweight client-side router) |
| **UI Components** | Radix UI primitives, `lucide-react` icons |
| **Auth & Database** | Firebase Authentication + Firestore |
| **Package Manager** | pnpm workspaces (monorepo) |
| **Node** | Node.js 24 |

---

## 📁 Project Structure

```
.
├── artifacts/
│   └── gss-hong/                   # Main web portal artifact
│       ├── index.html              # Entry point — SEO meta, schema.org JSON-LD
│       ├── vite.config.ts          # Vite configuration
│       ├── tsconfig.json           # TypeScript config
│       ├── public/
│       │   ├── favicon.svg         # School crest favicon
│       │   ├── og-image.svg        # Open Graph image (1200×630)
│       │   ├── manifest.json       # PWA web app manifest
│       │   ├── robots.txt          # Crawler rules
│       │   └── sitemap.xml         # XML sitemap
│       └── src/
│           ├── App.tsx             # Main application (all page components)
│           ├── main.tsx            # React entry point
│           ├── index.css           # Tailwind v4 theme tokens (HSL)
│           ├── assets/
│           │   └── paul-adamu.jpg  # Developer photo
│           ├── lib/
│           │   ├── firebase.ts     # Firebase app/auth/db initialization
│           │   ├── portal.ts       # All portal logic (auth, Firestore, grading)
│           │   └── utils.ts        # Utility functions
│           ├── pages/
│           │   └── AdminPage.tsx   # Admin portal (hidden — /admin)
│           └── components/
│               └── ui/             # Radix-based UI component library
├── firestore.rules                 # Firestore security rules (paste into Firebase console)
├── docs/
│   ├── FIREBASE_SETUP.md           # Step-by-step Firebase configuration guide
│   ├── ADMIN_GUIDE.md              # Admin portal user guide
│   └── STUDENT_PORTAL.md          # Student portal user guide
└── README.md                       # This file
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 20
- **pnpm** ≥ 9 (`npm install -g pnpm`)
- A **Firebase** project with Authentication and Firestore enabled

### Installation

```bash
# Clone the repository
git clone https://github.com/Celebrityattitude2008/GSS-HONG.git
cd GSS-HONG

# Install all workspace dependencies
pnpm install
```

### Development

```bash
# Start the GSS Hong web portal (Vite dev server)
pnpm --filter @workspace/gss-hong run dev
```

The portal will be available at `http://localhost:5173` (or the port Vite selects).

### Build

```bash
# Build all packages
pnpm run build

# Build only the web portal
pnpm --filter @workspace/gss-hong run build
```

### Type Check

```bash
pnpm run typecheck
```

---

## 🔑 Environment Variables

Create a `.env` file inside `artifacts/gss-hong/` (or set these as shared environment variables on your hosting platform):

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

> ⚠️ **Important:** All Firebase config vars **must** be prefixed with `VITE_` so Vite exposes them to client-side code. Never commit `.env` files to version control.

---

## 🔥 Firebase Setup

See **[docs/FIREBASE_SETUP.md](docs/FIREBASE_SETUP.md)** for the full guide, including:

- Enabling Authentication (Email/Password)
- Creating Firestore database
- Applying security rules
- Creating the admin account
- Testing the setup

**Quick summary:**

1. Go to [Firebase Console](https://console.firebase.google.com/) → your project
2. Enable **Authentication → Email/Password**
3. Create a **Firestore database** in production mode
4. Paste the contents of `firestore.rules` into **Firestore → Rules → Edit**
5. Publish the rules

---

## 🎓 Student Portal

The student portal is accessible from the main navigation. Students:

1. Receive their **admission number** (e.g. `GSS/2024/00231`) from the school office
2. Log in with the **default password: `Password1`**
3. **Change their password** immediately from inside the portal
4. View and print term results for each session

For full details see **[docs/STUDENT_PORTAL.md](docs/STUDENT_PORTAL.md)**.

### Registration (Staff only)

New student accounts are created by staff at:

```
https://gsshong.edu.ng/register
```

This URL is intentionally hidden from the public navigation.

---

## 👨‍💼 Admin Portal

The admin portal is accessible at:

```
https://gsshong.edu.ng/admin
```

This URL is hidden from public navigation. Admins can:

- View all registered students
- Enter subject scores (CA out of 30, Exam out of 70)
- **Save as draft** — only admins see it; students cannot yet
- **Release** the result — students can now view and print
- Unpublish, edit, or delete results

For setup and usage, see **[docs/ADMIN_GUIDE.md](docs/ADMIN_GUIDE.md)**.

### Grading Scale (Nigerian WAEC)

| Grade | Mark Range | Description |
|---|---|---|
| A1 | 75 – 100 | Excellent |
| B2 | 70 – 74 | Very Good |
| B3 | 65 – 69 | Good |
| C4 | 60 – 64 | Credit |
| C5 | 55 – 59 | Credit |
| C6 | 50 – 54 | Credit |
| D7 | 45 – 49 | Pass |
| E8 | 40 – 44 | Pass |
| F9 | 0 – 39 | Fail |

---

## 🔍 SEO & Performance

The portal includes comprehensive SEO optimisations:

- **HTML meta tags** — title, description, keywords, robots, canonical URL
- **Open Graph** — rich previews on WhatsApp, Facebook, LinkedIn
- **Twitter/X Cards** — `summary_large_image` card type
- **Schema.org JSON-LD** — `School` (EducationalOrganization), `WebSite`, `BreadcrumbList`
- **Geo meta tags** — `geo.region: NG-AD`, coordinates for Hong, Adamawa State
- **PWA Manifest** — installable as a web app on Android/iOS
- **Sitemap** — `public/sitemap.xml` with all public pages
- **robots.txt** — hides `/admin` and `/register` from indexing

---

## 🌐 Deployment

### Recommended: Vercel or Netlify

```bash
# Build the portal
pnpm --filter @workspace/gss-hong run build
# Output is in: artifacts/gss-hong/dist/
```

Set the publish directory to `artifacts/gss-hong/dist/` and configure all `VITE_FIREBASE_*` environment variables on the platform.

### Custom Domain

Update the following after setting your custom domain:

1. `artifacts/gss-hong/index.html` — `og:url`, `link[rel=canonical]`, `og:image`, schema.org `url` fields
2. `artifacts/gss-hong/public/sitemap.xml` — all `<loc>` entries
3. `artifacts/gss-hong/public/robots.txt` — `Sitemap:` directive

---

## 🤝 Contributing

Contributions are welcome from students, staff, and alumni of GSS Hong.

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-improvement`
3. Make your changes and commit: `git commit -m "feat: add my improvement"`
4. Push to your fork: `git push origin feature/my-improvement`
5. Open a Pull Request

Please keep commits focused and write meaningful commit messages.

---

## 👨‍💻 About the Developer

This website was designed and built by **Paul Adamu** (online handle: **PA_ZTI**).

| | |
|---|---|
| 🎓 **Education** | Computer Science, Benson Idahosa University |
| 🏢 **Venture** | Founder, ZeroTrace Intelligence |
| 🌍 **Location** | Adamawa State, Nigeria |
| 💼 **Skills** | React, Next.js, TypeScript, Python, Tailwind CSS |
| 🔐 **Focus** | Web development + offensive security research |

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Paul_Adamu-0A66C2?style=flat&logo=linkedin)](https://www.linkedin.com/in/paul-adamu-67bb46324)
[![GitHub](https://img.shields.io/badge/GitHub-Celebrityattitude2008-181717?style=flat&logo=github)](https://github.com/Celebrityattitude2008)

---

## 📄 License

This project is licensed under the **MIT License** — see [LICENSE](LICENSE) for details.

The school name, crest, and institutional identity belong to Government Secondary School, Hong, and the Adamawa State Ministry of Education.

---

<div align="center">

Made with ❤️ for Government Secondary School, Hong

**GSS Hong · Est. 1967 · Excellence in Education**

</div>
