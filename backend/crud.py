from sqlalchemy.orm import Session
from passlib.context import CryptContext
import models as models, schemas as schemas
import json

# Configuration pour le hashage des mots de passe
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Fonctions pour les utilisateurs
def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def create_user(db: Session, user: schemas.UserSignUp):
    try:
        hashed_password = pwd_context.hash(user.password)
        db_user = models.User(
            email=user.email,
            full_name=user.full_name,
            password_hash=hashed_password,
            phone=user.phone
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user
    except Exception as e:
        print(f"Erreur lors de la création de l'utilisateur: {e}")
        db.rollback()
        raise

def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(plain_password, hashed_password)

def authenticate_user(db: Session, email: str, password: str):
    user = get_user_by_email(db, email)
    if not user or not verify_password(password, user.password_hash):
        return False
    return user

# Fonctions pour les jobs (lire)
def get_jobs(db: Session):
    return db.query(models.Job).all()

def get_job_by_code(db: Session, code: str):
    return db.query(models.Job).filter(models.Job.code == code).first()

# Fonctions pour les candidatures (creation) - CORRIGÉE
def create_application(db: Session, application_data: schemas.ApplicationCreate):
    try:
        print(f"🔍 Début création candidature pour userId: {application_data.userId}, jobCode: {application_data.jobCode}")
        
        # Vérifier que l'utilisateur existe
        user = get_user(db, application_data.userId)
        if not user:
            print(f"❌ Utilisateur non trouvé avec ID: {application_data.userId}")
            return None
        
        print(f"✅ Utilisateur trouvé: {user.email}")
        
        # Vérifier que le job existe
        job = get_job_by_code(db, application_data.jobCode)
        if not job:
            print(f"❌ Job non trouvé avec code: {application_data.jobCode}")
            return None
        
        print(f"✅ Job trouvé: {job.title}")
        
        # Convertir les dictionnaires en JSON strings
        job_answers_json = json.dumps(application_data.jobAnswers) if application_data.jobAnswers else "{}"
        personality_answers_json = json.dumps(application_data.personalityAnswers) if application_data.personalityAnswers else "{}"
        
        print(f"📝 Création de la candidature...")
        print(f"   - Job answers: {job_answers_json}")
        print(f"   - Personality answers: {personality_answers_json}")
        
        # Créer la candidature
        db_application = models.Application(
            user_id=user.id,
            job_id=job.id,
            first_name=application_data.firstName,
            last_name=application_data.lastName,
            email=application_data.email,
            phone=application_data.phone,
            address=application_data.address,
            experience=application_data.experience,
            last_position=application_data.lastPosition or "",
            skills=application_data.skills,
            education=application_data.education,
            field_of_study=application_data.fieldOfStudy,
            github=application_data.github or "",
            job_answers=job_answers_json,
            personality_answers=personality_answers_json,
            compatibility_score=42  # À calculer selon votre logique
        )
        
        db.add(db_application)
        db.commit()
        db.refresh(db_application)
        
        print(f"✅ Candidature créée avec succès, ID: {db_application.id}")
        return db_application
        
    except Exception as e:
        print(f"❌ Erreur lors de la création de la candidature: {e}")
        print(f"❌ Type d'erreur: {type(e)}")
        db.rollback()
        raise

def get_user_applications(db: Session, user_id: int):
    return db.query(models.Application).filter(models.Application.user_id == user_id).all()