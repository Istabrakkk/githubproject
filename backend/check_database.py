#!/usr/bin/env python3
"""
Script pour vérifier l'état de la base de données
"""
from database import SessionLocal, engine
from sqlalchemy import text
import models

def check_database():
    """Vérifie l'état de la base de données"""
    db = SessionLocal()
    
    try:
        print("🔍 Vérification de la base de données...")
        
        # Test de connexion
        db.execute(text("SELECT 1"))
        print("✅ Connexion à la base de données OK")
        
        # Vérifier les tables
        print("\n📋 Vérification des tables:")
        
        # Vérifier la table users
        users_count = db.query(models.User).count()
        print(f"   - Users: {users_count} enregistrements")
        
        # Vérifier la table jobs
        jobs_count = db.query(models.Job).count()
        print(f"   - Jobs: {jobs_count} enregistrements")
        
        # Vérifier la table applications
        applications_count = db.query(models.Application).count()
        print(f"   - Applications: {applications_count} enregistrements")
        
        # Lister les jobs disponibles
        if jobs_count > 0:
            print("\n📝 Jobs disponibles:")
            jobs = db.query(models.Job).all()
            for job in jobs:
                print(f"   - {job.code}: {job.title}")
        
        # Lister les utilisateurs
        if users_count > 0:
            print("\n👥 Utilisateurs:")
            users = db.query(models.User).all()
            for user in users:
                print(f"   - ID {user.id}: {user.email} ({user.full_name})")
        
        print("\n✅ Vérification terminée avec succès!")
        return True
        
    except Exception as e:
        print(f"❌ Erreur lors de la vérification: {e}")
        import traceback
        print(f"❌ Traceback: {traceback.format_exc()}")
        return False
    finally:
        db.close()

def create_tables():
    """Crée les tables si elles n'existent pas"""
    try:
        print("🔧 Création des tables...")
        models.Base.metadata.create_all(bind=engine)
        print("✅ Tables créées avec succès!")
        return True
    except Exception as e:
        print(f"❌ Erreur lors de la création des tables: {e}")
        return False

if __name__ == "__main__":
    print("🧪 Vérification de la base de données MonCandidat")
    print("=" * 60)
    
    # Créer les tables si nécessaire
    create_tables()
    
    # Vérifier l'état
    if check_database():
        print("\n🎉 Base de données prête!")
    else:
        print("\n❌ Problèmes détectés dans la base de données!")