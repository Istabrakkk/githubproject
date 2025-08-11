from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn

app = FastAPI(title="MonCandidat Debug")

# CORS très permissif pour debug
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class UserTest(BaseModel):
    name: str
    email: str
    password: str
    phone: str = ""

@app.get("/api/health")
def health():
    return {"status": "OK", "message": "Serveur fonctionne!"}

@app.post("/api/auth/signup")
def signup_debug(user: UserTest):
    print(f"🔍 Reçu: {user}")
    try:
        # Simulation sans base de données
        return {
            "id": 1,
            "email": user.email,
            "full_name": user.name,
            "phone": user.phone
        }
    except Exception as e:
        print(f"❌ Erreur: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/auth/signin")
def signin_debug(credentials: dict):
    print(f"🔍 Connexion: {credentials}")
    return {
        "id": 1,
        "email": credentials.get("email"),
        "full_name": "Test User",
        "phone": "123456789"
    }

if __name__ == "__main__":
    print("🚀 Serveur Debug - Port 8000")
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)