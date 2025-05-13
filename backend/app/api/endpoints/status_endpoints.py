from fastapi import Security
from app.db.neo4j import neo4j_conn

def index():
    return {"msg": "server is running"}

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
    
    neo4j_conn.query(query_create)
    
    results = neo4j_conn.query(query_fetch)
    data = []
    for record in results:
        data.append({
            "user": dict(record["u"]),
            "account": dict(record["a"])
        })
    
    neo4j_conn.query(query_delete)
    
    return {
        "status": "Neo4j connection is working ✅",
        "data": data
    }