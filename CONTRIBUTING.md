# Contributing to LandGuard Dashboard

Thank you for your interest in contributing to LandGuard Dashboard! We welcome contributions from the community.

## Code of Conduct

Be respectful and constructive in all interactions. We are committed to providing a welcoming and inclusive environment for all contributors.

## How to Contribute

### Reporting Bugs

1. **Check existing issues** first to avoid duplicates
2. **Create a detailed issue** including:
   - Clear description of the bug
   - Steps to reproduce
   - Expected vs actual behavior
   - Error messages/logs
   - System information (OS, Node version, Python version)
   - Screenshots if applicable

### Suggesting Features

1. **Check existing discussions** and issues
2. **Create an issue** with the `enhancement` label including:
   - Clear description of the feature
   - Use cases and benefits
   - Possible implementation approach (optional)

### Submitting Code Changes

#### Setup Development Environment

1. **Fork the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/hack.git
   cd hack
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Install dependencies**
   ```bash
   # Frontend
   cd frontend && pnpm install

   # Backend
   cd gdg_hackthon && python -m venv venv
   source venv/bin/activate  # or venv\Scripts\activate on Windows
   pip install -r requirements.txt
   ```

4. **Make your changes**
   - Follow the code style of the project
   - Write clear, descriptive commit messages
   - Add tests for new features
   - Update documentation as needed

5. **Test your changes**
   ```bash
   # Frontend
   cd frontend
   pnpm lint
   pnpm build

   # Backend
   cd gdg_hackthon
   pytest -q
   ```

6. **Commit and push**
   ```bash
   git add .
   git commit -m "feat: add new feature description"
   git push origin feature/your-feature-name
   ```

7. **Create a Pull Request**
   - Use a clear title describing your changes
   - Reference related issues with `Fixes #issue-number`
   - Include description of changes and why they are needed
   - Ensure all checks pass

## Code Style Guidelines

### TypeScript/React
- Use functional components with hooks
- Use TypeScript for type safety
- Follow ESLint configuration
- Use Tailwind CSS for styling
- Keep components focused and reusable

### Python
- Follow PEP 8 guidelines
- Use type hints
- Write docstrings for functions/classes
- Use meaningful variable names
- Keep functions focused and testable

### Git Commits
```
<type>(<scope>): <subject>

<body>

<footer>
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`

Example:
```
feat(map): add hexagon filtering by risk score

Added UI controls to filter hexagons by minimum risk score.
Also updated the API to support risk_min_score query parameter.

Fixes #123
```

## Pull Request Process

1. **Ensure your PR**:
   - Has a clear title and description
   - References related issues
   - Contains no merge conflicts
   - Passes all automated checks
   - Includes tests for new functionality
   - Updates documentation

2. **Wait for review**:
   - Maintainers will review your code
   - Address feedback promptly
   - Request re-review after making changes

3. **Merge**:
   - Maintainers will merge once approved
   - Delete your feature branch after merge

## Testing

### Frontend Tests
```bash
cd frontend
pnpm test
```

### Backend Tests
```bash
cd gdg_hackthon
pytest tests/ -v
pytest tests/test_api.py::test_predict_single
```

Write tests for:
- New features
- Bug fixes
- Edge cases
- API endpoints

## Documentation

- Update README.md for major features
- Add inline code comments for complex logic
- Update DATA_ANALYSIS.md if changing data schema
- Add docstrings to functions

## Performance Considerations

- Optimize database queries with proper indexing
- Use Leaflet layer groups efficiently
- Cache API responses where appropriate
- Minimize bundle size (use code splitting)
- Monitor API response times

## Security

- Never commit secrets or credentials
- Validate all user input
- Use parameterized queries for database
- Keep dependencies updated
- Report security vulnerabilities privately

## Questions?

- Open a discussion issue
- Check existing documentation
- Ask in pull request comments
- Contact maintainers

## Recognition

Contributors who have merged PRs will be:
- Added to contributors list in README
- Recognized in release notes for major contributions

Thank you for contributing! 🎉
