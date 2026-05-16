from fastapi import APIRouter, Depends, status, HTTPException
from src.utils.db import get_db
from src.tasks import controller
from src.tasks.dtos import TaskSchema, TaskResponseSchema
from typing import List
from sqlalchemy.orm import Session
from src.utils.helpers import is_authenticated
from src.users.models import UserModel

task_router = APIRouter(prefix="/tasks", tags=["Tasks"])

# ------------------------
# Create Task
# ------------------------
@task_router.post(
    "/create", 
    response_model=TaskResponseSchema, 
    status_code=status.HTTP_201_CREATED
)
def create_task(
    body: TaskSchema,
    db: Session = Depends(get_db),
    user: UserModel = Depends(is_authenticated)
):
    """
    Create a new task for the logged-in user.
    """
    return controller.create_task(body, db, user)


# ------------------------
# Get All Tasks (of current user)
# ------------------------
@task_router.get(
    "/all_tasks", 
    response_model=List[TaskResponseSchema], 
    status_code=status.HTTP_200_OK
)
def get_all_tasks(
    db: Session = Depends(get_db),
    user: UserModel = Depends(is_authenticated)
):
    """
    Return all tasks belonging to the logged-in user.
    """
    # Filter tasks by user_id to avoid returning other users' tasks
    return controller.get_tasks(db, user)


# ------------------------
# Get Single Task
# ------------------------
@task_router.get(
    "/one_task/{task_id}", 
    response_model=TaskResponseSchema, 
    status_code=status.HTTP_200_OK
)
def get_one_task(
    task_id: int,
    db: Session = Depends(get_db),
    user: UserModel = Depends(is_authenticated)
):
    """
    Return a single task by ID (must belong to logged-in user).
    """
    task = controller.get_task_by_id(task_id, db)
    if task.user_id != user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to access this task."
        )
    return task


# ------------------------
# Update Task
# ------------------------
@task_router.put(
    "/update_task/{task_id}", 
    response_model=TaskResponseSchema, 
    status_code=status.HTTP_200_OK
)
def update_task(
    task_id: int,
    body: TaskSchema,
    db: Session = Depends(get_db),
    user: UserModel = Depends(is_authenticated)
):
    """
    Update a task (must belong to logged-in user).
    """
    task = controller.get_task_by_id(task_id, db)
    if task.user_id != user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to update this task."
        )
    return controller.update_task(task_id, body, db,user)


# ------------------------
# Delete Task
# ------------------------
@task_router.delete(
    "/delete_task/{task_id}",
    response_model=None,
    status_code=status.HTTP_204_NO_CONTENT
)
def delete_task(
    task_id: int,
    db: Session = Depends(get_db),
    user: UserModel = Depends(is_authenticated)
):
    """
    Delete a task (must belong to logged-in user).
    """
    task = controller.get_task_by_id(task_id, db)
    if task.user_id != user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to delete this task."
        )
    return controller.delete_task(task_id, db,user)