from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from app.api.routes import (
    model_routes,
    model1_routes
)
from app.api.endpoints.model_endpoints import (
    load_models,
    get_available_models, 
    activate_model,
    predict_endpoint,
    retrain_model
)
from app.api.endpoints.status_endpoints import index, test_neo4j_connection

app = FastAPI()

origins = [
    "http://localhost:5173",
    "http://ec2-13-127-98-0.ap-south-1.compute.amazonaws.com",
    "*",  
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(model_routes.router)
app.include_router(model1_routes.router)

app.on_event("startup")(load_models)

app.post("/fastapi/retrain-model")(retrain_model)
app.get("/fastapi/available-models")(get_available_models)
app.post("/fastapi/activate-model")(activate_model)
app.post("/fastapi/predict/{model_key}")(predict_endpoint)

app.get("/fastapi", tags=["Status"])(index)
app.get("/fastapi/graph")(test_neo4j_connection)

if __name__ == "__main__":
    uvicorn.run("main:app", host="localhost", port=8000, reload=True)