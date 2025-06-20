# Contributing to SureGuard AI

Thank you for your interest in contributing to SureGuard AI! This document provides guidelines and information for contributors.

## 🤝 Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md).

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- Python 3.11+
- Docker and Docker Compose
- Git

### Development Setup

1. **Fork and Clone**
\`\`\`bash
git clone https://github.com/YOUR_USERNAME/sureguard-ai.git
cd sureguard-ai
\`\`\`

2. **Install Dependencies**
\`\`\`bash
npm install
cd services/ml-service && pip install -r requirements.txt
\`\`\`

3. **Environment Setup**
\`\`\`bash
cp .env.example .env.development
# Edit .env.development with your configuration
\`\`\`

4. **Start Development Environment**
\`\`\`bash
docker-compose -f docker-compose.dev.yml up -d
npm run dev
\`\`\`

## 📝 Development Guidelines

### Code Style

- **TypeScript**: Use strict mode
- **ESLint**: Follow Airbnb configuration
- **Prettier**: Auto-format on save
- **Naming**: Use camelCase for variables, PascalCase for components

### Commit Messages

We use [Conventional Commits](https://www.conventionalcommits.org/):

\`\`\`
type(scope): description

feat(auth): add multi-factor authentication
fix(api): resolve rate limiting issue
docs(readme): update installation instructions
\`\`\`

### Branch Naming

- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation updates
- `refactor/description` - Code refactoring

## 🧪 Testing

### Running Tests

\`\`\`bash
# All tests
npm test

# Specific service
npm run test:auth
npm run test:ml

# With coverage
npm run test:coverage

# Integration tests
npm run test:integration
\`\`\`

### Writing Tests

- Unit tests for all new functions
- Integration tests for API endpoints
- E2E tests for critical user flows

## 📋 Pull Request Process

1. **Create Feature Branch**
\`\`\`bash
git checkout -b feature/your-feature-name
\`\`\`

2. **Make Changes**
- Write code following our guidelines
- Add tests for new functionality
- Update documentation if needed

3. **Test Your Changes**
\`\`\`bash
npm test
npm run lint
npm run type-check
\`\`\`

4. **Commit Changes**
\`\`\`bash
git add .
git commit -m "feat: add your feature description"
\`\`\`

5. **Push and Create PR**
\`\`\`bash
git push origin feature/your-feature-name
\`\`\`

### PR Requirements

- [ ] All tests pass
- [ ] Code follows style guidelines
- [ ] Documentation updated
- [ ] No merge conflicts
- [ ] Descriptive PR title and description

## 🐛 Bug Reports

### Before Submitting

1. Check existing issues
2. Try latest version
3. Reproduce the bug

### Bug Report Template

\`\`\`markdown
**Describe the bug**
A clear description of the bug.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
- OS: [e.g. iOS]
- Browser [e.g. chrome, safari]
- Version [e.g. 22]

**Additional context**
Any other context about the problem.
\`\`\`

## 💡 Feature Requests

### Feature Request Template

\`\`\`markdown
**Is your feature request related to a problem?**
A clear description of the problem.

**Describe the solution you'd like**
A clear description of what you want to happen.

**Describe alternatives you've considered**
Alternative solutions or features you've considered.

**Additional context**
Any other context or screenshots about the feature request.
\`\`\`

## 🏗️ Architecture Contributions

### Adding New Services

1. Create service directory in `services/`
2. Follow existing service structure
3. Add Dockerfile and package.json
4. Update docker-compose.yml
5. Add Kubernetes manifests
6. Update documentation

### Database Changes

1. Create migration script
2. Update schema documentation
3. Test migration thoroughly
4. Consider backward compatibility

## 📚 Documentation

### Types of Documentation

- **API Documentation**: OpenAPI/Swagger specs
- **Code Documentation**: JSDoc comments
- **User Documentation**: Markdown files
- **Architecture Documentation**: Diagrams and explanations

### Documentation Standards

- Clear, concise language
- Code examples for APIs
- Screenshots for UI features
- Keep documentation up-to-date

## 🔒 Security

### Reporting Security Issues

**DO NOT** create public issues for security vulnerabilities.

Email security@sureguard.ai with:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

### Security Guidelines

- Never commit secrets or credentials
- Use environment variables for configuration
- Follow OWASP security practices
- Validate all inputs
- Use parameterized queries

## 🎯 Areas for Contribution

### High Priority

- [ ] Machine learning model improvements
- [ ] Real-time processing optimization
- [ ] API performance enhancements
- [ ] Security hardening
- [ ] Documentation improvements

### Good First Issues

- [ ] UI/UX improvements
- [ ] Test coverage increase
- [ ] Code refactoring
- [ ] Documentation updates
- [ ] Bug fixes

## 🏆 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Annual contributor report
- SureGuard AI website (with permission)

## 📞 Getting Help

### Communication Channels

- **GitHub Discussions**: General questions and ideas
- **Discord**: Real-time chat with maintainers
- **Email**: Direct contact for sensitive issues

### Maintainer Response Times

- **Issues**: 2-3 business days
- **Pull Requests**: 3-5 business days
- **Security Issues**: 24 hours

## 📋 Checklist for Maintainers

### PR Review Process

- [ ] Code quality and style
- [ ] Test coverage
- [ ] Documentation updates
- [ ] Breaking changes noted
- [ ] Performance impact assessed
- [ ] Security implications reviewed

### Release Process

- [ ] Version bump
- [ ] Changelog updated
- [ ] Tests passing
- [ ] Documentation updated
- [ ] Security scan completed
- [ ] Performance benchmarks run

Thank you for contributing to SureGuard AI! 🚀

