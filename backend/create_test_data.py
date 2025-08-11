# #!/usr/bin/env python3
# """
# Script pour créer des données de test dans la base de données
# """
# from database import SessionLocal
# import models

# def create_test_jobs():
#     """Crée des jobs de test"""
#     db = SessionLocal()
    
#     try:
#         # Vérifier si des jobs existent déjà
#         existing_jobs = db.query(models.Job).count()
#         if existing_jobs > 0:
#             print(f"✅ {existing_jobs} jobs déjà présents dans la base")
#             return
        
#         jobs_data = [
#             {
#                 "code": "dev-web",
#                 "title": "Développeur Web",
#                 "description": "Créez des applications web innovantes avec les dernières technologies",
#                 "type": models.JobType.CDI,
#                 "salary": "35k - 50k €"
#             },
#             {
#                 "code": "data-analyst",
#                 "title": "Analyste de Données",
#                 "description": "Analysez et interprétez les données pour aider à la prise de décision",
#                 "type": models.JobType.CDI,
#                 "salary": "40k - 55k €"
#             },
#             {
#                 "code": "ux-designer",
#                 "title": "UX Designer",
#                 "description": "Concevez des expériences utilisateur exceptionnelles",
#                 "type": models.JobType.CDI,
#                 "salary": "38k - 52k €"
#             },
#             {
#                 "code": "ingenieur-reseau",
#                 "title": "Ingénieur Réseau",
#                 "description": "Gérez et optimisez l'infrastructure réseau de l'entreprise",
#                 "type": models.JobType.CDI,
#                 "salary": "42k - 58k €"
#             },
#             {
#                 "code": "stage-cloud",
#                 "title": "Stage Cloud Computing",
#                 "description": "Découvrez les technologies cloud et DevOps",
#                 "type": models.JobType.STAGE,
#                 "salary": "800€ - 1200€/mois"
#             },
#             {
#                 "code": "stage-dev",
#                 "title": "Stage Développement",
#                 "description": "Apprenez le développement logiciel avec une équipe expérimentée",
#                 "type": models.JobType.STAGE,
#                 "salary": "700€ - 1000€/mois"
#             }
#         ]
        
#         for job_data in jobs_data:
#             job = models.Job(**job_data)
#             db.add(job)
#             print(f"➕ Ajout du job: {job_data['title']}")
        
#         db.commit()
#         print(f"✅ {len(jobs_data)} jobs créés avec succès!")
        
#     except Exception as e:
#         print(f"❌ Erreur lors de la création des jobs: {e}")
#         db.rollback()
#     finally:
#         db.close()

# if __name__ == "__main__":
#     print("🔧 Création des données de test...")
#     create_test_jobs()
#     print("🎉 Terminé!")