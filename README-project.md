
# DevSource - Developer Database for Tech Recruiters

A modern, dark-themed landing page for a tech recruitment database company.

## Project Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── Header.tsx        # Navigation header
│   │   ├── Footer.tsx        # Site footer
│   │   └── Layout.tsx        # Main layout wrapper
│   ├── sections/
│   │   ├── HeroSection.tsx   # Hero/landing section
│   │   ├── FeaturesSection.tsx # Features showcase
│   │   ├── ValueSection.tsx   # Value proposition
│   │   └── ContactSection.tsx # Contact form
│   └── ui/                   # Shadcn UI components
├── hooks/
│   └── useContactForm.ts     # Contact form logic
├── pages/
│   └── Index.tsx            # Main landing page
├── types/
│   └── index.ts             # TypeScript type definitions
└── utils/
    └── constants.ts         # App constants and config
```

## Features

- 🎨 Dark theme with modern design
- 📱 Fully responsive layout
- ⚡ Built with React + TypeScript
- 🎯 Optimized for tech recruitment industry
- 📧 Contact form with toast notifications
- 🏗️ Modular component architecture

## Tech Stack

- React 18
- TypeScript
- Tailwind CSS
- Shadcn/ui
- Lucide React Icons
- React Router DOM

## Getting Started

1. Install dependencies: `npm install`
2. Start development server: `npm run dev`
3. Build for production: `npm run build`

## Customization

- Update company info in `src/utils/constants.ts`
- Modify styling in individual components
- Add new sections in `src/components/sections/`
- Extend types in `src/types/index.ts`
