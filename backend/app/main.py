from fastapi import FastAPI, Security
from app.api.dependencies import get_current_user
from fastapi.middleware.cors import CORSMiddleware

from app.models.models import User
from app.db.neo4j import neo4j_conn

from app.api.routes import (
    user_routes,
    transaction_routes,
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
# app.include_router(transaction_metrics_routes.router)
# app.include_router(account_routes.router)
# app.include_router(device_routes.router)
# app.include_router(location_routes.router)
# app.include_router(risk_assessment_routes.router)
# app.include_router(fraud_details_routes.router)
app.include_router(auth_routes.router)
app.include_router(user_routes.router)
app.include_router(model_routes.router)
app.include_router(transaction_routes.router)


@app.get("/", tags=["Status"])
def index(current_user: User = Security(get_current_user, scopes=[])):
    return {"msg": "server is running"}


@app.get("/graph")
def test_neo4j_connection():
    query_create = """
    MERGE (u:User {user_id: 1, name: 'Test User'})
    MERGE (a:Account {account_id: 101, balance: 1000})
    MERGE (u)-[:HAS_ACCOUNT]->(a)
    """
    query_fetch = """
    MATCH (u:User {user_id: 1})-[:HAS_ACCOUNT]->(a:Account)
    RETURN u, a
    """
    query_delete = """
    MATCH (u:User {user_id: 1})-[:HAS_ACCOUNT]->(a:Account)
    DETACH DELETE u, a
    """
    
    # Create dummy data
    neo4j_conn.query(query_create)

    # Fetch the data
    results = neo4j_conn.query(query_fetch)
    data = []
    for record in results:
        data.append({
            "user": dict(record["u"]),
            "account": dict(record["a"])
        })

    # Clean up
    neo4j_conn.query(query_delete)

    return {
        "status": "Neo4j connection is working ✅",
        "data": data
    }

# if __name__ == "__main__":
#     uvicorn.run("app.main:app", host="localhost", port=8000, reload=True)
