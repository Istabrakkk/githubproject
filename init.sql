-- Script d'initialisation de la base de données
-- CORRECTION : S'assurer que la base existe et est utilisée

CREATE DATABASE IF NOT EXISTS candidature_db 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE candidature_db;

-- Les tables seront créées automatiquement par SQLAlchemy
-- Ce script sert uniquement à s'assurer que la base existe

-- Optionnel : Insérer des données de test SEULEMENT si les tables existent déjà
-- (SQLAlchemy les créera au démarrage de l'app)

-- Fonction pour insérer des jobs de test après création des tables
DELIMITER $$
CREATE PROCEDURE InsertTestJobs()
BEGIN
    DECLARE table_exists INT DEFAULT 0;
    
    -- Vérifier si la table jobs existe
    SELECT COUNT(*) INTO table_exists 
    FROM information_schema.tables 
    WHERE table_schema = 'candidature_db' 
    AND table_name = 'jobs';
    
    -- Si la table existe, insérer les données
    IF table_exists > 0 THEN
        INSERT IGNORE INTO jobs (code, title, description, type, salary, created_at) VALUES
        ('dev-web', 'Développeur Web', 'Créez des applications web innovantes', 'CDI', '35k - 50k €', NOW()),
        ('data-analyst', 'Analyste de Données', 'Analysez et interprétez les données', 'CDI', '40k - 55k €', NOW()),
        ('ux-designer', 'UX Designer', 'Concevez des expériences utilisateur', 'CDI', '38k - 52k €', NOW()),
        ('ingenieur-reseau', 'Ingénieur Réseau', 'Gérez l\'infrastructure réseau', 'CDI', '42k - 58k €', NOW()),
        ('stage-cloud', 'Stage Cloud', 'Découvrez les technologies cloud', 'STAGE', '800€ - 1200€/mois', NOW()),
        ('stage-dev', 'Stage Développement', 'Apprenez le développement logiciel', 'STAGE', '700€ - 1000€/mois', NOW());
    END IF;
END$$
DELIMITER ;

-- La procédure sera appelée par l'application au démarrage