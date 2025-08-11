from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import models, database, routes
import os

# Créer l'application FastAPI
app = FastAPI(
    title="MonCandidat API",
    description="API pour la plateforme de candidatures MonCandidat",
    version="1.0.0"
)

# Configuration CORS - CORRECTION pour Docker
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En production, spécifiez les domaines
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"]
)

# Gestionnaire d'erreurs global
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    print(f"❌ Erreur globale: {exc}")
    return JSONResponse(
        status_code=500,
        content={"detail": f"Erreur interne: {str(exc)}"}
    )

# CORRECTION : Initialisation avec attente DB
@app.on_event("startup")
async def startup_event():
    print("🚀 Démarrage de l'application...")
    
    # Attendre que la base soit prête (important pour Docker)
    print("⏳ Attente de la base de données...")
    if not database.wait_for_db():
        print("❌ Impossible de se connecter à la base de données!")
        raise Exception("Base de données inaccessible")
    
    print("✅ Connexion à la base de données réussie!")
    
    # Créer les tables
    try:
        models.Base.metadata.create_all(bind=database.engine)
        print("✅ Tables créées/vérifiées avec succès!")
        
        # Créer des jobs de test si la table est vide
        await create_initial_jobs()
        
    except Exception as e:
        print(f"❌ Erreur lors de la création des tables: {e}")
        raise

async def create_initial_jobs():
    """Créer des jobs de test si aucun n'existe"""
    from database import SessionLocal
    import models
    
    db = SessionLocal()
    try:
        # Vérifier si des jobs existent
        existing_jobs_count = db.query(models.Job).count()
        if existing_jobs_count > 0:
            print(f"✅ {existing_jobs_count} jobs déjà présents")
            return
        
        # Créer les jobs de test
        jobs_data = [
            {
                "code": "dev-web",
                "title": "Développeur Web",
                "description": "Créez des applications web innovantes",
                "type": models.JobType.CDI,
                "salary": "35k - 50k €"
            },
            {
                "code": "data-analyst",
                "title": "Analyste de Données",
                "description": "Analysez et interprétez les données",
                "type": models.JobType.CDI,
                "salary": "40k - 55k €"
            },
            {
                "code": "ux-designer",
                "title": "UX Designer",
                "description": "Concevez des expériences utilisateur",
                "type": models.JobType.CDI,
                "salary": "38k - 52k €"
            },
            {
                "code": "ingenieur-reseau",
                "title": "Ingénieur Réseau",
                "description": "Gérez l'infrastructure réseau",
                "type": models.JobType.CDI,
                "salary": "42k - 58k €"
            },
            {
                "code": "stage-cloud",
                "title": "Stage Cloud",
                "description": "Découvrez les technologies cloud",
                "type": models.JobType.STAGE,
                "salary": "800€ - 1200€/mois"
            },
            {
                "code": "stage-dev",
                "title": "Stage Développement",
                "description": "Apprenez le développement logiciel",
                "type": models.JobType.STAGE,
                "salary": "700€ - 1000€/mois"
            }
        ]
        
        for job_data in jobs_data:
            job = models.Job(**job_data)
            db.add(job)
        
        db.commit()
        print(f"✅ {len(jobs_data)} jobs créés avec succès!")
        
    except Exception as e:
        print(f"❌ Erreur création jobs: {e}")
        db.rollback()
    finally:
        db.close()

# Inclure les routes API
app.include_router(routes.router, prefix="/api")

# Route racine pour vérification
@app.get("/")
async def read_root():
    return {
        "message": "MonCandidat API",
        "version": "1.0.0",
        "status": "running",
        "endpoints": {
            "health": "/api/health",
            "docs": "/docs",
            "jobs": "/api/jobs"
        }
    }

@app.get("/api")
async def api_root():
    return {
        "message": "MonCandidat API - Routes disponibles",
        "endpoints": [
            "GET /api/health",
            "POST /api/auth/signup",
            "POST /api/auth/signin", 
            "GET /api/jobs",
            "GET /api/jobs/{job_code}",
            "POST /api/applications",
            "GET /api/users/{user_id}/applications"
        ]
    }

if __name__ == "__main__":
    import uvicorn
    print("🚀 Démarrage du serveur de développement...")
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)