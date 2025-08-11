from backend.database import test_connection, SessionLocal
from backend import models

def test_database():
    print("🔍 Test de connexion à la base de données...")
    
    if test_connection():
        print("✅ Connexion réussie!")
        
        # Tester les tables
        db = SessionLocal()
        try:
            users_count = db.query(models.User).count()
            jobs_count = db.query(models.Job).count()
            applications_count = db.query(models.Application).count()
            
            print(f"📊 Statistiques:")
            print(f"   - Utilisateurs: {users_count}")
            print(f"   - Jobs: {jobs_count}")
            print(f"   - Candidatures: {applications_count}")
            
        except Exception as e:
            print(f"❌ Erreur lors de la lecture des tables: {e}")
        finally:
            db.close()
    else:
        print("❌ Échec de la connexion!")

if __name__ == "__main__":
    test_database()