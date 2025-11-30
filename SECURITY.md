# Security Policy

## Reporting a Vulnerability

**Do not** create a public GitHub issue for security vulnerabilities. Instead:

1. Email us at [security contact - to be added]
2. Include detailed description of the vulnerability
3. Provide steps to reproduce (if applicable)
4. Allow reasonable time for the team to respond and patch

## Security Best Practices

### For Users

- Keep all dependencies updated
- Use strong, unique passwords for database
- Enable HTTPS in production
- Rotate API keys regularly
- Use environment variables for secrets (never commit to git)
- Enable Docker security scanning

### For Developers

- Never commit credentials or secrets
- Use `.env` files for sensitive data
- Validate all user inputs
- Use parameterized queries for database
- Keep dependencies up to date
- Review dependency licenses
- Use CORS headers appropriately
- Implement rate limiting on APIs

## Dependencies Security

### Frontend
- Keep Next.js, React, and Tailwind updated
- Monitor Radix UI components for vulnerabilities
- Review Leaflet security advisories

### Backend
- Keep FastAPI and Uvicorn updated
- Monitor scikit-learn and XGBoost for CVEs
- Regularly update PostgreSQL
- Use PostGIS from official sources

## Deployment Security

### Production Checklist

- [ ] Change default database password
- [ ] Use environment variables for all secrets
- [ ] Enable HTTPS/TLS
- [ ] Set up firewall rules
- [ ] Enable database backups
- [ ] Configure CORS headers
- [ ] Enable request logging/monitoring
- [ ] Use API rate limiting
- [ ] Set up alerting for errors
- [ ] Regular security audits
- [ ] Update all dependencies

### Environment Setup

```env
# Never use defaults in production
DATABASE_PASSWORD=<strong-random-password>
API_KEY=<unique-api-key>
SECRET_KEY=<random-secret>
NODE_ENV=production
```

## Vulnerability Response

We take security seriously and will:

1. Acknowledge receipt within 48 hours
2. Assess the severity
3. Work on a fix
4. Release a patch
5. Credit the reporter (if desired)

## Security Headers

Recommended headers for production:
```
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
X-XSS-Protection: 1; mode=block
Content-Security-Policy: default-src 'self'
```

## Known Security Considerations

None currently. Report any discovered vulnerabilities responsibly.

## Updates

- Check GitHub security advisories regularly
- Subscribe to dependency security updates
- Review and apply patches promptly

Thank you for helping us keep LandGuard secure!
