// Variables globales
let currentUser = null;
let currentJob = null;

// Questions spécifiques par poste
const jobQuestions = {
    'dev-web': [
        {question: 'Quel framework JavaScript préférez-vous ?', options: ['React', 'Vue.js', 'Angular', 'Vanilla JS'], weight: 15},
        {question: 'Votre approche pour le responsive design ?', options: ['Mobile-first', 'Desktop-first', 'Adaptive', 'Progressive'], weight: 10},
        {question: 'Outil de versionning préféré ?', options: ['Git', 'SVN', 'Mercurial', 'Autres'], weight: 12}
    ],
    'data-analyst': [
        {question: 'Quel outil d\'analyse préférez-vous ?', options: ['Python', 'R', 'SQL', 'Excel'], weight: 20},
        {question: 'Type de visualisation favorite ?', options: ['Graphiques interactifs', 'Dashboards', 'Rapports statiques', 'Infographies'], weight: 10},
        {question: 'Méthode d\'analyse de données ?', options: ['Descriptive', 'Prédictive', 'Prescriptive', 'Exploratoire'], weight: 15}
    ],
    'ux-designer': [
        {question: 'Outil de design préféré ?', options: ['Figma', 'Adobe XD', 'Sketch', 'Photoshop'], weight: 15},
        {question: 'Méthode de recherche utilisateur ?', options: ['Interviews', 'Sondages', 'Tests A/B', 'Analytics'], weight: 18},
        {question: 'Approche de prototypage ?', options: ['Low-fidelity', 'High-fidelity', 'Interactive', 'Paper'], weight: 12}
    ],
    'ingenieur-reseau': [
        {question: 'Protocole réseau le plus important ?', options: ['TCP/IP', 'HTTP/HTTPS', 'DNS', 'DHCP'], weight: 20},
        {question: 'Outil de monitoring préféré ?', options: ['Wireshark', 'Nagios', 'PRTG', 'SolarWinds'], weight: 15},
        {question: 'Architecture réseau favorite ?', options: ['Client-serveur', 'P2P', 'Cloud', 'Hybride'], weight: 12}
    ],
    'stage-cloud': [
        {question: 'Plateforme cloud d\'intérêt ?', options: ['AWS', 'Azure', 'Google Cloud', 'Multi-cloud'], weight: 18},
        {question: 'Service cloud prioritaire ?', options: ['IaaS', 'PaaS', 'SaaS', 'FaaS'], weight: 15},
        {question: 'Outil DevOps d\'apprentissage ?', options: ['Docker', 'Kubernetes', 'Jenkins', 'Terraform'], weight: 10}
    ],
    'stage-dev': [
        {question: 'Langage de programmation à approfondir ?', options: ['JavaScript', 'Python', 'Java', 'C#'], weight: 15},
        {question: 'Domaine de développement d\'intérêt ?', options: ['Frontend', 'Backend', 'Mobile', 'Full-stack'], weight: 18},
        {question: 'Méthodologie de développement ?', options: ['Agile', 'Scrum', 'Kanban', 'Waterfall'], weight: 10}
    ]
};

// Poids pour le calcul de compatibilité
const compatibilityWeights = {
    experience: 25,
    education: 20,
    skills: 20,
    jobQuestions: 20,
    personality: 15
};

// Configuration API - CORRIGÉE POUR DOCKER
function getAPIBaseURL() {
    const hostname = window.location.hostname;
    const protocol = window.location.protocol;
    
    console.log('🔍 Détection environnement:', {
        hostname: hostname,
        protocol: protocol,
        port: window.location.port
    });
    
    // En production Docker (port 80)
    if (window.location.port === '80' || window.location.port === '') {
        const apiUrl = `${protocol}//${hostname}/api`;
        console.log('🐳 Mode Docker détecté, URL API:', apiUrl);
        return apiUrl;
    }
    
    // Développement local
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        const apiUrl = 'http://localhost:8000/api';
        console.log('🏠 Mode développement détecté, URL API:', apiUrl);
        return apiUrl;
    }
    
    // Fallback
    const fallbackUrl = `${protocol}//${hostname}/api`;
    console.log('⚠️ Fallback URL:', fallbackUrl);
    return fallbackUrl;
}

const API_BASE_URL = getAPIBaseURL();
console.log('🎯 API_BASE_URL final:', API_BASE_URL);

// Initialisation de l'application
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initialisation de l\'application...');
    initializeApp();
});

function initializeApp() {
    console.log('📋 Configuration des événements...');
    setupAuthTabs();
    setupAuthForms();
    setupJobCards();
    setupApplicationForm();
    
    // Test de connectivité API
    testAPIConnection();
}

// Test de l'API au démarrage
async function testAPIConnection() {
    try {
        console.log('🔍 Test de connexion API vers:', `${API_BASE_URL}/health`);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
        
        const response = await fetch(`${API_BASE_URL}/health`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
            const data = await response.json();
            console.log('✅ API accessible:', data);
            showSuccessMessage('API connectée avec succès!');
        } else {
            console.warn('⚠️ API répond avec erreur:', response.status);
            showWarningMessage('API accessible mais avec erreurs');
        }
    } catch (error) {
        console.error('❌ Impossible de joindre l\'API:', error.message);
        showErrorMessage('Impossible de se connecter à l\'API. Mode hors ligne activé.');
    }
}

// Messages d'état
function showSuccessMessage(message) {
    console.log('✅', message);
}

function showWarningMessage(message) {
    console.warn('⚠️', message);
}

function showErrorMessage(message) {
    console.error('❌', message);
}

function setupAuthTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const authForms = document.querySelectorAll('.auth-form');

    if (tabBtns.length === 0) {
        console.error('❌ Boutons d\'onglets non trouvés');
        return;
    }

    tabBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('🔄 Changement d\'onglet vers:', btn.dataset.tab);
            
            tabBtns.forEach(b => b.classList.remove('active'));
            authForms.forEach(f => f.classList.remove('active'));
            
            btn.classList.add('active');
            const formToShow = document.getElementById(btn.dataset.tab + 'Form');
            if (formToShow) {
                formToShow.classList.add('active');
            } else {
                console.error('❌ Formulaire non trouvé:', btn.dataset.tab + 'Form');
            }
        });
    });
}

function setupAuthForms() {
    const signinForm = document.getElementById('signinForm');
    const signupForm = document.getElementById('signupForm');
    
    if (signinForm) {
        signinForm.addEventListener('submit', handleSignIn);
        console.log('✅ Formulaire de connexion configuré');
    } else {
        console.error('❌ Formulaire de connexion non trouvé');
    }
    
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignUp);
        console.log('✅ Formulaire d\'inscription configuré');
    } else {
        console.error('❌ Formulaire d\'inscription non trouvé');
    }
}

function setupJobCards() {
    const jobCards = document.querySelectorAll('.job-card');
    console.log(`🎯 Configuration de ${jobCards.length} cartes de jobs`);
    
    jobCards.forEach(card => {
        const applyBtn = card.querySelector('.btn-apply');
        if (applyBtn) {
            applyBtn.addEventListener('click', (e) => {
                e.preventDefault();
                currentJob = card.dataset.job;
                console.log('📝 Candidature pour:', currentJob);
                showJobApplication();
            });
        }
    });
}

function setupApplicationForm() {
    const applicationForm = document.getElementById('applicationForm');
    if (applicationForm) {
        applicationForm.addEventListener('submit', handleApplication);
        console.log('✅ Formulaire de candidature configuré');
    }
}

// API Functions - AMÉLIORÉES
const api = {
    signUp: async (userData) => {
        try {
            console.log('📝 Envoi données inscription vers:', `${API_BASE_URL}/auth/signup`);
            console.log('📝 Données:', userData);
            
            const response = await fetch(`${API_BASE_URL}/auth/signup`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    full_name: userData.name,
                    email: userData.email,
                    password: userData.password,
                    phone: userData.phone || ""
                })
            });
            
            console.log('📨 Réponse statut:', response.status);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Erreur réponse:', errorText);
                
                let errorMessage = 'Erreur lors de l\'inscription';
                try {
                    const error = JSON.parse(errorText);
                    errorMessage = error.detail || errorMessage;
                } catch (parseError) {
                    errorMessage = `Erreur serveur: ${response.status}`;
                }
                throw new Error(errorMessage);
            }
            
            const result = await response.json();
            console.log('✅ Inscription réussie:', result);
            return result;
        } catch (error) {
            console.error('❌ Erreur API signUp:', error);
            throw error;
        }
    },

    signIn: async (email, password) => {
        try {
            console.log('🔐 Tentative connexion vers:', `${API_BASE_URL}/auth/signin`);
            
            const response = await fetch(`${API_BASE_URL}/auth/signin`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                let errorMessage = 'Erreur de connexion';
                
                try {
                    const error = JSON.parse(errorText);
                    errorMessage = error.detail || errorMessage;
                } catch (parseError) {
                    errorMessage = `Erreur serveur: ${response.status}`;
                }
                throw new Error(errorMessage);
            }
            
            const result = await response.json();
            console.log('✅ Connexion réussie:', result);
            return result;
        } catch (error) {
            console.error('❌ Erreur API signIn:', error);
            throw error;
        }
    },

    getJobs: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/jobs`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            });
            if (!response.ok) throw new Error('Erreur lors du chargement des jobs');
            return await response.json();
        } catch (error) {
            console.error('❌ Erreur API getJobs:', error);
            throw error;
        }
    },

    submitApplication: async (applicationData) => {
        try {
            console.log('📋 Envoi candidature vers:', `${API_BASE_URL}/applications`);
            
            const response = await fetch(`${API_BASE_URL}/applications`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(applicationData)
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                let errorMessage = 'Erreur lors de la soumission';
                
                try {
                    const error = JSON.parse(errorText);
                    errorMessage = error.detail || errorMessage;
                } catch (parseError) {
                    errorMessage = `Erreur serveur: ${response.status}`;
                }
                throw new Error(errorMessage);
            }
            
            const result = await response.json();
            console.log('✅ Candidature soumise:', result);
            return result;
        } catch (error) {
            console.error('❌ Erreur API submitApplication:', error);
            throw error;
        }
    }
};

// Gestion de l'authentification - AMÉLIORÉE
async function handleSignIn(e) {
    e.preventDefault();
    console.log('🔐 Début handleSignIn');
    
    const email = document.getElementById('signinEmail')?.value;
    const password = document.getElementById('signinPassword')?.value;

    if (!email || !password) {
        alert('Veuillez remplir tous les champs');
        return;
    }

    // Désactiver le bouton pendant le traitement
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Connexion...';

    try {
        const user = await api.signIn(email, password);
        currentUser = user;
        showPage('jobsPage');
        
        const userNameElement = document.getElementById('userName');
        if (userNameElement) {
            userNameElement.textContent = `Bienvenue ${user.full_name || user.email}`;
        }
        
        // Charger les jobs depuis l'API
        await loadJobsFromAPI();
        
        console.log('✅ Connexion terminée avec succès');
    } catch (error) {
        alert(`Erreur de connexion: ${error.message}`);
        console.error('❌ Erreur handleSignIn:', error);
    } finally {
        // Réactiver le bouton
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }
}

async function handleSignUp(e) {
    e.preventDefault();
    console.log('📝 Début handleSignUp');
    
    const userData = {
        name: document.getElementById('signupName')?.value?.trim(),
        email: document.getElementById('signupEmail')?.value?.trim(),
        password: document.getElementById('signupPassword')?.value,
        phone: document.getElementById('signupPhone')?.value?.trim()
    };

    // Validation des champs
    if (!userData.name || !userData.email || !userData.password) {
        alert('Veuillez remplir tous les champs obligatoires');
        return;
    }

    // Validation email simple
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
        alert('Veuillez entrer un email valide');
        return;
    }

    // Désactiver le bouton pendant le traitement
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Inscription...';

    try {
        const user = await api.signUp(userData);
        currentUser = user;
        showPage('jobsPage');
        
        const userNameElement = document.getElementById('userName');
        if (userNameElement) {
            userNameElement.textContent = `Bienvenue ${user.full_name || user.email}`;
        }
        
        // Charger les jobs depuis l'API
        await loadJobsFromAPI();
        
        console.log('✅ Inscription terminée avec succès');
    } catch (error) {
        alert(`Erreur d'inscription: ${error.message}`);
        console.error('❌ Erreur handleSignUp:', error);
    } finally {
        // Réactiver le bouton
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }
}

// Chargement des jobs depuis l'API
async function loadJobsFromAPI() {
    try {
        const jobs = await api.getJobs();
        console.log('📋 Jobs chargés:', jobs);
        // Les jobs sont déjà affichés dans le HTML statique
        // Cette fonction peut être étendue pour les actualiser dynamiquement
    } catch (error) {
        console.error('❌ Erreur lors du chargement des jobs:', error);
        // En cas d'erreur, on continue avec les jobs statiques du HTML
    }
}

// Gestion des candidatures
function showJobApplication() {
    const jobTitles = {
        'dev-web': 'Développeur Web',
        'data-analyst': 'Analyste de Données',
        'ux-designer': 'UX Designer',
        'ingenieur-reseau': 'Ingénieur Réseau',
        'stage-cloud': 'Stage Cloud',
        'stage-dev': 'Stage Développement'
    };

    const jobTitleElement = document.getElementById('jobTitle');
    if (jobTitleElement) {
        jobTitleElement.textContent = `Candidature - ${jobTitles[currentJob]}`;
    }
    
    loadJobQuestions();
    showPage('applicationPage');
}

function loadJobQuestions() {
    const questionsContainer = document.getElementById('jobQuestions');
    if (!questionsContainer) {
        console.error('❌ Container des questions non trouvé');
        return;
    }
    
    questionsContainer.innerHTML = '';

    if (jobQuestions[currentJob]) {
        jobQuestions[currentJob].forEach((q, index) => {
            const questionDiv = document.createElement('div');
            questionDiv.className = 'question-group';
            questionDiv.innerHTML = `
                <label>${q.question}</label>
                <div class="radio-group">
                    ${q.options.map(option => `
                        <label><input type="radio" name="jobQ${index}" value="${option}"> ${option}</label>
                    `).join('')}
                </div>
            `;
            questionsContainer.appendChild(questionDiv);
        });
    }
}

// Soumission de candidature
async function handleApplication(e) {
    e.preventDefault();
    console.log('📋 Début soumission candidature');
    
    if (!currentUser) {
        alert('Vous devez être connecté pour postuler');
        return;
    }

    const formData = new FormData(e.target);
    
    // Récupérer les réponses aux questions spécifiques
    const jobAnswers = {};
    if (jobQuestions[currentJob]) {
        jobQuestions[currentJob].forEach((q, index) => {
            const answer = formData.get(`jobQ${index}`);
            if (answer) {
                jobAnswers[`question_${index}`] = answer;
            }
        });
    }

    // Récupérer les réponses de personnalité
    const personalityAnswers = {
        stress: formData.get('stress'),
        workStyle: formData.get('workStyle'),
        problemSolving: formData.get('problemSolving'),
        motivation: formData.get('motivation')
    };

    const applicationData = {
        userId: currentUser.id,
        jobCode: currentJob,
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        address: formData.get('address'),
        experience: formData.get('experience'),
        lastPosition: formData.get('lastPosition') || '',
        skills: formData.get('skills'),
        education: formData.get('education'),
        fieldOfStudy: formData.get('fieldOfStudy'),
        github: formData.get('github') || '',
        jobAnswers: jobAnswers,
        personalityAnswers: personalityAnswers
    };

    // Validation des champs obligatoires
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'experience', 'skills', 'education', 'fieldOfStudy'];
    const missingFields = requiredFields.filter(field => !applicationData[field]);
    
    if (missingFields.length > 0) {
        alert('Veuillez remplir tous les champs obligatoires: ' + missingFields.join(', '));
        return;
    }

    try {
        const result = await api.submitApplication(applicationData);
        console.log('✅ Candidature soumise avec succès:', result);
        
        // Utiliser le score du serveur ou calculer côté client
        const compatibility = result.compatibility_score || calculateCompatibility(formData);
        showResult(compatibility);
    } catch (error) {
        alert(`Erreur lors de la soumission: ${error.message}`);
        console.error('❌ Erreur handleApplication:', error);
    }
}

// Calcul de compatibilité
function calculateCompatibility(formData) {
    let totalScore = 0;

    const experienceScore = calculateExperienceScore(formData.get('experience'));
    const educationScore = calculateEducationScore(formData.get('education'));
    const personalityScore = calculatePersonalityScore(formData);
    const jobSpecificScore = calculateJobSpecificScore(formData);

    totalScore = (experienceScore * compatibilityWeights.experience / 100) + 
                 (educationScore * compatibilityWeights.education / 100) + 
                 (personalityScore * compatibilityWeights.personality / 100) + 
                 (jobSpecificScore * compatibilityWeights.jobQuestions / 100) + 
                 (compatibilityWeights.skills);

    return Math.min(Math.round(totalScore), 100);
}

function calculateExperienceScore(experience) {
    const experienceMap = {
        '0-1': currentJob.includes('stage') ? 95 : 70,
        '2-3': currentJob.includes('stage') ? 85 : 85,
        '4-5': currentJob.includes('stage') ? 75 : 95,
        '5+': currentJob.includes('stage') ? 65 : 100
    };
    return experienceMap[experience] || 50;
}

function calculateEducationScore(education) {
    const educationMap = {
        'bac': currentJob.includes('stage') ? 85 : 60,
        'bac+2': currentJob.includes('stage') ? 95 : 75,
        'bac+3': currentJob.includes('stage') ? 90 : 85,
        'bac+5': currentJob.includes('stage') ? 85 : 95,
        'bac+8': currentJob.includes('stage') ? 80 : 100
    };
    return educationMap[education] || 50;
}

function calculatePersonalityScore(formData) {
    let score = 0;
    const personalityAnswers = {
        stress: formData.get('stress'),
        workStyle: formData.get('workStyle'),
        problemSolving: formData.get('problemSolving'),
        motivation: formData.get('motivation')
    };

    const idealAnswers = {
        'dev-web': { stress: 'planning', workStyle: 'mixed', problemSolving: 'analyze', motivation: 'challenge' },
        'data-analyst': { stress: 'planning', workStyle: 'individual', problemSolving: 'analyze', motivation: 'impact' },
        'ux-designer': { stress: 'communication', workStyle: 'team', problemSolving: 'creative', motivation: 'impact' },
        'ingenieur-reseau': { stress: 'technique', workStyle: 'mixed', problemSolving: 'research', motivation: 'challenge' },
        'stage-cloud': { stress: 'planning', workStyle: 'mixed', problemSolving: 'research', motivation: 'growth' },
        'stage-dev': { stress: 'planning', workStyle: 'team', problemSolving: 'collaborate', motivation: 'growth' }
    };

    const ideal = idealAnswers[currentJob] || {};
    Object.keys(personalityAnswers).forEach(key => {
        if (personalityAnswers[key] === ideal[key]) {
            score += 25;
        }
    });

    return score;
}

function calculateJobSpecificScore(formData) {
    let score = 0;
    const questions = jobQuestions[currentJob] || [];

    questions.forEach((q, index) => {
        const answer = formData.get(`jobQ${index}`);
        if (answer) {
            score += q.weight;
        }
    });

    return Math.min(score, 100);
}

// Affichage des résultats
function showResult(compatibility) {
    const scoreElement = document.getElementById('compatibilityScore');
    if (scoreElement) {
        scoreElement.textContent = `${compatibility}%`;
    }

    const analysis = generateAnalysis(compatibility);
    const analysisElement = document.getElementById('resultAnalysis');
    if (analysisElement) {
        analysisElement.innerHTML = analysis;
    }
    
    showPage('resultPage');
    animateScore(compatibility);
}

function generateAnalysis(score) {
    let analysis = '<div class="result-analysis">';

    if (score >= 80) {
        analysis += '<h4 style="color: #4CAF50; margin-bottom: 10px;">🎉 Excellent match!</h4>';
        analysis += '<p>Votre profil correspond parfaitement aux exigences du poste. Vos compétences et votre expérience sont en parfaite adéquation avec nos besoins.</p>';
    } else if (score >= 60) {
        analysis += '<h4 style="color: #FF9800; margin-bottom: 10px;">👍 Bon potentiel</h4>';
        analysis += '<p>Votre candidature présente un bon potentiel. Quelques formations complémentaires pourraient renforcer votre profil.</p>';
    } else {
        analysis += '<h4 style="color: #F44336; margin-bottom: 10px;">📈 Développement requis</h4>';
        analysis += '<p>Votre profil montre de l\'intérêt, mais nécessite un développement supplémentaire pour correspondre pleinement au poste.</p>';
    }

    analysis += '<div style="margin-top: 20px;"><strong>Points forts détectés:</strong><ul style="margin-top: 10px;">';
    if (score >= 70) analysis += '<li>Excellente adéquation technique</li>';
    if (score >= 60) analysis += '<li>Profil de personnalité adapté</li>';
    if (currentJob && currentJob.includes('stage')) analysis += '<li>Motivation d\'apprentissage</li>';
    analysis += '</ul></div>';

    analysis += '</div>';
    return analysis;
}

function animateScore(targetScore) {
    const scoreElement = document.getElementById('compatibilityScore');
    if (!scoreElement) return;
    
    let currentScore = 0;
    const increment = targetScore / 50;
    const timer = setInterval(() => {
        currentScore += increment;
        if (currentScore >= targetScore) {
            currentScore = targetScore;
            clearInterval(timer);
        }
        scoreElement.textContent = `${Math.round(currentScore)}%`;
    }, 50);
}

// Navigation
function showPage(pageId) {
    console.log('📄 Navigation vers:', pageId);
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
        console.log('✅ Page affichée:', pageId);
    } else {
        console.error('❌ Page non trouvée:', pageId);
    }
}

function goBack() {
    showPage('jobsPage');
}

function goBackToJobs() {
    showPage('jobsPage');
}

function logout() {
    console.log('👋 Déconnexion...');
    currentUser = null;
    currentJob = null;
    showPage('authPage');
    
    // Reset des formulaires
    const signinForm = document.getElementById('signinForm');
    const signupForm = document.getElementById('signupForm');
    if (signinForm) signinForm.reset();
    if (signupForm) signupForm.reset();
}

function downloadResult() {
    const scoreElement = document.getElementById('compatibilityScore');
    const analysisElement = document.getElementById('resultAnalysis');
    
    const score = scoreElement ? scoreElement.textContent : 'N/A';
    const analysis = analysisElement ? analysisElement.textContent : 'N/A';

    const resultData = `
Résultat de candidature - MonCandidat
=====================================

Poste: ${currentJob}
Score de compatibilité: ${score}

Analyse:
${analysis}

Date: ${new Date().toLocaleDateString()}
`;

    const blob = new Blob([resultData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resultat-candidature-${currentJob}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Fonction utilitaire pour gérer les erreurs réseau
function handleNetworkError(error) {
    console.error('❌ Erreur réseau:', error);
    
    if (error.name === 'AbortError') {
        return 'Timeout - Le serveur met trop de temps à répondre';
    }
    
    if (error.message.includes('Failed to fetch')) {
        return 'Impossible de contacter le serveur. Vérifiez votre connexion.';
    }
    
    return error.message || 'Erreur de connexion';
}