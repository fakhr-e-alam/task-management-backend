README.md
Task Management API

A production-ready backend API built with FastAPI for managing users and tasks. The project demonstrates modern backend development practices including REST API design, modular architecture, Docker containerization, authentication, and cloud deployment.

Live Demo
Swagger API Documentation

https://task-management-backend-production-33ab.up.railway.app/docs

Features
User Authentication
JWT-based Authorization
Task CRUD Operations
FastAPI REST APIs
SQLAlchemy ORM
Pydantic Validation
Dockerized Backend
Railway Cloud Deployment
Modular Project Structure
Swagger/OpenAPI Documentation
CORS Configuration
Environment Variable Management
Tech Stack
Backend
Python
FastAPI
SQLAlchemy
Pydantic
JWT Authentication
Database
SQLite (current)
PostgreSQL ready
Deployment & DevOps
Docker
GitHub
Railway
Project Structure
src/
│
├── tasks/
│   ├── router.py
│   ├── controller.py
│   ├── models.py
│   └── dtos.py
│
├── users/
│   ├── router.py
│   ├── controller.py
│   ├── models.py
│   └── dtos.py
│
├── utils/
│   ├── db.py
│   ├── helpers.py
│   └── settings.py
│
└── main.py
API Endpoints
Authentication
Method	Endpoint	Description
POST	/auth/register	Register user
POST	/auth/login	User login
Tasks
Method	Endpoint	Description
GET	/tasks	Get all tasks
POST	/tasks	Create task
GET	/tasks/{id}	Get single task
PUT	/tasks/{id}	Update task
DELETE	/tasks/{id}	Delete task
Installation Guide
Clone Repository
git clone https://github.com/YOUR_USERNAME/task-management-backend.git
Create Virtual Environment
python -m venv venv
Activate Environment
Windows
venv\Scripts\activate
Linux/Mac
source venv/bin/activate
Install Dependencies
pip install -r requirements.txt
Run Locally
uvicorn src.main:app --reload
Docker Setup
Build Docker Image
docker build -t task-management-api .
Run Docker Container
docker run --env-file .env -p 10000:10000 task-management-api
Environment Variables

Create a .env file:

DB_CONNECTION=sqlite:///./test.db
SECRET_KEY=your_secret_key
ALGORITHM=HS256
EXP_TIME=30
Deployment

The backend is deployed live on Railway.

Deployment includes:

Dockerized setup
Environment variable configuration
Public API hosting
Swagger API documentation
Future Improvements
PostgreSQL Integration
Alembic Database Migrations
Role-based Authorization
Pagination & Filtering
Unit Testing
CI/CD Pipeline
Redis Caching
AWS Deployment
Author

Fakhre Alam

Backend Developer | Python | FastAPI | Docker | Cloud Deployment
