#!/usr/bin/env python3
"""
Script de test pour vérifier que l'API fonctionne correctement
"""
import requests
import json

BASE_URL = "http://localhost:8000/api"

def test_health():
    """Test de la route de santé"""
    try:
        response = requests.get(f"{BASE_URL}/health")
        print(f"✅ Health Check: {response.status_code}")
        print(f"   Response: {response.json()}")
        return True
    except Exception as e:
        print(f"❌ Health Check Error: {e}")
        return False

def test_jobs():
    """Test de récupération des jobs"""
    try:
        response = requests.get(f"{BASE_URL}/jobs")
        print(f"✅ Jobs: {response.status_code}")
        if response.status_code == 200:
            jobs = response.json()
            print(f"   Found {len(jobs)} jobs")
        else:
            print(f"   Error: {response.text}")
        return True
    except Exception as e:
        print(f"❌ Jobs Error: {e}")
        return False

def test_signup():
    """Test d'inscription"""
    user_data = {
        "full_name": "Test User",
        "email": "test@example.com",
        "password": "testpass123",
        "phone": "1234567890"
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/auth/signup",
            headers={"Content-Type": "application/json"},
            data=json.dumps(user_data)
        )
        print(f"✅ Signup: {response.status_code}")
        if response.status_code != 200:
            print(f"   Error: {response.text}")
        return True
    except Exception as e:
        print(f"❌ Signup Error: {e}")
        return False

if __name__ == "__main__":
    print("🧪 Test de l'API MonCandidat")
    print("=" * 50)
    
    # Test de base
    if not test_health():
        print("❌ Le serveur n'est pas accessible!")
        exit(1)
    
    # Test des autres endpoints
    test_jobs()
    test_signup()
    
    print("\n🎉 Tests terminés!")