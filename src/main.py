# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware

# from src.tasks.router import task_router
# from src.users.router import user_routes

# app = FastAPI(title="Task Management App")

# # ✅ CORS FIX (ADD THIS)
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=[
#         "http://localhost:5173",
#         "http://127.0.0.1:5173"
#     ],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # routers
# app.include_router(task_router)
# # app.include_router(user_routes)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.tasks.router import task_router
from src.users.router import user_routes

app = FastAPI(
    title="Task Management App",
    version="1.0.0"
)

# Root Route
@app.get("/")
def home():
    return {
        "message": "Task Management API is running successfully"
    }

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(task_router)
app.include_router(user_routes)