# PokéFlix - Netflix Style Pokemon Interface

A production-ready, enterprise-grade Pokemon viewing application built with React, TypeScript, and styled-components. Features a Netflix-inspired interface with comprehensive functionality, modern development practices, and automated CI/CD deployment.

## 🚀 Features

### Core Application Features

- **🔐 Complete Authentication System**:
  - Fake login/signup with form validation
  - User session management with localStorage persistence
  - User-specific favorites and data isolation
  - Automatic session restoration on app reload

- **🎮 Advanced Pokemon Browsing**:
  - Infinite scroll grid with optimized performance
  - Real-time search with debounced input
  - Type-based filtering (Fire, Water, Grass, Electric, etc.)
  - Load more functionality with proper state management
  - Responsive grid layout adapting to screen sizes

- **📱 Detailed Pokemon Views**:
  - Modal overlay with comprehensive Pokemon information
  - Stats visualization with progress bars
  - Type badges with theme-consistent colors
  - High-quality sprite images with fallbacks
  - Smooth animations and transitions

- **❤️ Favorites Management**:
  - Add/remove Pokemon from personal favorites
  - User-specific favorites with localStorage sync
  - Dedicated favorites page with grid layout
  - Persistent favorites across sessions
  - Visual feedback for favorite status

- **🎨 Netflix-Inspired UI/UX**:
  - Fixed header with navigation and user info
  - Fixed footer with credits and attribution
  - Full-height layout utilizing entire viewport
  - Dark theme with Netflix color palette
  - Smooth hover effects and micro-interactions

### Technical Excellence

- **⚡ Modern Development Stack**:
  - React 19 with TypeScript for type safety
  - Vite for lightning-fast development and builds
  - styled-components with css prop for dynamic styling
  - React Query (@tanstack/react-query) for data fetching and caching
  - pnpm for efficient package management

- **🏗️ Enterprise Architecture**:
  - Centralized theme system with design tokens
  - Reusable component library with consistent styling
  - Context API for global state management
  - Custom hooks for data fetching and business logic
  - Barrel exports for clean import structure

- **🧪 Comprehensive Testing**:
  - 35+ unit tests with Vitest and React Testing Library
  - Component testing with DOM manipulation
  - Helper function testing with mock data
  - Pre-commit hooks ensuring code quality
  - 100% test coverage for critical paths

- **🚀 Production Deployment**:
  - GitHub Actions CI/CD pipeline with 4 stages
  - Automated testing, building, and deployment
  - GitHub Pages hosting with custom domain support
  - Pre-commit hooks with ESLint and Prettier
  - Automatic dependency caching and optimization

## 🎨 Design

The application follows Netflix's design principles:

- **Fixed Header/Footer**: Always visible navigation and branding
- **Full Height Layout**: Utilizes entire viewport height
- **Dark Theme**: Netflix-inspired color scheme
- **Smooth Animations**: Hover effects and transitions
- **Mobile Responsive**: Optimized for all screen sizes

## 🛠️ Technology Stack

### Frontend & Core

- **React 19**: Latest React with concurrent features and improved performance
- **TypeScript**: Strict type checking with comprehensive type definitions
- **Vite**: Ultra-fast build tool with HMR and optimized bundling
- **styled-components**: CSS-in-JS with theme system and dynamic styling
- **pokenode-ts**: Type-safe Pokemon API client with full TypeScript support

### State Management & Data

- **React Query (@tanstack/react-query)**: Server state management with caching and synchronization
- **React Context API**: Global state for authentication and favorites
- **localStorage**: Persistent client-side storage for user data
- **Custom Hooks**: Reusable business logic with proper abstractions

### Styling & Design System

- **Centralized Theme**: Design tokens for colors, typography, spacing, and breakpoints
- **Polished**: Utility library for rem conversion and color manipulation
- **Media Query Utilities**: Responsive design with consistent breakpoint usage
- **Component Library**: Reusable styled components with consistent patterns
- **Global Styles**: Typography system with object-based CSS approach

### Development & Quality

- **ESLint**: Code quality with TypeScript, React, and import ordering rules
- **Prettier**: Consistent code formatting across the entire codebase
- **Husky**: Git hooks for automated quality checks
- **lint-staged**: Run linters only on staged files for faster commits
- **Vitest**: Modern testing framework with native TypeScript support
- **React Testing Library**: Component testing with user-centric approach
- **jsdom**: DOM simulation for testing React components

### CI/CD & Deployment

- **GitHub Actions**: 4-stage pipeline (Lint → Test → Build → Deploy)
- **GitHub Pages**: Automatic deployment with custom domain support
- **pnpm**: Fast, efficient package manager with workspace support
- **Artifact Caching**: Optimized builds with dependency and build caching
- **Environment Configuration**: Production-ready builds with proper base paths

## 📦 Installation

### Prerequisites

- **Node.js**: Version 20 or higher
- **pnpm**: Version 9.0.0 or higher (recommended package manager)

### Quick Start

```bash
# Clone the repository
git clone https://github.com/paganjin/pokemon-netflix.git
cd pokemon-netflix

# Install dependencies (automatically sets up pre-commit hooks)
pnpm install

# Start development server with hot reload
pnpm dev

# Open http://localhost:5173 in your browser
```

### Available Scripts

```bash
# Development
pnpm dev                # Start development server
pnpm build              # Build for production
pnpm preview            # Preview production build locally

# Testing
pnpm test               # Run tests once
pnpm test:watch         # Run tests in watch mode
pnpm test:ui            # Run tests with Vitest UI

# Code Quality
pnpm lint               # Run ESLint
pnpm lint:fix           # Fix ESLint issues automatically
pnpm format             # Format code with Prettier
pnpm format:check       # Check code formatting

# Git Hooks
pnpm prepare            # Set up Husky git hooks
pnpm pre-commit         # Run pre-commit checks manually
```

## 🎮 Usage

### Login

- Enter any username and password to access the application
- Credentials are stored in localStorage for persistence

### Browsing Pokemon

- **Home Page**: Browse all Pokemon with infinite scroll
- **Search**: Type Pokemon names in the search bar
- **Filter**: Click type badges to filter by Pokemon type
- **Details**: Click any Pokemon card to view detailed information

### Managing Favorites

- **Add to Favorites**: Click the heart icon on any Pokemon card
- **View Favorites**: Navigate to "My List" in the header
- **Remove from Favorites**: Click the heart icon again to remove

### Navigation

- **Header**: Fixed navigation with logo, menu, and user info
- **Footer**: Credits and API attribution
- **Responsive**: Adapts to mobile, tablet, and desktop screens

## 🧪 Testing

The application includes comprehensive unit tests:

```bash
# Run tests in watch mode
pnpm test

# Run tests once
pnpm run test:run

# Run tests with UI
pnpm run test:ui
```

### Test Coverage

- **Login Component**: Form validation and user interactions
- **Pokemon Service**: API calls and data transformation
- **Context Providers**: Authentication and favorites management

## 🏗️ Architecture

### Project Structure

```
pokemon-netflix/
├── .github/
│   ├── workflows/           # GitHub Actions CI/CD pipeline
│   ├── ISSUE_TEMPLATE/      # Bug report and feature request templates
│   └── pull_request_template.md
├── .husky/                  # Git hooks configuration
├── src/
│   ├── components/
│   │   ├── Auth/            # Authentication components
│   │   │   ├── Login.tsx    # Login/signup form with validation
│   │   │   ├── Login.test.tsx # Comprehensive component tests
│   │   │   └── index.ts     # Barrel exports
│   │   ├── Layout/          # Layout components
│   │   │   ├── Header.tsx   # Fixed navigation with responsive menu
│   │   │   ├── Footer.tsx   # Credits and attribution
│   │   │   ├── Layout.tsx   # Main layout wrapper
│   │   │   └── index.ts     # Barrel exports
│   │   └── Pokemon/         # Pokemon-specific components
│   │       ├── PokemonGrid.tsx      # Infinite scroll grid with search/filter
│   │       ├── PokemonCard.tsx      # Individual Pokemon display
│   │       ├── PokemonModal.tsx     # Detailed Pokemon information
│   │       ├── FavoritesGrid.tsx    # User favorites display
│   │       └── index.ts             # Barrel exports
│   ├── hooks/               # Custom React hooks
│   │   ├── helpers.ts       # API helper functions with error handling
│   │   ├── helpers.test.ts  # Comprehensive unit tests (35+ tests)
│   │   ├── useInfinitePokemonList.ts # Infinite scroll hook
│   │   ├── usePokemonByIds.ts       # Multi-Pokemon fetching
│   │   ├── usePokemonsByType.ts     # Type-filtered Pokemon
│   │   ├── useSearchPokemon.ts      # Debounced search hook
│   │   └── index.ts         # Barrel exports
│   ├── providers/           # React Context providers
│   │   ├── AuthContext.tsx  # Authentication state management
│   │   ├── FavoritesContext.tsx # Favorites with localStorage sync
│   │   ├── QueryProvider.tsx    # React Query configuration
│   │   └── index.ts         # Barrel exports
│   ├── styles/              # Design system and styling
│   │   ├── theme.ts         # Centralized design tokens
│   │   ├── GlobalStyles.ts  # Global typography and reset styles
│   │   └── index.ts         # Barrel exports
│   ├── types/               # TypeScript type definitions
│   │   └── index.ts         # Shared types and interfaces
│   ├── utils/               # Utility functions
│   │   └── pokemonClient.ts # Configured pokenode-ts client
│   ├── App.tsx              # Main application component
│   └── index.tsx            # Application entry point
├── eslint.config.js         # ESLint configuration with TypeScript rules
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite build configuration
└── README.md                # Comprehensive documentation
```

### Key Components & Architecture

#### **Authentication System**

- **AuthContext**: JWT-like session management with localStorage
- **Login Component**: Form validation, signup/login modes, error handling
- **Protected Routes**: User-specific data isolation and session persistence

#### **Pokemon Data Management**

- **React Query Integration**: Server state caching and synchronization
- **Custom Hooks**: Abstracted data fetching with proper error boundaries
- **pokenode-ts Client**: Type-safe API integration with comprehensive Pokemon data
- **Helper Functions**: Input validation, error handling, and data transformation

#### **UI Component System**

- **Layout Components**: Fixed header/footer with responsive navigation
- **Pokemon Grid**: Virtualized infinite scroll with search and type filtering
- **Modal System**: Overlay components with proper focus management
- **Theme System**: Centralized design tokens with consistent styling

#### **State Management Strategy**

- **Server State**: React Query for Pokemon data caching and synchronization
- **Global State**: Context API for authentication and favorites
- **Local State**: Component-specific state with React hooks
- **Persistent State**: localStorage for user preferences and favorites

## 🎯 Requirements Fulfilled

### Core MVP Features ✅

- ✅ **Advanced Authentication System**: Complete login/signup with form validation and user session management
- ✅ **Pokemon Browsing Interface**: Homepage with infinite scroll, search, and type filtering
- ✅ **Detailed Pokemon Views**: Comprehensive modal with stats, types, and sprite images
- ✅ **Favorites Management**: User-specific favorites with localStorage persistence and dedicated page
- ✅ **Responsive Design**: Mobile-first approach with tablet and desktop optimization

### Visual & UX Requirements ✅

- ✅ **Full Height Layout**: Utilizes entire viewport with proper flex layout
- ✅ **Fixed Header Navigation**: Always visible with responsive menu and user info
- ✅ **Fixed Footer**: Credits and attribution always at bottom
- ✅ **Content Area**: Properly sandwiched between header and footer
- ✅ **Mobile Optimization**: No pinch/zoom needed, touch-friendly interactions
- ✅ **Netflix-Inspired Design**: Dark theme with smooth animations and hover effects
- ✅ **Accessibility**: Proper focus management and keyboard navigation

### Technical Excellence ✅

- ✅ **React 19 Implementation**: Latest React with concurrent features and performance optimizations
- ✅ **Modern Styling Architecture**: styled-components with centralized theme system and design tokens
- ✅ **Browser Compatibility**: Modern browser support with flexbox/grid and ES2020+ features
- ✅ **Comprehensive Testing**: 35+ unit tests with Vitest and React Testing Library
- ✅ **Production-Ready Build**: Optimized Vite builds with proper chunking and caching
- ✅ **TypeScript Integration**: Strict type checking with comprehensive type definitions
- ✅ **PokéAPI Integration**: Type-safe integration with pokenode-ts client library

### Advanced Features ✅

- ✅ **Enterprise Architecture**: Barrel exports, custom hooks, and modular component structure
- ✅ **Performance Optimization**: React Query caching, infinite scroll, and lazy loading
- ✅ **Development Workflow**: ESLint, Prettier, pre-commit hooks, and automated formatting
- ✅ **CI/CD Pipeline**: 4-stage GitHub Actions workflow with automated testing and deployment
- ✅ **Error Handling**: Comprehensive error boundaries and user-friendly error messages
- ✅ **State Management**: Context API for global state with localStorage synchronization
- ✅ **Code Quality**: 100% TypeScript coverage with strict mode and comprehensive linting rules

## 🚀 CI/CD Pipeline

The project includes a complete GitHub Actions CI/CD pipeline with the following stages:

### Pre-commit Hooks

- **Format Check**: Prettier formatting validation
- **Lint Check**: ESLint code quality validation
- **Auto-fix**: Automatically fixes formatting and linting issues

```bash
# Install pre-commit hooks (runs automatically after pnpm install)
pnpm prepare

# Manually run pre-commit checks
pnpm pre-commit
```

### GitHub Actions Workflow

The CI/CD pipeline runs on every push and pull request:

1. **Lint Stage**: Format checking, ESLint, and TypeScript compilation
2. **Test Stage**: Unit tests with coverage reporting
3. **Build Stage**: Production build and artifact upload
4. **Deploy Stage**: Automatic deployment to GitHub Pages (main branch only)

### Deployment

The application automatically deploys to GitHub Pages when code is pushed to the main branch.

**Manual Deployment:**

```bash
# Build for production
pnpm build

# The dist/ folder contains the built application
# Deploy the contents to your hosting service
```

### Hosting Options

- **GitHub Pages**: Automatic deployment via GitHub Actions (recommended)
- **Netlify**: Drag and drop the `dist` folder
- **Vercel**: Connect your Git repository
- **AWS S3**: Upload to S3 bucket with static hosting

## 🔧 Configuration

### Environment Variables

No environment variables are required. The application uses the public PokéAPI.

### Customization

- **Theme**: Modify `src/styles/theme.ts` for colors and spacing
- **API**: Update `src/services/pokemonApi.ts` for different endpoints
- **Layout**: Adjust `src/components/Layout/` components for structure

## 📱 Browser Support

- **Chrome**: 90+
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- **PokéAPI**: Free Pokemon data API
- **Netflix**: Design inspiration
- **Pokemon Company**: Original Pokemon designs and concepts
