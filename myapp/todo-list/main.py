from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

from typing import Optional
# from pythonmongo import MongoClient
from pymongo import MongoClient
from bson import ObjectId
import os

# Connect to MongoDB
MONGO_URI= "mongodb://localhost:27017/"
client = MongoClient(MONGO_URI)
db = client["todo_db"]
collection = db["todos"]

app = FastAPI()

origins = [
    "http://localhost:3000",  # React frontend
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"],
)


class TodoItem(BaseModel):
    task: str
    completed: bool = False
    # user_id: Optional[str] = None
    # Optional field for user ID
    # user_id: str = None  # Optional field for user ID
    
#Helper function to convert ObjectId to string
def todo_serialize(todo)-> dict:
    return {
        "id": str(todo["_id"]),
        "task":todo["task"],
        "completed": todo["completed"]
    }
    
########## Routes #########
@app.get("/")
def root():
    return {"message": "Welcome to the FastAPI Todo API"}

@app.get("/todos")
def get_todos():
    todos= list(collection.find())
    return [todo_serialize(todo) for todo in todos]


############## add to todo item ##################   
@app.post("/add_todo")
def add_todo(item: TodoItem):
    result = collection.insert_one(item.dict())
    new_result = collection.find_one({"_id": result.inserted_id})
    if new_result:
        return todo_serialize(new_result)
    else:
        raise HTTPException(status_code=500, detail="Failed to insert todo")
    
########## Update        
@app.put("/update_todo/{todo_id}")
def update_todo(todo_id: str, item: TodoItem):
    result= collection.find_one_and_update({"_id": ObjectId(todo_id)},
                                           {"$set": item.dict()}, 
                                           return_document=True
                                        )
    if result:  
        status_code = 200
        message= "Todo updated successfully"
        return todo_serialize(result),status_code, message
    
    else:
        raise HTTPException(status_code=404, detail="Todo not found")
    
# delete todo    
@app.delete("/delete_todo/{todo_id}")
def delete_todo(todo_id: str):
    result= collection.find_one_and_delete({"_id":ObjectId(todo_id)})
    if result:
        status_code = 200
        message= "Todo deleted successfully"
        return todo_serialize(result),status_code, message
    raise HTTPException(status_code=404, detail="Todo not found")


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)