# 🎬 Pokemon Netflix

A Netflix-inspired Pokemon web application built with React and TypeScript. Browse Pokemon like your favorite streaming service!

## 🚀 Live Demo

**[View Live App](https://paganjin.github.io/pokemon-netflix/)**

## ✨ Features

### 🔐 Authentication System

- **User Registration**: Create accounts with username/password validation
- **Secure Login**: Persistent authentication with localStorage
- **Session Management**: Automatic login state preservation
- **Protected Routes**: Route-level authentication guards

### 🎯 Pokemon Discovery

- **Infinite Scroll**: Seamless browsing through all 1000+ Pokemon
- **Real-time Search**: Find Pokemon by name with instant results
- **Type Filtering**: Browse Pokemon by their elemental types
- **Detailed Modal Views**: Comprehensive Pokemon stats and information

### ❤️ Personal Collections

- **Favorites System**: Save Pokemon to personal collection
- **My List Page**: Netflix-style favorites management

## 🛠️ Tech Stack

### Frontend Framework
- **React 19** - Latest React with concurrent features and new hooks
- **TypeScript** - Strict type safety with comprehensive type definitions
- **Vite** - Lightning-fast build tool with HMR

### Styling & UI
- **styled-components 6** - CSS-in-JS with full TypeScript support
- **Responsive Design** - Mobile-first with 4 breakpoint system
- **Custom Theme System** - Centralized design tokens and utilities
- **SVG Icons** - Custom Pokeball and Pokemon-themed vector assets

### State Management & Data
- **TanStack React Query 5** - Advanced server state with caching and background updates
- **React Context API** - Global state for authentication and favorites
- **React Hook Form** - Performant forms with validation and error handling
- **Cross-Tab Synchronization** - Custom storage event listeners

### API & Backend
- **pokenode-ts** - Type-safe Pokemon API client with full PokeAPI coverage
- **PokeAPI v2** - RESTful Pokemon database (1000+ Pokemon, types, abilities)
- **Client-Side Storage** - Sophisticated localStorage with error handling
- **API Error Handling** - Comprehensive error boundaries and retry logic

### Development & Quality
- **ESLint 9** - Modern linting with custom rules and TypeScript integration
- **Prettier** - Consistent code formatting across the project
- **Husky + lint-staged** - Pre-commit hooks for code quality
- **Strict TypeScript** - Zero `any` types, comprehensive type coverage

### Testing & Quality Assurance
- **Vitest** - Fast unit testing with native TypeScript support
- **@testing-library/react** - Component testing with accessibility focus
- **Playwright** - Cross-browser E2E testing (Chrome, Firefox, Safari, Mobile)
- **100% Test Coverage** - All unit tests (90/90) and E2E tests (100/100) passing
- **CI/CD Pipeline** - Automated testing and deployment

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+** - JavaScript runtime
- **pnpm 9+** (recommended) or npm - Package manager

### Installation & Setup

```bash
# Clone the repository
git clone https://github.com/paganjin/pokemon-netflix.git
cd pokemon-netflix

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

The app will be available at `http://localhost:5173`

## 📝 Available Scripts

### Development
```bash
pnpm dev          # Start dev server at localhost:5173
pnpm build        # Build for production
pnpm preview      # Preview production build
```

### Code Quality
```bash
pnpm lint         # Run ESLint checks
pnpm lint:fix     # Auto-fix ESLint issues
pnpm format       # Format code with Prettier
pnpm format:check # Check code formatting
```

### Testing
```bash
# Unit Tests
pnpm test         # Run all unit tests once
pnpm test:watch   # Run tests in watch mode
pnpm test:ui      # Run tests with Vitest UI
pnpm test:coverage # Run tests with coverage report

# E2E Tests  
pnpm test:e2e     # Run Playwright tests
pnpm test:e2e:ui  # Run E2E tests with UI
pnpm test:e2e:headed # Run E2E tests with visible browser

# Combined
pnpm test:all     # Run both unit and E2E tests
```

# Git Hooks
pnpm prepare      # Setup Husky git hooks

## 🏗️ Project Structure

```
pokemon-netflix/
├── public/                 # Static assets
│   ├── 404.html           # GitHub Pages SPA fallback
│   └── vite.svg           # Favicon
├── src/
│   ├── components/        # React components
│   │   ├── Auth/          # Authentication components
│   │   │   ├── Login.tsx  # Login/signup form
│   │   │   └── index.ts   # Barrel exports
│   │   ├── Layout/        # Layout components
│   │   │   ├── Header.tsx # Navigation header
│   │   │   ├── Footer.tsx # Site footer
│   │   │   ├── Layout.tsx # Main layout wrapper
│   │   │   └── index.ts   # Barrel exports
│   │   ├── Pokemon/       # Pokemon-related components
│   │   │   ├── PokemonGrid.tsx     # Infinite scroll grid
│   │   │   ├── PokemonCard.tsx     # Individual Pokemon card
│   │   │   ├── PokemonModal.tsx    # Detailed Pokemon view
│   │   │   ├── FavoritesGrid.tsx   # User favorites display
│   │   │   └── index.ts            # Barrel exports
│   │   ├── NotFound/      # 404 error page
│   │   └── index.ts       # Main component exports
│   ├── hooks/             # Custom React hooks
│   │   ├── helpers.ts     # API helper functions
│   │   ├── useInfinitePokemonList.ts  # Infinite scroll hook
│   │   ├── usePokemonByIds.ts         # Fetch Pokemon by IDs
│   │   ├── useSearchPokemon.ts        # Search functionality
│   │   └── index.ts       # Hook exports
│   ├── providers/         # React Context providers
│   │   ├── AuthContext.tsx      # Authentication state
│   │   ├── FavoritesContext.tsx # Favorites management
│   │   ├── QueryProvider.tsx    # React Query setup
│   │   └── index.ts             # Provider exports
│   ├── styles/            # Global styles and theming
│   │   ├── GlobalStyles.ts # Global CSS styles
│   │   ├── theme.ts        # Theme configuration
│   │   └── index.ts        # Style exports
│   ├── types/             # TypeScript type definitions
│   │   └── index.ts       # Type exports
│   ├── utils/             # Utility functions
│   │   └── pokemonClient.ts # API client configuration
│   ├── App.tsx            # Main app component with routing
│   └── index.tsx          # App entry point
├── .github/
│   └── workflows/
│       └── ci.yml         # GitHub Actions CI/CD pipeline
├── .husky/                # Git hooks configuration
├── tests/                 # Test configuration
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── vite.config.ts         # Vite build configuration
├── eslint.config.js       # ESLint configuration
└── README.md              # Project documentation
```

## 🧪 Testing

Comprehensive test suite with **100% passing tests**:

### Unit Tests (90/90 passing)
- **Authentication flows** - Login/signup validation and state management
- **Pokemon data handling** - API calls, data transformation, and error handling
- **Component interactions** - User interactions and UI state changes
- **Context providers** - State management and cross-component communication
- **Custom hooks** - Data fetching and business logic

### E2E Tests (100/100 passing)
- **Authentication system** - Complete signup/login flows across all browsers
- **Favorites functionality** - Add/remove favorites, persistence, modal interactions
- **Search & filtering** - Pokemon search, type filters, load more functionality
- **Cross-browser compatibility** - Chrome, Firefox, Safari, Mobile Chrome, Mobile Safari
- **Mobile responsiveness** - Touch interactions and mobile navigation

```bash
# Unit Tests
pnpm test         # Run all unit tests once
pnpm test:watch   # Run tests in watch mode
pnpm test:ui      # Run tests with Vitest UI
pnpm test:coverage # Run tests with coverage report

# E2E Tests  
pnpm test:e2e     # Run Playwright tests
pnpm test:e2e:ui  # Run E2E tests with UI
pnpm test:e2e:headed # Run E2E tests with visible browser

# Combined
pnpm test:all     # Run both unit and E2E tests
```

## 🚀 Deployment

The app is automatically deployed to GitHub Pages via GitHub Actions on every push to the main branch.

### CI/CD Pipeline

1. **Lint & Format** - Code quality checks with ESLint and Prettier
2. **Unit Tests** - Run all 90 unit tests with Vitest
3. **E2E Tests** - Run all 100 E2E tests with Playwright across multiple browsers
4. **Build** - Create optimized production build with Vite
5. **Deploy** - Deploy to GitHub Pages with proper SPA routing

### Manual Deployment Options

- **GitHub Pages** - Automatic deployment (currently configured)
- **Netlify** - Drag and drop the `dist` folder
- **Vercel** - Connect your Git repository

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests (`pnpm test`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Write tests for new features (both unit and E2E)
- Use conventional commit messages
- Ensure all tests pass before submitting (90 unit + 100 E2E tests)
- Test across multiple browsers and mobile viewports

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details.

---

**Built with ❤️ using React and TypeScript**
