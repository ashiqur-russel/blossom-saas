# 🌸 Blossom - Flower Business Management Platform

<div align="center">

**A modern, responsive web application for managing flower business operations, sales tracking, and financial analytics.**

[![Angular](https://img.shields.io/badge/Angular-20.0.0-red.svg)](https://angular.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Key Features in Detail](#key-features-in-detail)
- [Screenshots](#screenshots)
- [Development](#development)
- [Build & Deployment](#build--deployment)

---

## 🎯 Overview

**Blossom** is a comprehensive business management platform designed specifically for flower businesses. It provides an intuitive interface for tracking weekly sales, managing inventory, analyzing profits, and monitoring business performance through interactive dashboards and visual analytics.

### What Makes Blossom Special?

- ✨ **Modern UI/UX** - Clean, responsive design with smooth animations
- 📊 **Real-time Analytics** - Interactive charts and visualizations
- 🔐 **Secure Authentication** - JWT-based auth with refresh tokens
- 📱 **Mobile Responsive** - Works seamlessly on all devices
- 🎨 **Theme Consistency** - Beautiful pink-themed design system
- ⚡ **Performance Optimized** - Fast loading and smooth interactions

---

## ✨ Features

### 🔐 Authentication & Authorization
- User registration and login
- Secure JWT authentication
- Refresh token management
- Protected routes with guards
- Role-based access control

### 📊 Dashboard & Analytics
- **Weekly Sales Overview** - Track sales by week with detailed breakdowns
- **Profit Analysis** - Visualize profit trends and patterns
- **Revenue Tracking** - Monitor revenue over time
- **Interactive Charts** - Line charts, bar charts, and pie charts
- **KPI Cards** - Key performance indicators at a glance
- **Savings Tracking** - Monitor business savings

### 📝 Sales Management
- **Weekly Sales Entry** - Add and edit weekly sales data
- **Day-wise Breakdown** - Track sales by day (Thursday, Friday, Saturday)
- **Form Validation** - Comprehensive input validation
- **Data Editing** - Edit existing sales records
- **Quick Actions** - Delete and manage sales entries

### 💰 Withdrawal Management
- Track business withdrawals
- Withdrawal summary and analytics
- Financial overview

### 🏠 Landing Page
- **Hero Section** - Engaging introduction
- **Features Showcase** - Highlight key capabilities
- **How It Works** - Step-by-step guide
- **Benefits** - Value proposition
- **Testimonials** - Social proof
- **Statistics** - Impressive metrics
- **FAQ** - Common questions
- **Call-to-Action** - Conversion optimization

---

## 🛠 Technology Stack

### Core Framework
- **Angular 20.0.0** - Modern web framework
- **TypeScript 5.9.2** - Type-safe development
- **RxJS 7.8.0** - Reactive programming

### UI & Styling
- **SCSS** - Advanced CSS preprocessing
- **CSS Variables** - Theme management
- **Responsive Design** - Mobile-first approach
- **Custom Component Library** - Reusable UI components

### State Management
- **RxJS Observables** - Reactive state management
- **Services** - Centralized business logic
- **HTTP Interceptors** - Request/response handling

### Charts & Visualization
- **Chart.js** - Interactive data visualization
- **Custom Chart Service** - Reusable chart configurations

---

## 🏗 Architecture

### Design Patterns

#### Container-Presentation Pattern
- **Container Components** - Handle data fetching and business logic
- **Presentation Components** - Focus on UI rendering
- Clear separation of concerns

#### Feature-Based Structure
```
features/
  ├── auth/          # Authentication module
  ├── dashboard/     # Dashboard module
  ├── weeks/         # Weekly sales module
  ├── withdrawals/   # Withdrawal module
  └── landing/       # Landing page module
```

#### Shared Resources
```
shared/
  ├── layouts/       # Layout components
  ├── ui/            # Reusable UI components
  ├── models/        # TypeScript interfaces
  ├── services/      # Shared services
  └── utils/         # Utility functions
```

### Key Principles
- ✅ **DRY (Don't Repeat Yourself)** - Shared utilities and components
- ✅ **SOLID Principles** - Single responsibility, dependency injection
- ✅ **Component Reusability** - Modular, reusable components
- ✅ **Type Safety** - Full TypeScript coverage
- ✅ **Lazy Loading** - Optimized route loading

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** (v10.9.0 or higher)
- **Angular CLI** (v20.0.0)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd flower-business/apps/flower-client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   # Update src/environments/environment.ts
   export const environment = {
     production: false,
     apiUrl: 'http://localhost:3000'
   };
   ```

4. **Start development server**
   ```bash
   npm start
   ```

5. **Open in browser**
   ```
   http://localhost:4200
   ```

---

## 📁 Project Structure

```
src/
├── app/
│   ├── features/              # Feature modules
│   │   ├── auth/              # Authentication
│   │   ├── dashboard/         # Dashboard & analytics
│   │   ├── weeks/             # Weekly sales management
│   │   ├── withdrawals/       # Withdrawal management
│   │   └── landing/           # Landing page
│   ├── shared/                 # Shared resources
│   │   ├── layouts/           # Layout components
│   │   ├── ui/                # UI components
│   │   ├── models/            # TypeScript models
│   │   ├── services/          # Shared services
│   │   └── utils/             # Utility functions
│   ├── app.routes.ts          # Route configuration
│   └── app.config.ts          # App configuration
├── environments/               # Environment configs
├── styles/                     # Global styles
│   ├── _theme.scss            # Theme variables
│   └── components.scss        # Component styles
└── index.html                  # Entry HTML
```

---

## 🎨 Key Features in Detail

### 1. Authentication System

**Location for Screenshot:** `[Screenshot: Login Page]`

- Modern login/register forms
- Form validation with error messages
- Secure token management
- Automatic token refresh
- Protected route guards

**Location for Screenshot:** `[Screenshot: Register Page]`

### 2. Dashboard Analytics

**Location for Screenshot:** `[Screenshot: Dashboard Overview]`

- **KPI Cards** - Total revenue, profit, savings, weeks tracked
- **Profit Chart** - Line chart showing profit trends
- **Sales Chart** - Bar chart for sales visualization
- **Revenue & Profit Trends** - Comparative analysis
- **Profit vs Savings** - Side-by-side comparison
- **Sales by Day** - Pie chart breakdown
- **Daily Sales Trends** - Day-wise patterns

**Location for Screenshot:** `[Screenshot: Dashboard Charts]`

### 3. Weekly Sales Management

**Location for Screenshot:** `[Screenshot: Sales Form]`

- Intuitive form for entering weekly sales
- Day-wise sales input (Thursday, Friday, Saturday)
- Real-time calculations
- Form validation
- Edit existing entries

**Location for Screenshot:** `[Screenshot: Week Cards]`

### 4. Landing Page

**Location for Screenshot:** `[Screenshot: Landing Page Hero]`

- **Hero Section** - Eye-catching introduction with CTA
- **Features Section** - Key features grid
- **How It Works** - Step-by-step process
- **Benefits** - Value propositions
- **Testimonials** - Customer reviews
- **Statistics** - Impressive numbers
- **FAQ** - Common questions
- **Footer** - Links and information

**Location for Screenshot:** `[Screenshot: Landing Page Features]`

### 5. Responsive Design

**Location for Screenshot:** `[Screenshot: Mobile View]`

- Mobile-first responsive design
- Adaptive layouts
- Touch-friendly interactions
- Optimized for all screen sizes

---

## 📸 Screenshots

> **Note:** Add screenshots in the following locations to demonstrate the application:

### Authentication
- `[Screenshot: Login Page]` - Show the login form with modern design
- `[Screenshot: Register Page]` - Display registration form

### Dashboard
- `[Screenshot: Dashboard Overview]` - Full dashboard with all KPIs and charts
- `[Screenshot: Dashboard Charts]` - Close-up of interactive charts
- `[Screenshot: Weekly View]` - Weekly sales cards and data

### Sales Management
- `[Screenshot: Sales Form]` - Form for entering weekly sales
- `[Screenshot: Week Cards]` - Visual representation of weekly data
- `[Screenshot: Edit Week]` - Editing existing sales data

### Landing Page
- `[Screenshot: Landing Page Hero]` - Hero section with CTA
- `[Screenshot: Landing Page Features]` - Features showcase section
- `[Screenshot: Landing Page Stats]` - Statistics section

### Responsive Design
- `[Screenshot: Mobile View]` - Mobile responsive layout
- `[Screenshot: Tablet View]` - Tablet layout
- `[Screenshot: Desktop View]` - Desktop layout

---

## 💻 Development

### Available Scripts

```bash
# Start development server
npm start

# Build for production
npm run build

# Build with watch mode
npm run watch

# Run tests
npm test
```

### Code Style

- **Prettier** - Code formatting
- **TypeScript** - Type checking
- **ESLint** - Code linting (if configured)

### Best Practices

- ✅ Use standalone components
- ✅ Implement proper error handling
- ✅ Follow Angular style guide
- ✅ Write reusable components
- ✅ Use TypeScript interfaces
- ✅ Implement proper loading states

---

## 🏗 Build & Deployment

### Production Build

```bash
npm run build
```

Output will be in `dist/flower-client/` directory.

### Environment Configuration

Update `src/environments/environment.ts` for production:

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://your-api-url.com'
};
```

### Deployment Options

- **Static Hosting** - Deploy to Netlify, Vercel, or GitHub Pages
- **CDN** - Use CloudFront, Cloudflare
- **Server** - Nginx, Apache, or Node.js server

---

## 🎨 Design System

### Color Palette

- **Primary:** `#e91e63` (Pink)
- **Background:** `#fefefe` (White)
- **Foreground:** `#2d1b2e` (Dark Purple)
- **Muted:** `#fce7f3` (Light Pink)
- **Accent:** `#d1fae5` (Light Green)

### Typography

- **Headings:** Bold, modern sans-serif
- **Body:** Clean, readable font
- **Code:** Monospace for technical content

### Components

- **Buttons** - Primary, secondary, danger variants
- **Inputs** - Modern styled form inputs
- **Cards** - Elevated card components
- **Charts** - Interactive data visualizations

---

## 📚 Additional Resources

- [Angular Documentation](https://angular.io/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [RxJS Documentation](https://rxjs.dev/)
- [Chart.js Documentation](https://www.chartjs.org/)

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👥 Team

Built with ❤️ by the Blossom team

---

<div align="center">

**Made with Angular & TypeScript**

[⬆ Back to Top](#-blossom---flower-business-management-platform)

</div>
