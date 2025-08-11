import os
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, declarative_base

# CORRECTION : Configuration pour Docker avec fallback local
def get_database_url():
    # En Docker, utiliser l'URL fournie par docker-compose
    docker_url = os.getenv("DATABASE_URL")
    if docker_url:
        print(f"🐳 Utilisation URL Docker: {docker_url}")
        return docker_url
    
    # Fallback pour développement local
    local_url = "mysql+pymysql://root:@localhost/candidature_db"
    print(f"🏠 Utilisation URL locale: {local_url}")
    return local_url

DATABASE_URL = get_database_url()

# Configuration moteur avec options robustes
engine = create_engine(
    DATABASE_URL, 
    echo=True,  # Logs SQL pour debug
    pool_pre_ping=True,  # Vérifier connexion avant utilisation
    pool_recycle=300,    # Recycler connexions après 5min
    pool_timeout=20,     # Timeout connexion
    pool_size=5,         # Taille du pool
    max_overflow=10      # Connexions supplémentaires
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def test_connection():
    """Test de connexion à la base de données"""
    try:
        print("🔍 Test de connexion à la base de données...")
        with engine.connect() as conn:
            result = conn.execute(text("SELECT 1 as test"))
            test_value = result.fetchone()[0]
            if test_value == 1:
                print("✅ Connexion DB réussie!")
                return True
            else:
                print("❌ Test de connexion échoué!")
                return False
    except Exception as e:
        print(f"❌ Erreur DB: {e}")
        print(f"❌ URL utilisée: {DATABASE_URL}")
        return False

def wait_for_db(max_retries=30, delay=2):
    """Attendre que la base de données soit prête"""
    import time
    for attempt in range(max_retries):
        if test_connection():
            return True
        print(f"⏳ Tentative {attempt + 1}/{max_retries} - Attente DB...")
        time.sleep(delay)
    return False