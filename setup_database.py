#!/usr/bin/env python3
import mysql.connector
from mysql.connector import Error
import sys

def create_database():
    try:
        # Connexion MySQL
        connection = mysql.connector.connect(
            host='localhost',
            user='root',
            password='',  # Ajustez selon votre config
            charset='utf8mb4',
            collation='utf8mb4_unicode_ci'
        )
        
        if connection.is_connected():
            cursor = connection.cursor()
            
            # Créer la base
            cursor.execute("CREATE DATABASE IF NOT EXISTS candidature_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci")
            print("✅ Base de données créée/vérifiée")
            
            # Utiliser la base
            cursor.execute("USE candidature_db")
            print("✅ Base sélectionnée")
            
            return True
            
    except Error as e:
        print(f"❌ Erreur MySQL: {e}")
        return False
    finally:
        if connection and connection.is_connected():
            cursor.close()
            connection.close()

if __name__ == "__main__":
    print("🔧 Configuration Base de Données")
    if create_database():
        print("✅ Prêt! Lancez maintenant: python debug_main.py")
    else:
        print("❌ Problème de configuration")
        sys.exit(1)