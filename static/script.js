// //let currentUser = null;
// //let currentJob = null;

// //const jobQuestions = {
// //'dev-web': [
// //{question: 'Quel framework JavaScript préférez-vous ?', options: ['React', 'Vue.js', 'Angular', 'Vanilla JS'], weight: 15},
// //{question: 'Votre approche pour le responsive design ?', options: ['Mobile-first', 'Desktop-first', 'Adaptive', 'Progressive'], weight: 10},
// //{question: 'Outil de versionning préféré ?', options: ['Git', 'SVN', 'Mercurial', 'Autres'], weight: 12}
// ],
// 'data-analyst': [
// {question: 'Quel outil d\'analyse préférez-vous ?', options: ['Python', 'R', 'SQL', 'Excel'], weight: 20},
// {question: 'Type de visualisation favorite ?', options: ['Graphiques interactifs', 'Dashboards', 'Rapports statiques', 'Infographies'], weight: 10},
// {question: 'Méthode d\'analyse de données ?', options: ['Descriptive', 'Prédictive', 'Prescriptive', 'Exploratoire'], weight: 15}
// ],
// 'ux-designer': [
// {question: 'Outil de design préféré ?', options: ['Figma', 'Adobe XD', 'Sketch', 'Photoshop'], weight: 15},
// {question: 'Méthode de recherche utilisateur ?', options: ['Interviews', 'Sondages', 'Tests A/B', 'Analytics'], weight: 18},
// {question: 'Approche de prototypage ?', options: ['Low-fidelity', 'High-fidelity', 'Interactive', 'Paper'], weight: 12}
// ],
// 'ingenieur-reseau': [
// {question: 'Protocole réseau le plus important ?', options: ['TCP/IP', 'HTTP/HTTPS', 'DNS', 'DHCP'], weight: 20},
// {question: 'Outil de monitoring préféré ?', options: ['Wireshark', 'Nagios', 'PRTG', 'SolarWinds'], weight: 15},
// {question: 'Architecture réseau favorite ?', options: ['Client-serveur', 'P2P', 'Cloud', 'Hybride'], weight: 12}
// ],
// 'stage-cloud': [
// {question: 'Plateforme cloud d\'intérêt ?', options: ['AWS', 'Azure', 'Google Cloud', 'Multi-cloud'], weight: 18},
// {question: 'Service cloud prioritaire ?', options: ['IaaS', 'PaaS', 'SaaS', 'FaaS'], weight: 15},
// {question: 'Outil DevOps d\'apprentissage ?', options: ['Docker', 'Kubernetes', 'Jenkins', 'Terraform'], weight: 10}
// ],
// 'stage-dev': [
// {question: 'Langage de programmation à approfondir ?', options: ['JavaScript', 'Python', 'Java', 'C#'], weight: 15},
// {question: 'Domaine de développement d\'intérêt ?', options: ['Frontend', 'Backend', 'Mobile', 'Full-stack'], weight: 18},
// {question: 'Méthodologie de développement ?', options: ['Agile', 'Scrum', 'Kanban', 'Waterfall'], weight: 10}
// ]
// };

// const compatibilityWeights = {
// experience: 25,
// education: 20,
// skills: 20,
// jobQuestions: 20,
// personality: 15
// };

// // Configuration API - Adaptée pour Docker
// const API_BASE_URL = window.location.origin + '/api';
// // OU pour le développement local :
// // const API_BASE_URL = 'http://localhost:8000/api';

// document.addEventListener('DOMContentLoaded', function() {
// initializeApp();
// });

// function initializeApp() {
// setupAuthTabs();
// setupAuthForms();
// setupJobCards();
// setupApplicationForm();
// }

// function setupAuthTabs() {
// const tabBtns = document.querySelectorAll('.tab-btn');
// const authForms = document.querySelectorAll('.auth-form');

// tabBtns.forEach(btn => {
// btn.addEventListener('click', () => {
// tabBtns.forEach(b => b.classList.remove('active'));
// authForms.forEach(f => f.classList.remove('active'));
// btn.classList.add('active');
// document.getElementById(btn.dataset.tab + 'Form').classList.add('active');
// });
// });
// }

// //function setupAuthForms() {
// document.getElementById('signinForm').addEventListener('submit', handleSignIn);
// document.getElementById('signupForm').addEventListener('submit', handleSignUp);
// }

// function setupJobCards() {
// const jobCards = document.querySelectorAll('.job-card');
// jobCards.forEach(card => {
// card.querySelector('.btn-apply').addEventListener('click', () => {
// currentJob = card.dataset.job;
// showJobApplication();
// });
// });
// }

// function setupApplicationForm() {
// document.getElementById('applicationForm').addEventListener('submit', handleApplication);
// }

// // Fonctions API
// // Remplacer les fonctions API par:
// const api = {
//     signUp: async (userData) => {
//         try {
//             console.log('Envoi données inscription:', userData);
//             const response = await fetch(`${API_BASE_URL}/auth/signup`, {
//                 method: 'POST',
//                 headers: { 
//                     'Content-Type': 'application/json',
//                     'Accept': 'application/json'
//                 },
//                 body: JSON.stringify({
//                     full_name: userData.name,
//                     email: userData.email,
//                     password: userData.password,
//                     phone: userData.phone
//                 })
//             });
            
//             console.log('Response status:', response.status);
//             console.log('Response headers:', response.headers);
            
//             if (!response.ok) {
//                 const errorText = await response.text();
//                 console.error('Response error text:', errorText);
//                 try {
//                     const error = JSON.parse(errorText);
//                     throw new Error(error.detail || 'Erreur lors de l\'inscription');
//                 } catch (parseError) {
//                     throw new Error(`Erreur serveur: ${response.status} - ${errorText}`);
//                 }
//             }
            
//             const result = await response.json();
//             console.log('Inscription réussie:', result);
//             return result;
//         } catch (error) {
//             console.error('Erreur API signUp:', error);
//             throw error;
//         }
//     },

//     signIn: async (email, password) => {
//         try {
//             console.log('Tentative connexion:', email);
//             const response = await fetch(`${API_BASE_URL}/auth/signin`, {
//                 method: 'POST',
//                 headers: { 
//                     'Content-Type': 'application/json',
//                     'Accept': 'application/json'
//                 },
//                 body: JSON.stringify({ email, password })
//             });
            
//             if (!response.ok) {
//                 const errorText = await response.text();
//                 try {
//                     const error = JSON.parse(errorText);
//                     throw new Error(error.detail || 'Erreur de connexion');
//                 } catch (parseError) {
//                     throw new Error(`Erreur serveur: ${response.status}`);
//                 }
//             }
            
//             const result = await response.json();
//             return result;
//         } catch (error) {
//             console.error('Erreur API signIn:', error);
//             throw error;
//         }
//     }
// };

//     // Jobs
//     getJobs: async () => {
//         try {
//             const response = await fetch(`${API_BASE_URL}/jobs`);
//             if (!response.ok) throw new Error('Erreur lors du chargement des jobs');
//             return await response.json();
//         } catch (error) {
//             console.error('Erreur API getJobs:', error);
//             throw error;
//         }
//     },

//     // Candidatures
//     submitApplication ;async (applicationData) => {
//         try {
//             console.log('Envoi de la candidature:', applicationData);
//             const response = await fetch(`${API_BASE_URL}/applications`, {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify(applicationData)
//             });
            
//             if (!response.ok) {
//                 const error = await response.json();
//                 throw new Error(error.detail || 'Erreur lors de la soumission');
//             }
            
//             return await response.json();
//         } catch (error) {
//             console.error('Erreur API submitApplication:', error);
//             throw error;
//         }
//     }


// // Fonctions d'authentification
// async function handleSignIn(e) {
//     e.preventDefault();
//     const email = document.getElementById('signinEmail').value;
//     const password = document.getElementById('signinPassword').value;

//     if (!email || !password) {
//         alert('Veuillez remplir tous les champs');
//         return;
//     }

//     try {
//         const user = await api.signIn(email, password);
//         currentUser = user;
//         showPage('jobsPage');
//         document.getElementById('userName').textContent = `Bienvenue ${user.full_name}`;
        
//         // Charger les jobs depuis l'API
//         await loadJobsFromAPI();
//     } catch (error) {
//         alert(`Erreur de connexion: ${error.message}`);
//         console.error('Erreur handleSignIn:', error);
//     }
// }

// async function handleSignUp(e) {
//     e.preventDefault();
//     const userData = {
//         name: document.getElementById('signupName').value,
//         email: document.getElementById('signupEmail').value,
//         password: document.getElementById('signupPassword').value,
//         phone: document.getElementById('signupPhone').value
//     };

//     // Validation des champs
//     if (!userData.name || !userData.email || !userData.password || !userData.phone) {
//         alert('Veuillez remplir tous les champs');
//         return;
//     }

//     try {
//         const user = await api.signUp(userData);
//         currentUser = user;
//         showPage('jobsPage');
//         document.getElementById('userName').textContent = `Bienvenue ${user.full_name}`;
        
//         // Charger les jobs depuis l'API
//         await loadJobsFromAPI();
//     } catch (error) {
//         alert(`Erreur d'inscription: ${error.message}`);
//         console.error('Erreur handleSignUp:', error);
//     }
// }

// // Nouvelle fonction pour charger les jobs depuis l'API
// async function loadJobsFromAPI() {
//     try {
//         const jobs = await api.getJobs();
//         console.log('Jobs chargés:', jobs);
//         // Les jobs sont déjà affichés dans le HTML, 
//         // mais vous pouvez les actualiser ici si nécessaire
//     } catch (error) {
//         console.error('Erreur lors du chargement des jobs:', error);
//         // En cas d'erreur, on continue avec les jobs statiques du HTML
//     }
// }

// function showJobApplication() {
//     const jobTitles = {
//         'dev-web': 'Développeur Web',
//         'data-analyst': 'Analyste de Données',
//         'ux-designer': 'UX Designer',
//         'ingenieur-reseau': 'Ingénieur Réseau',
//         'stage-cloud': 'Stage Cloud',
//         'stage-dev': 'Stage Développement'
//     };

//     document.getElementById('jobTitle').textContent = `Candidature - ${jobTitles[currentJob]}`;
//     loadJobQuestions();
//     showPage('applicationPage');
// }

// function loadJobQuestions() {
//     const questionsContainer = document.getElementById('jobQuestions');
//     questionsContainer.innerHTML = '';

//     if (jobQuestions[currentJob]) {
//         jobQuestions[currentJob].forEach((q, index) => {
//             const questionDiv = document.createElement('div');
//             questionDiv.className = 'question-group';
//             questionDiv.innerHTML = `
//                 <label>${q.question}</label>
//                 <div class="radio-group">
//                     ${q.options.map(option => `
//                         <label><input type="radio" name="jobQ${index}" value="${option}"> ${option}</label>
//                     `).join('')}
//                 </div>
//             `;
//             questionsContainer.appendChild(questionDiv);
//         });
//     }
// }

// // Fonction handleApplication modifiée pour utiliser l'API
// async function handleApplication(e) {
//     e.preventDefault();
    
//     if (!currentUser) {
//         alert('Vous devez être connecté pour postuler');
//         return;
//     }

//     const formData = new FormData(e.target);
    
//     // Récupérer les réponses aux questions spécifiques
//     const jobAnswers = {};
//     if (jobQuestions[currentJob]) {
//         jobQuestions[currentJob].forEach((q, index) => {
//             const answer = formData.get(`jobQ${index}`);
//             if (answer) {
//                 jobAnswers[`question_${index}`] = answer;
//             }
//         });
//     }

//     // Récupérer les réponses de personnalité
//     const personalityAnswers = {
//         stress: formData.get('stress'),
//         workStyle: formData.get('workStyle'),
//         problemSolving: formData.get('problemSolving'),
//         motivation: formData.get('motivation')
//     };

//     const applicationData = {
//         userId: currentUser.id,
//         jobCode: currentJob,
//         firstName: formData.get('firstName'),
//         lastName: formData.get('lastName'),
//         email: formData.get('email'),
//         phone: formData.get('phone'),
//         address: formData.get('address'),
//         experience: formData.get('experience'),
//         lastPosition: formData.get('lastPosition') || '',
//         skills: formData.get('skills'),
//         education: formData.get('education'),
//         fieldOfStudy: formData.get('fieldOfStudy'),
//         github: formData.get('github') || '',
//         jobAnswers: jobAnswers,
//         personalityAnswers: personalityAnswers
//     };

//     // Validation des champs obligatoires
//     if (!applicationData.firstName || !applicationData.lastName || !applicationData.email || 
//         !applicationData.phone || !applicationData.address || !applicationData.experience ||
//         !applicationData.skills || !applicationData.education || !applicationData.fieldOfStudy) {
//         alert('Veuillez remplir tous les champs obligatoires');
//         return;
//     }

//     try {
//         const result = await api.submitApplication(applicationData);
//         console.log('Candidature soumise avec succès:', result);
        
//         // Calculer le score de compatibilité côté client
//         const compatibility = calculateCompatibility(formData);
//         showResult(compatibility);
//     } catch (error) {
//         alert(`Erreur lors de la soumission: ${error.message}`);
//         console.error('Erreur handleApplication:', error);
//     }
// }

// function calculateCompatibility(formData) {
//     let totalScore = 0;

//     const experienceScore = calculateExperienceScore(formData.get('experience'));
//     const educationScore = calculateEducationScore(formData.get('education'));
//     const personalityScore = calculatePersonalityScore(formData);
//     const jobSpecificScore = calculateJobSpecificScore(formData);

//     totalScore = (experienceScore * compatibilityWeights.experience / 100) + 
//                  (educationScore * compatibilityWeights.education / 100) + 
//                  (personalityScore * compatibilityWeights.personality / 100) + 
//                  (jobSpecificScore * compatibilityWeights.jobQuestions / 100) + 
//                  (compatibilityWeights.skills);

//     return Math.min(Math.round(totalScore), 100);
// }

// function calculateExperienceScore(experience) {
//     const experienceMap = {
//         '0-1': currentJob.includes('stage') ? 95 : 70,
//         '2-3': currentJob.includes('stage') ? 85 : 85,
//         '4-5': currentJob.includes('stage') ? 75 : 95,
//         '5+': currentJob.includes('stage') ? 65 : 100
//     };
//     return experienceMap[experience] || 50;
// }

// function calculateEducationScore(education) {
//     const educationMap = {
//         'bac': currentJob.includes('stage') ? 85 : 60,
//         'bac+2': currentJob.includes('stage') ? 95 : 75,
//         'bac+3': currentJob.includes('stage') ? 90 : 85,
//         'bac+5': currentJob.includes('stage') ? 85 : 95,
//         'bac+8': currentJob.includes('stage') ? 80 : 100
//     };
//     return educationMap[education] || 50;
// }

// function calculatePersonalityScore(formData) {
//     let score = 0;
//     const personalityAnswers = {
//         stress: formData.get('stress'),
//         workStyle: formData.get('workStyle'),
//         problemSolving: formData.get('problemSolving'),
//         motivation: formData.get('motivation')
//     };

//     const idealAnswers = {
//         'dev-web': { stress: 'planning', workStyle: 'mixed', problemSolving: 'analyze', motivation: 'challenge' },
//         'data-analyst': { stress: 'planning', workStyle: 'individual', problemSolving: 'analyze', motivation: 'impact' },
//         'ux-designer': { stress: 'communication', workStyle: 'team', problemSolving: 'creative', motivation: 'impact' },
//         'ingenieur-reseau': { stress: 'technique', workStyle: 'mixed', problemSolving: 'research', motivation: 'challenge' },
//         'stage-cloud': { stress: 'planning', workStyle: 'mixed', problemSolving: 'research', motivation: 'growth' },
//         'stage-dev': { stress: 'planning', workStyle: 'team', problemSolving: 'collaborate', motivation: 'growth' }
//     };

//     const ideal = idealAnswers[currentJob] || {};
//     Object.keys(personalityAnswers).forEach(key => {
//         if (personalityAnswers[key] === ideal[key]) {
//             score += 25;
//         }
//     });

//     return score;
// }

// function calculateJobSpecificScore(formData) {
//     let score = 0;
//     const questions = jobQuestions[currentJob] || [];

//     questions.forEach((q, index) => {
//         const answer = formData.get(`jobQ${index}`);
//         if (answer) {
//             score += q.weight;
//         }
//     });

//     return Math.min(score, 100);
// }

// function showResult(compatibility) {
//     document.getElementById('compatibilityScore').textContent = `${compatibility}%`;

//     const analysis = generateAnalysis(compatibility);
//     document.getElementById('resultAnalysis').innerHTML = analysis;
//     showPage('resultPage');
//     animateScore(compatibility);
// }

// function generateAnalysis(score) {
//     let analysis = '<div class="result-analysis">';

//     if (score >= 80) {
//         analysis += '<h4 style="color: #4CAF50; margin-bottom: 10px;">🎉 Excellent match!</h4>';
//         analysis += '<p>Votre profil correspond parfaitement aux exigences du poste. Vos compétences et votre expérience sont en parfaite adéquation avec nos besoins.</p>';
//     } else if (score >= 60) {
//         analysis += '<h4 style="color: #FF9800; margin-bottom: 10px;">👍 Bon potentiel</h4>';
//         analysis += '<p>Votre candidature présente un bon potentiel. Quelques formations complémentaires pourraient renforcer votre profil.</p>';
//     } else {
//         analysis += '<h4 style="color: #F44336; margin-bottom: 10px;">📈 Développement requis</h4>';
//         analysis += '<p>Votre profil montre de l\'intérêt, mais nécessite un développement supplémentaire pour correspondre pleinement au poste.</p>';
//     }

//     analysis += '<div style="margin-top: 20px;"><strong>Points forts détectés:</strong><ul style="margin-top: 10px;">';
//     if (score >= 70) analysis += '<li>Excellente adéquation technique</li>';
//     if (score >= 60) analysis += '<li>Profil de personnalité adapté</li>';
//     if (currentJob.includes('stage')) analysis += '<li>Motivation d\'apprentissage</li>';
//     analysis += '</ul></div>';

//     analysis += '</div>';
//     return analysis;
// }

// function animateScore(targetScore) {
//     let currentScore = 0;
//     const increment = targetScore / 50;
//     const timer = setInterval(() => {
//         currentScore += increment;
//         if (currentScore >= targetScore) {
//             currentScore = targetScore;
//             clearInterval(timer);
//         }
//         document.getElementById('compatibilityScore').textContent = `${Math.round(currentScore)}%`;
//     }, 50);
// }

// function showPage(pageId) {
//     document.querySelectorAll('.page').forEach(page => {
//         page.classList.remove('active');
//     });
//     document.getElementById(pageId).classList.add('active');
// }

// function goBack() {
//     showPage('jobsPage');
// }

// function goBackToJobs() {
//     showPage('jobsPage');
// }

// function logout() {
//     currentUser = null;
//     currentJob = null;
//     showPage('authPage');
//     document.getElementById('signinForm').reset();
//     document.getElementById('signupForm').reset();
// }

// function downloadResult() {
//     const score = document.getElementById('compatibilityScore').textContent;
//     const analysis = document.getElementById('resultAnalysis').textContent;

//     const resultData = `
// Résultat de candidature - MonCandidat
// =====================================

// Poste: ${currentJob}
// Score de compatibilité: ${score}

// Analyse:
// ${analysis}

// Date: ${new Date().toLocaleDateString()}
// `;

//     const blob = new Blob([resultData], { type: 'text/plain' });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = `resultat-candidature-${currentJob}.txt`;
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);
//     URL.revokeObjectURL(url);
// }