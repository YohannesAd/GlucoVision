# 🩺 GlucoVision Backend API

A professional, modern FastAPI backend for the GlucoVision diabetes management application.

## 🏗️ Architecture Overview

```
backend/
├── app/                    # Main application package
│   ├── api/               # API routes and endpoints
│   │   └── v1/           # API version 1
│   │       ├── auth.py   # Authentication endpoints
│   │       ├── users.py  # User management
│   │       ├── glucose.py # Glucose data management
│   │       ├── ai_insights.py # AI analysis endpoints
│   │       └── reports.py # PDF report generation
│   ├── core/             # Core application modules
│   │   ├── config.py     # Configuration management
│   │   ├── database.py   # Database connection & setup
│   │   └── security.py   # Authentication & security
│   ├── DatabaseModels/   # SQLAlchemy database models
│   │   ├── user.py       # User model
│   │   └── glucose_log.py # Glucose log model
│   ├── schemas/          # Pydantic schemas (API contracts)
│   │   ├── auth.py       # Authentication schemas
│   │   ├── user.py       # User schemas
│   │   └── glucose.py    # Glucose data schemas
│   ├── services/         # Business logic services
│   │   └── ai_service.py # AI/ML analysis service
│   └── main.py          # FastAPI application entry point
├── MlModels/            # AI/ML model storage (auto-created)
├── uploads/             # File upload storage (auto-created)
├── .env.example         # Environment configuration template
├── requirements.txt     # Python dependencies
├── run.py              # Development server launcher
└── test_api.py         # API testing utilities
```

## 🚀 Quick Start

### 1. Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your settings
nano .env
```

### 2. Install Dependencies

```bash
# Install Python dependencies
pip install -r requirements.txt
```

### 3. Run Development Server

```bash
# Start development server
python run.py

# Or with custom settings
python run.py --host 0.0.0.0 --port 8000
```

### 4. Access API Documentation

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **Health Check**: http://localhost:8000/health

## 🔧 Configuration

The application uses environment-based configuration through `.env` files:

### Key Settings

- `ENVIRONMENT`: development/staging/production
- `DATABASE_URL`: PostgreSQL connection string
- `USE_SQLITE`: Use SQLite for development (true/false)
- `SECRET_KEY`: JWT signing key (change in production!)
- `CORS_ORIGINS`: Allowed frontend origins

### Database Options

- **Development**: SQLite (default, no setup required)
- **Production**: PostgreSQL (recommended)

## 🔐 Security Features

- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: Bcrypt with salt
- **CORS Protection**: Configurable origin restrictions
- **Input Validation**: Pydantic schema validation
- **SQL Injection Protection**: SQLAlchemy ORM

## 🤖 AI/ML Features

- **Glucose Pattern Analysis**: Trend detection
- **Personalized Insights**: ML-based recommendations
- **Predictive Modeling**: Future glucose predictions
- **Risk Assessment**: Hypoglycemia/hyperglycemia alerts

## 📊 API Endpoints

### Authentication

- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/refresh` - Token refresh

### Glucose Management

- `GET /api/v1/glucose/logs` - Get glucose logs
- `POST /api/v1/glucose/logs` - Add glucose reading
- `DELETE /api/v1/glucose/logs/{id}` - Delete reading

### AI Insights

- `GET /api/v1/ai/insights` - Get AI analysis
- `GET /api/v1/ai/trends` - Get trend analysis
- `GET /api/v1/ai/recommendations` - Get recommendations

### Reports

- `GET /api/v1/reports/pdf` - Generate PDF report
- `GET /api/v1/reports/export` - Export data

## 🧪 Testing

```bash
# Run API tests
python test_api.py

# Run with pytest (if installed)
pytest
```

## 🚀 Production Deployment

### Environment Variables

```bash
ENVIRONMENT=production
DEBUG=false
SECRET_KEY=your-super-secure-production-key
DATABASE_URL=postgresql://user:pass@host:5432/glucovision
```

### Run Production Server

```bash
python run.py --prod --workers 4
```

## 📝 Development Notes

### Code Quality Standards

- **Type Hints**: All functions use Python type hints
- **Documentation**: Comprehensive docstrings
- **Error Handling**: Proper exception management
- **Logging**: Structured logging throughout
- **Testing**: Unit tests for all endpoints

### Database Migrations

```bash
# Generate migration
alembic revision --autogenerate -m "description"

# Apply migrations
alembic upgrade head
```

## 🤝 Contributing

1. Follow PEP 8 style guidelines
2. Add type hints to all functions
3. Write comprehensive docstrings
4. Include unit tests for new features
5. Update API documentation

## 📄 License

MIT License - See LICENSE file for details

---

**Built with**: FastAPI + PostgreSQL + SQLAlchemy + Scikit-learn
**For**: GlucoVision - Professional Diabetes Management
