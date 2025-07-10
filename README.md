# What Do ATX 🤘

**A web app that knows what you like to do, when you are free, and what you should be doing in ATX.**

Smart event discovery for Austin with AI-powered recommendations, calendar integration, and personalized suggestions.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL (for backend)
- Git

### Local Development

```bash
# Clone and setup
git clone https://github.com/mloesche/what_do_atx.git
cd what_do_atx

# Install dependencies
npm install
cd backend && npm install && cd ..

# Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the app.

## 🏗️ Architecture

- **Frontend**: Next.js 15 + TailwindCSS + TypeScript (Vercel)
- **Backend**: Node.js + Express + PostgreSQL (Render) 
- **Database**: PostgreSQL with PostGIS + pgvector extensions
- **AI**: OpenAI integration for smart recommendations
- **Events**: Do512, Eventbrite API integration

## 📁 Project Structure

```
what_do_atx/
├── src/                    # Frontend source
│   ├── app/               # Next.js app directory
│   └── lib/               # Shared utilities
├── backend/               # Backend API services
├── docs/                  # Comprehensive documentation
├── scripts/               # Build and deployment scripts
└── public/                # Static assets
```

## 📚 Documentation

Our documentation covers everything you need:

- **[🚀 Deployment Guide](docs/DEPLOYMENT_GUIDE.md)** - Complete Vercel + Render deployment
- **[⚙️ Environment Setup](docs/ENVIRONMENT_SETUP.md)** - Environment variables configuration  
- **[🐳 Docker Setup](docs/DOCKER_SETUP.md)** - Local development with Docker
- **[🔄 Rollback Procedures](docs/ROLLBACK_PROCEDURES.md)** - Emergency rollback strategies

## 🛠️ Development

### Available Scripts

```bash
# Frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run linting
npm run type-check   # TypeScript checking

# Backend  
cd backend
npm start           # Start backend server
npm run dev         # Start with nodemon
npm test           # Run tests
```

### Environment Variables

Copy `.env.example` to `.env.local` and configure:

```bash
cp .env.example .env.local
```

See [Environment Setup Guide](docs/ENVIRONMENT_SETUP.md) for detailed configuration.

## 🌟 Features

- **🎯 Smart Discovery**: AI-powered event recommendations
- **📅 Calendar Integration**: Find events when you're free  
- **🗺️ Location-Aware**: Austin-focused with geographic search
- **🤖 Personalization**: Learn your preferences over time
- **📱 Responsive**: Works great on all devices

## 🚀 Deployment

### Production Deployment
- **Frontend**: Auto-deployed to Vercel on main branch pushes
- **Backend**: Auto-deployed to Render with Docker containers
- **Database**: Managed PostgreSQL on Render

See our [Deployment Guide](docs/DEPLOYMENT_GUIDE.md) for step-by-step instructions.

### CI/CD Pipeline
- GitHub Actions for automated testing and deployment
- Branch protection rules on main
- Automated health checks and rollback capabilities

## 🧪 Testing

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Backend tests
cd backend && npm test
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🆘 Need Help?

- **Documentation**: Check the [docs/](docs/) directory
- **Issues**: Open a [GitHub issue](https://github.com/mloesche/what_do_atx/issues)
- **Deployment Problems**: See [Rollback Procedures](docs/ROLLBACK_PROCEDURES.md)

---

Made with ❤️ in Austin, Texas 
