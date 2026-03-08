# Decode - Coding Challenge Platform

A full-stack coding challenge platform with anti-cheat monitoring, built with React, TypeScript, Express, and PostgreSQL.

## Features

- 🔐 Secure Authentication (JWT + bcrypt)
- 👨‍💼 Admin Dashboard - Create problems, view submissions
- 👨‍💻 User Interface - Solve coding challenges
- 🛡️ Anti-Cheat System - Detects tab switching and suspicious behavior
- 🗄️ PostgreSQL Database - Multi-user support
- 🚀 Production Ready - Deployed on Railway

## Default Admin Login

- Email: `milangupta980@gmail.com`
- Password: `ELYJwL48`

⚠️ Change these credentials after first login!

## Tech Stack

- Frontend: React 19, TypeScript, Tailwind CSS, Motion
- Backend: Node.js, Express, PostgreSQL
- Authentication: JWT, bcrypt
- Deployment: Railway

## Environment Variables

Required in Railway:
- `DATABASE_URL` - PostgreSQL connection (auto-set by Railway)
- `JWT_SECRET` - Random secret key for JWT tokens

## Deployment

This app is configured for Railway deployment:

1. Add PostgreSQL database in Railway
2. Set `JWT_SECRET` environment variable
3. Railway will automatically build and deploy

## API Endpoints

- `POST /api/login` - User login
- `POST /api/register` - User registration
- `GET /api/problems` - List all problems
- `POST /api/problems` - Create problem (admin)
- `POST /api/submit` - Submit solution
- `GET /api/admin/submissions/:problemId` - View submissions
- `POST /api/report-cheater` - Report cheating
- `GET /api/admin/cheaters/:problemId` - View cheaters
- `GET /api/health` - Health check

## License

Apache-2.0
