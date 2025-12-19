# PokéFlix - Netflix Style Pokemon Interface

A modern, responsive Pokemon viewing application built with React, TypeScript, and styled-components. Features a Netflix-inspired interface for browsing, searching, and managing your favorite Pokemon.

## 🚀 Features

### Core Functionality

- **Authentication System**: Fake login with localStorage persistence
- **Pokemon Grid**: Browse Pokemon with infinite scroll and search
- **Advanced Filtering**: Filter by Pokemon types (Fire, Water, Grass, etc.)
- **Detailed Views**: Modal with comprehensive Pokemon information
- **Favorites System**: Add/remove Pokemon from your personal list
- **Responsive Design**: Mobile-first approach with tablet and desktop support

### Technical Features

- **Modern Stack**: React 19, TypeScript, Vite, styled-components
- **API Integration**: Direct integration with PokéAPI
- **Performance**: Lazy loading, image optimization, and caching
- **Testing**: Unit tests with Vitest and React Testing Library
- **Production Ready**: TypeScript strict mode, ESLint, error handling

## 🎨 Design

The application follows Netflix's design principles:

- **Fixed Header/Footer**: Always visible navigation and branding
- **Full Height Layout**: Utilizes entire viewport height
- **Dark Theme**: Netflix-inspired color scheme
- **Smooth Animations**: Hover effects and transitions
- **Mobile Responsive**: Optimized for all screen sizes

## 🛠️ Technology Stack

- **Frontend**: React 19 with TypeScript
- **Styling**: styled-components with theme system
- **Build Tool**: Vite for fast development and building
- **Testing**: Vitest + React Testing Library + jsdom
- **API**: PokéAPI for Pokemon data
- **State Management**: React Context API
- **Storage**: localStorage for persistence

## 📦 Installation

```bash
# Clone the repository
git clone <repository-url>
cd pokemon-netflix

# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Run tests
pnpm test

# Preview production build
pnpm preview
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

### Component Structure

```
src/
├── components/
│   ├── Auth/           # Login components
│   ├── Layout/         # Header, Footer, Layout
│   └── Pokemon/        # Pokemon-related components
├── contexts/           # React Context providers
├── services/           # API services
├── styles/             # Theme and global styles
├── types/              # TypeScript type definitions
└── test/               # Test setup and utilities
```

### Key Components

- **App**: Main application with providers and routing
- **Layout**: Fixed header/footer with responsive content area
- **PokemonGrid**: Infinite scroll grid with search and filters
- **PokemonCard**: Individual Pokemon display with favorites
- **PokemonModal**: Detailed Pokemon information overlay
- **Login**: Authentication form with validation

### State Management

- **AuthContext**: User authentication and session management
- **FavoritesContext**: Pokemon favorites with localStorage sync
- **Local State**: Component-specific state with React hooks

## 🎯 Requirements Fulfilled

### Minimum Viable Product

- ✅ Basic login page with fake user storage
- ✅ Homepage displaying Pokemon with search/filter
- ✅ Detailed Pokemon view in modal
- ✅ Favorites system with localStorage

### Visual Requirements

- ✅ Full height UI layout
- ✅ Fixed header always on top
- ✅ Fixed footer always on bottom
- ✅ Content sandwiched in middle
- ✅ Mobile friendly (no pinch/zoom needed)

### Technical Requirements

- ✅ React implementation
- ✅ Modern styling with styled-components
- ✅ Modern browser support (flexbox/grid)
- ✅ Unit tests included
- ✅ Production ready build
- ✅ Static type checking with TypeScript
- ✅ PokéAPI integration

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
