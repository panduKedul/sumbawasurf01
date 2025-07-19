# Sumbawa Surf Guide

A comprehensive surf guide application for West Sumbawa, Indonesia, built with React, TypeScript, and Supabase.

## 🏗️ Project Structure

This project is organized into two main sections:

### 📁 **BackEnd Section** (`/backend`)
Contains all server-side logic, database configurations, and API services:

```
backend/
├── database/
│   └── supabase.ts          # Supabase client configuration
├── types/
│   ├── index.ts             # Backend type definitions
│   └── supabase.ts          # Supabase database types
├── api/
│   └── spots.ts             # Surf spots API and data
└── auth/
    └── authService.ts       # Authentication service logic
```

### 🎨 **FrontEnd Section** (`/frontend`)
Contains all user interface components, pages, and client-side logic:

```
frontend/
├── components/              # Reusable UI components
│   ├── Header.tsx
│   ├── Map.tsx
│   ├── SpotList.tsx
│   ├── SpotDetails.tsx
│   ├── UserDashboard.tsx
│   ├── AdminPanel.tsx
│   └── ...
├── pages/                   # Page components
│   ├── Login.tsx
│   └── Register.tsx
├── contexts/                # React contexts
│   └── AuthContext.tsx
├── hooks/                   # Custom React hooks
│   └── useAdmin.ts
├── types/                   # Frontend type definitions
│   └── index.ts
└── utils/                   # Utility functions and re-exports
    ├── supabase.ts
    └── spots.ts
```

## 🚀 **Key Features**

### **BackEnd Features:**
- ✅ **Supabase Integration** - Complete database setup with RLS
- ✅ **Authentication Service** - User registration, login, and profile management
- ✅ **Surf Spots API** - Dynamic spot data with fallback to static data
- ✅ **Type Safety** - Full TypeScript support with database types
- ✅ **Error Handling** - Comprehensive error management

### **FrontEnd Features:**
- ✅ **Interactive Map** - Leaflet-based surf spot visualization
- ✅ **Tide Information** - Real-time tide data for multiple stations
- ✅ **Weather Maps** - Wind and wave forecasts from Windy
- ✅ **User Dashboard** - Favorites, alerts, and personalized recommendations
- ✅ **Admin Panel** - Surf spot management for administrators
- ✅ **Responsive Design** - Mobile-first approach with Tailwind CSS
- ✅ **Authentication UI** - Login/register with profile management

## 🛠️ **Technology Stack**

### **BackEnd:**
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **Types:** TypeScript with auto-generated Supabase types
- **API:** RESTful API through Supabase client

### **FrontEnd:**
- **Framework:** React 18 with TypeScript
- **Styling:** Tailwind CSS with custom dark theme
- **Maps:** React Leaflet for interactive maps
- **Routing:** React Router DOM
- **State Management:** React Context API
- **Notifications:** React Hot Toast
- **Build Tool:** Vite

## 📦 **Installation & Setup**

1. **Clone the repository**
2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the project root:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up Supabase database:**
   - Run the SQL migration in `supabase/migrations/create_complete_schema.sql`
   - This creates all necessary tables, RLS policies, and triggers

5. **Start the development server:**
   ```bash
   npm run dev
   ```

## 🗄️ **Database Schema**

The application uses the following main tables:
- **profiles** - User profile information
- **surf_spots** - Surf spot data and details
- **favorites** - User's favorite surf spots
- **alerts** - Surf condition alerts for users
- **admins** - Admin user management

## 🔐 **Security Features**

- **Row Level Security (RLS)** enabled on all tables
- **User authentication** with Supabase Auth
- **Admin role management** for content control
- **Secure API endpoints** with proper authorization

## 🌊 **Surf Spots Included**

The application includes 11 world-class surf spots in West Sumbawa:
- Northern Right Beach
- Dirty Hippies Beach
- Mangrove Beach
- Limestone Beach
- Scar Reef Beach
- Bingin Beach
- Phantom Beach
- Super Suck Beach
- Yoyo's Beach
- Tropical Beach
- Sedjorong Beach

## 📱 **Responsive Design**

The application is fully responsive and optimized for:
- 📱 Mobile devices (320px+)
- 📱 Tablets (768px+)
- 💻 Desktop (1024px+)
- 🖥️ Large screens (1440px+)

## 🎨 **Design System**

- **Color Scheme:** Dark theme with neon blue accents
- **Typography:** Titillium Web font family
- **Components:** Elegant cards with subtle animations
- **Icons:** Lucide React icon library

---

**Built with ❤️ for the surfing community in Sumbawa, Indonesia** 🏄‍♂️🌊