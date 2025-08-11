from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import SessionLocal
import crud, schemas
import traceback

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/health")
def health_check():
    return {"status": "OK", "message": "API fonctionnelle"}

@router.post("/auth/signup")
def sign_up(user_data: schemas.UserSignUp, db: Session = Depends(get_db)):
    try:
        print(f"📝 Inscription: {user_data.email}")
        
        # Vérifier utilisateur existant
        existing_user = crud.get_user_by_email(db, user_data.email)
        if existing_user:
            raise HTTPException(
                status_code=400,
                detail="Utilisateur déjà existant"
            )
        
        # Créer utilisateur
        new_user = crud.create_user(db, user_data)
        
        # Retour JSON explicite
        result = {
            "id": new_user.id,
            "email": new_user.email,
            "full_name": new_user.full_name,
            "phone": new_user.phone
        }
        print(f"✅ Utilisateur créé: {result}")
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        error_msg = f"Erreur inscription: {str(e)}"
        print(f"❌ {error_msg}")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=error_msg)

@router.post("/auth/signin")
def sign_in(user_data: schemas.UserSignIn, db: Session = Depends(get_db)):
    try:
        print(f"🔐 Tentative de connexion: {user_data.email}")
        
        # Authentifier l'utilisateur
        user = crud.authenticate_user(db, user_data.email, user_data.password)
        if not user:
            raise HTTPException(
                status_code=401,
                detail="Email ou mot de passe incorrect"
            )
        
        result = {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "phone": user.phone
        }
        print(f"✅ Connexion réussie: {user.email}")
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        error_msg = f"Erreur connexion: {str(e)}"
        print(f"❌ {error_msg}")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=error_msg)

@router.get("/jobs")
def get_jobs(db: Session = Depends(get_db)):
    try:
        print("📋 Récupération des jobs...")
        jobs = crud.get_jobs(db)
        
        # Convertir en format dict pour le frontend
        jobs_list = []
        for job in jobs:
            jobs_list.append({
                "id": job.id,
                "code": job.code,
                "title": job.title,
                "description": job.description,
                "type": job.type.value if hasattr(job.type, 'value') else str(job.type),
                "salary": job.salary
            })
        
        print(f"✅ {len(jobs_list)} jobs trouvés")
        return jobs_list
    except Exception as e:
        error_msg = f"Erreur récupération jobs: {str(e)}"
        print(f"❌ {error_msg}")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=error_msg)

@router.get("/jobs/{job_code}")
def get_job(job_code: str, db: Session = Depends(get_db)):
    try:
        print(f"🔍 Récupération job: {job_code}")
        job = crud.get_job_by_code(db, job_code)
        if not job:
            raise HTTPException(status_code=404, detail="Job non trouvé")
        
        result = {
            "id": job.id,
            "code": job.code,
            "title": job.title,
            "description": job.description,
            "type": job.type.value if hasattr(job.type, 'value') else str(job.type),
            "salary": job.salary
        }
        return result
    except HTTPException:
        raise
    except Exception as e:
        error_msg = f"Erreur récupération job: {str(e)}"
        print(f"❌ {error_msg}")
        raise HTTPException(status_code=500, detail=error_msg)

@router.post("/applications")
def create_application(application_data: schemas.ApplicationCreate, db: Session = Depends(get_db)):
    try:
        print(f"📝 Création candidature: {application_data.userId} -> {application_data.jobCode}")
        
        # Créer la candidature
        new_application = crud.create_application(db, application_data)
        if not new_application:
            raise HTTPException(
                status_code=400,
                detail="Erreur lors de la création de la candidature"
            )
        
        result = {
            "id": new_application.id,
            "message": "Candidature créée avec succès",
            "compatibility_score": new_application.compatibility_score,
            "status": new_application.status.value if hasattr(new_application.status, 'value') else str(new_application.status)
        }
        
        print(f"✅ Candidature créée: {new_application.id}")
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        error_msg = f"Erreur création candidature: {str(e)}"
        print(f"❌ {error_msg}")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=error_msg)

@router.get("/users/{user_id}/applications")
def get_user_applications(user_id: int, db: Session = Depends(get_db)):
    try:
        print(f"📋 Récupération candidatures utilisateur: {user_id}")
        applications = crud.get_user_applications(db, user_id)
        
        # Convertir en format dict
        applications_list = []
        for app in applications:
            applications_list.append({
                "id": app.id,
                "first_name": app.first_name,
                "last_name": app.last_name,
                "email": app.email,
                "compatibility_score": app.compatibility_score,
                "status": app.status.value if hasattr(app.status, 'value') else str(app.status),
                "created_at": app.created_at.isoformat(),
                "job": {
                    "id": app.job.id,
                    "code": app.job.code,
                    "title": app.job.title,
                    "type": app.job.type.value if hasattr(app.job.type, 'value') else str(app.job.type)
                }
            })
        
        print(f"✅ {len(applications_list)} candidatures trouvées")
        return applications_list
    except Exception as e:
        error_msg = f"Erreur récupération candidatures: {str(e)}"
        print(f"❌ {error_msg}")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=error_msg)