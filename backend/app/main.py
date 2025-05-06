from fastapi import FastAPI, Security
from app.api.dependencies import get_current_user
from fastapi.middleware.cors import CORSMiddleware

from app.models.models import User
import uvicorn
from app.api.routes import (
    user_routes,
    account_routes,
    device_routes,
    location_routes,
    transaction_routes,
    risk_assessment_routes,
    transaction_metrics_routes,
    fraud_details_routes,
    auth_routes,
    model_routes
)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with ["http://localhost:5173"] in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(user_routes.router)
app.include_router(account_routes.router)
app.include_router(device_routes.router)
app.include_router(location_routes.router)
app.include_router(transaction_routes.router)
app.include_router(risk_assessment_routes.router)
app.include_router(fraud_details_routes.router)
app.include_router(transaction_metrics_routes.router)
app.include_router(auth_routes.router)
app.include_router(model_routes.router)


@app.get("/", tags=["Status"])
def index(current_user: User = Security(get_current_user, scopes=[])):
    return {"msg": "server is running"}


# if __name__ == "__main__":
#     uvicorn.run("app.main:app", host="localhost", port=8000, reload=True)
