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
- **User-specific Storage**: Favorites saved per user account
- **Persistent Data**: Favorites preserved across sessions

### 🎨 User Experience

- **Netflix-inspired UI**: Dark theme with familiar streaming design
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Smooth Animations**: Polished hover effects and transitions
- **Loading States**: Skeleton screens and loading indicators
- **Error Handling**: Graceful error management and user feedback

## 🛠️ Tech Stack

### Frontend Framework

- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development with strict mode
- **React Router 7** - Client-side routing with protected routes
- **styled-components 6** - CSS-in-JS with theme support

### State Management & Data

- **React Query 5** - Server state management and caching
- **React Context** - Client state for auth and favorites
- **localStorage** - Persistent user data storage

### Development Tools

- **Vite 7** - Fast build tool and dev server
- **ESLint 9** - Code linting with TypeScript rules
- **Prettier** - Code formatting
- **Husky** - Git hooks for code quality
- **lint-staged** - Pre-commit linting

### Testing

- **Vitest** - Unit testing framework
- **React Testing Library** - Component testing utilities
- **jsdom** - DOM environment for tests
- **35 unit tests** - Comprehensive test coverage

### API & External Services

- **PokéAPI** - RESTful Pokemon data API
- **pokenode-ts** - TypeScript Pokemon API client
- **Axios** - HTTP client for API requests

### Deployment & CI/CD

- **GitHub Actions** - Automated CI/CD pipeline
- **GitHub Pages** - Static site hosting
- **pnpm** - Fast, disk space efficient package manager

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+** - JavaScript runtime
- **pnpm** (recommended) or npm - Package manager

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

```bash
# Development
pnpm dev          # Start dev server at localhost:5173
pnpm build        # Build for production
pnpm preview      # Preview production build

# Code Quality
pnpm lint         # Run ESLint checks
pnpm lint:fix     # Auto-fix ESLint issues
pnpm format       # Format code with Prettier
pnpm format:check # Check code formatting

# Testing
pnpm test         # Run all tests once
pnpm test:watch   # Run tests in watch mode
pnpm test:ui      # Run tests with Vitest UI

# Git Hooks
pnpm prepare      # Setup Husky git hooks
```

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

Comprehensive test suite with **35 unit tests** covering:

- **Authentication flows** - Login/signup validation and state management
- **Pokemon data handling** - API calls, data transformation, and error handling
- **Component interactions** - User interactions and UI state changes

```bash
# Run tests once
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with UI
pnpm test:ui
```

## 🚀 Deployment

The app is automatically deployed to GitHub Pages via GitHub Actions on every push to the main branch.

### CI/CD Pipeline

1. **Lint & Format** - Code quality checks with ESLint and Prettier
2. **Test** - Run all unit tests with Vitest
3. **Build** - Create optimized production build with Vite
4. **Deploy** - Deploy to GitHub Pages with proper SPA routing

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
- Write tests for new features
- Use conventional commit messages
- Ensure all tests pass before submitting

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details.

---

**Built with ❤️ using React and TypeScript**
