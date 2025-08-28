from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
from pymongo import MongoClient
from bson import ObjectId

# ------------------ Database Setup ------------------
MONGO_URI = "mongodb://localhost:27017/"
client = MongoClient(MONGO_URI)
db = client["todo_db"]
collection = db["todos"]

# ------------------ FastAPI App ------------------
app = FastAPI()

# CORS middleware for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For dev, allow all. Restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------ Models ------------------
class TaskCreate(BaseModel):
    title: str

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    completed: Optional[bool] = None

class TaskBulk(BaseModel):
    task_ids: List[str]
    action: str  # "delete" or "update"
    title: Optional[str] = None
    completed: Optional[bool] = None

# ------------------ Helper ------------------

def to_task_out(doc: dict) -> dict:
    return {
        "id": str(doc["_id"]),
        "title": doc.get("task", ""),
        "completed": bool(doc.get("completed", False)),
    }

# ------------------ Endpoints ------------------

# Get all tasks
@app.get("/tasks")
def list_tasks():
    docs = list(collection.find())
    return [to_task_out(d) for d in docs]

# Create a new task
@app.post("/tasks")
def create_task(payload: TaskCreate):
    to_insert = {"task": payload.title, "completed": False}
    result = collection.insert_one(to_insert)
    created = collection.find_one({"_id": result.inserted_id})
    if not created:
        raise HTTPException(status_code=500, detail="Failed to create task")
    return to_task_out(created)

# Update a single task by ID
@app.put("/tasks/{task_id}")
def update_task(task_id: str, payload: TaskUpdate):
    updates = {}
    if payload.title is not None:
        updates["task"] = payload.title
    if payload.completed is not None:
        updates["completed"] = payload.completed

    if not updates:
        raise HTTPException(status_code=400, detail="No fields to update")

    updated = collection.find_one_and_update(
        {"_id": ObjectId(task_id)},
        {"$set": updates},
        return_document=True
    )
    if not updated:
        raise HTTPException(status_code=404, detail="Task not found")
    return to_task_out(updated)

# Delete a single task by ID
from bson.errors import InvalidId
@app.delete("/tasks/{task_id}")
def delete_task(task_id: str):
    try:
        object_id = ObjectId(task_id.strip())
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid task_id format")

    result = collection.delete_one({"_id": object_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Task not found")
    return {"message": f"Task {task_id} deleted successfully."}


# Bulk delete or update tasks
@app.post("/tasks/bulk")
def bulk_delete_or_update(payload: TaskBulk):
    object_ids = []
    for tid in payload.task_ids:
        try:
            object_ids.append(ObjectId(tid))
        except InvalidId:
            raise HTTPException(status_code=400, detail=f"Invalid task_id format: {tid}")

    if payload.action.lower() == "delete":
        result = collection.delete_many({"_id": {"$in": object_ids}})
        return {"message": f"{result.deleted_count} task(s) deleted successfully."}

    elif payload.action.lower() == "update":
        update_data = {}
        if payload.title is not None:
            update_data["task"] = payload.title
        if payload.completed is not None:
            update_data["completed"] = payload.completed

        if not update_data:
            raise HTTPException(status_code=400, detail="No fields to update")

        result = collection.update_many({"_id": {"$in": object_ids}}, {"$set": update_data})
        return {"message": f"{result.modified_count} task(s) updated successfully."}

    else:
        raise HTTPException(status_code=400, detail="Invalid action. Use 'delete' or 'update'")

# ------------------ Run Server ------------------
# Run using: uvicorn main:app --reload
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
