// Configuration
const apiOverride = new URLSearchParams(window.location.search).get('api');
const API_URLS = [...new Set([
    apiOverride,
    window.location.origin,
    'http://localhost:4000'
].filter(Boolean).map(url => url.replace(/\/$/, '')))];

async function apiFetch(path, options) {
    let lastError;

    for (const apiUrl of API_URLS) {
        try {
            const response = await fetch(`${apiUrl}${path}`, options);

            if (response.ok) {
                return response;
            }

            lastError = new Error(`Request failed with status ${response.status}`);
        } catch (error) {
            lastError = error;
        }
    }

    throw lastError || new Error('Request failed');
}

const questionBank = [
    {
        id: 'ds-easy-1',
        subject: 'Data Structures',
        difficulty: 'easy',
        text: 'Which data structure follows the Last In, First Out principle?',
        options: ['Queue', 'Stack', 'Graph', 'Hash table'],
        correct: 1,
        explanation: 'A stack removes the most recently inserted item first, so it follows LIFO.'
    },
    {
        id: 'ds-easy-2',
        subject: 'Data Structures',
        difficulty: 'easy',
        text: 'In a singly linked list, each node stores data and what else?',
        options: ['A pointer to the previous node', 'A pointer to the next node', 'The size of the list', 'A sorted index'],
        correct: 1,
        explanation: 'A singly linked list node has data and a reference to the next node.'
    },
    {
        id: 'ds-medium-1',
        subject: 'Data Structures',
        difficulty: 'medium',
        text: 'What is the average-case time complexity of search in a well-designed hash table?',
        options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
        correct: 0,
        explanation: 'With a good hash function and low collisions, hash table search is average-case O(1).'
    },
    {
        id: 'ds-medium-2',
        subject: 'Data Structures',
        difficulty: 'medium',
        text: 'Which traversal of a Binary Search Tree visits keys in sorted order?',
        options: ['Preorder', 'Inorder', 'Postorder', 'Level order'],
        correct: 1,
        explanation: 'Inorder traversal of a BST visits left subtree, root, then right subtree, producing sorted keys.'
    },
    {
        id: 'ds-hard-1',
        subject: 'Data Structures',
        difficulty: 'hard',
        text: 'For an AVL tree with n nodes, why is search guaranteed to be O(log n)?',
        options: ['Every node has exactly two children', 'The tree stores keys in an array', 'Height is kept logarithmic by rotations', 'All leaves are at the same depth'],
        correct: 2,
        explanation: 'AVL rotations maintain a strict height balance, keeping tree height O(log n).'
    },
    {
        id: 'algo-easy-1',
        subject: 'Algorithms',
        difficulty: 'easy',
        text: 'Which sorting algorithm repeatedly selects the minimum remaining element?',
        options: ['Bubble sort', 'Selection sort', 'Merge sort', 'Quick sort'],
        correct: 1,
        explanation: 'Selection sort repeatedly chooses the smallest item from the unsorted part.'
    },
    {
        id: 'algo-medium-1',
        subject: 'Algorithms',
        difficulty: 'medium',
        text: 'Dijkstra’s algorithm is mainly used to solve which problem?',
        options: ['Minimum spanning tree', 'Single-source shortest paths with non-negative weights', 'Topological sorting', 'String matching'],
        correct: 1,
        explanation: 'Dijkstra finds shortest paths from one source when edge weights are non-negative.'
    },
    {
        id: 'algo-medium-2',
        subject: 'Algorithms',
        difficulty: 'medium',
        text: 'Which technique is most suitable for the 0/1 knapsack problem?',
        options: ['Greedy by value only', 'Dynamic programming', 'Linear search', 'Breadth-first search'],
        correct: 1,
        explanation: '0/1 knapsack has overlapping subproblems and optimal substructure, making dynamic programming suitable.'
    },
    {
        id: 'algo-hard-1',
        subject: 'Algorithms',
        difficulty: 'hard',
        text: 'If merge sort divides an array into halves and merges in linear time, what recurrence describes it?',
        options: ['T(n)=T(n-1)+O(1)', 'T(n)=2T(n/2)+O(n)', 'T(n)=T(n/2)+O(1)', 'T(n)=nT(n/2)+O(n)'],
        correct: 1,
        explanation: 'Merge sort makes two half-size recursive calls and spends O(n) time merging.'
    },
    {
        id: 'dbms-easy-1',
        subject: 'DBMS',
        difficulty: 'easy',
        text: 'Which key uniquely identifies a row in a relational table?',
        options: ['Foreign key', 'Primary key', 'Candidate backup', 'Composite value'],
        correct: 1,
        explanation: 'A primary key uniquely identifies each row in a table.'
    },
    {
        id: 'dbms-medium-1',
        subject: 'DBMS',
        difficulty: 'medium',
        text: 'Which normal form removes partial dependency on a composite primary key?',
        options: ['1NF', '2NF', '3NF', 'BCNF'],
        correct: 1,
        explanation: '2NF requires every non-prime attribute to depend on the whole candidate key.'
    },
    {
        id: 'dbms-medium-2',
        subject: 'DBMS',
        difficulty: 'medium',
        text: 'In SQL, which clause groups rows before aggregate functions are applied?',
        options: ['WHERE', 'GROUP BY', 'ORDER BY', 'HAVING'],
        correct: 1,
        explanation: 'GROUP BY forms groups, then aggregate functions such as COUNT and AVG operate on each group.'
    },
    {
        id: 'dbms-hard-1',
        subject: 'DBMS',
        difficulty: 'hard',
        text: 'Which ACID property ensures a transaction moves the database from one valid state to another?',
        options: ['Atomicity', 'Consistency', 'Isolation', 'Durability'],
        correct: 1,
        explanation: 'Consistency preserves database rules and constraints before and after a transaction.'
    },
    {
        id: 'os-easy-1',
        subject: 'Operating Systems',
        difficulty: 'easy',
        text: 'Which OS component decides which ready process gets the CPU next?',
        options: ['Loader', 'Scheduler', 'Linker', 'File descriptor'],
        correct: 1,
        explanation: 'The CPU scheduler selects a process from the ready queue.'
    },
    {
        id: 'os-medium-1',
        subject: 'Operating Systems',
        difficulty: 'medium',
        text: 'A deadlock requires mutual exclusion, hold and wait, no preemption, and what fourth condition?',
        options: ['Circular wait', 'Paging', 'Context switching', 'Spooling'],
        correct: 0,
        explanation: 'Circular wait is the fourth Coffman condition for deadlock.'
    },
    {
        id: 'os-hard-1',
        subject: 'Operating Systems',
        difficulty: 'hard',
        text: 'What does Belady’s anomaly show in page replacement?',
        options: ['FIFO can have more page faults with more frames', 'LRU always performs worse than FIFO', 'Paging cannot use virtual memory', 'Segmentation removes fragmentation'],
        correct: 0,
        explanation: 'Belady’s anomaly shows FIFO may produce more page faults when frame count increases.'
    },
    {
        id: 'cn-easy-1',
        subject: 'Computer Networks',
        difficulty: 'easy',
        text: 'Which layer of the OSI model is responsible for routing packets between networks?',
        options: ['Data link', 'Network', 'Session', 'Application'],
        correct: 1,
        explanation: 'The network layer handles logical addressing and routing.'
    },
    {
        id: 'cn-medium-1',
        subject: 'Computer Networks',
        difficulty: 'medium',
        text: 'What is the main purpose of TCP’s three-way handshake?',
        options: ['Compress payload data', 'Establish a reliable connection', 'Resolve domain names', 'Encrypt packets'],
        correct: 1,
        explanation: 'The handshake synchronizes sequence numbers and establishes a TCP connection.'
    },
    {
        id: 'cn-hard-1',
        subject: 'Computer Networks',
        difficulty: 'hard',
        text: 'Which mechanism helps TCP reduce its sending rate after detecting congestion?',
        options: ['Slow start and congestion avoidance', 'ARP broadcast', 'DNS recursion', 'Parity checking'],
        correct: 0,
        explanation: 'TCP congestion control uses slow start, congestion avoidance, and related mechanisms.'
    },
    {
        id: 'oop-easy-1',
        subject: 'OOP',
        difficulty: 'easy',
        text: 'Which OOP concept binds data and methods together inside a class?',
        options: ['Inheritance', 'Encapsulation', 'Polymorphism', 'Recursion'],
        correct: 1,
        explanation: 'Encapsulation keeps state and related behavior together behind a class interface.'
    },
    {
        id: 'oop-medium-1',
        subject: 'OOP',
        difficulty: 'medium',
        text: 'Method overloading is an example of which kind of polymorphism?',
        options: ['Runtime polymorphism', 'Compile-time polymorphism', 'Parametric isolation', 'Data hiding'],
        correct: 1,
        explanation: 'Overloading is resolved at compile time based on method signatures.'
    },
    {
        id: 'oop-hard-1',
        subject: 'OOP',
        difficulty: 'hard',
        text: 'Why should high-level modules depend on abstractions rather than concrete classes?',
        options: ['To increase coupling', 'To satisfy dependency inversion', 'To prevent inheritance', 'To remove all interfaces'],
        correct: 1,
        explanation: 'Dependency inversion reduces coupling by making high-level logic depend on abstractions.'
    },
    {
        id: 'se-medium-1',
        subject: 'Software Engineering',
        difficulty: 'medium',
        text: 'In SDLC, which activity checks whether the software meets specified requirements?',
        options: ['Validation', 'Compilation', 'Indexing', 'Serialization'],
        correct: 0,
        explanation: 'Validation checks whether the built software satisfies user and requirement expectations.'
    },
    {
        id: 'se-hard-1',
        subject: 'Software Engineering',
        difficulty: 'hard',
        text: 'Which testing strategy focuses on internal code paths and branch coverage?',
        options: ['Black-box testing', 'White-box testing', 'Acceptance testing', 'Usability testing'],
        correct: 1,
        explanation: 'White-box testing uses knowledge of internal implementation, including paths and branches.'
    }
];

const difficultyOrder = ['easy', 'medium', 'hard'];
const difficultyLabels = {
    easy: 'Easy',
    medium: 'Medium',
    hard: 'Hard'
};

let appState = {
    userName: '',
    stats: {
        totalQuestions: 0,
        correctAnswers: 0,
        currentDifficulty: 'medium',
        accuracy: 0,
        streak: 0,
        totalTime: 0,
        lastSuggestion: ''
    },
    selectedSubject: 'all',
    attempts: [],
    quiz: {
        questions: [],
        currentQuestionIndex: 0,
        selectedAnswer: null,
        isAnswered: false,
        startTime: null,
        nextDifficulty: null
    }
};

function getSubjects() {
    return [...new Set(questionBank.map(question => question.subject))].sort();
}

function getSubjectLabel(value) {
    return value === 'all' ? 'All CSE topics' : value;
}

function normalizeDifficulty(value) {
    return difficultyOrder.includes(value) ? value : 'medium';
}

function getFilteredQuestions(difficulty = appState.stats.currentDifficulty) {
    return questionBank.filter(question => {
        const subjectMatches = appState.selectedSubject === 'all' || question.subject === appState.selectedSubject;
        return subjectMatches && question.difficulty === difficulty;
    });
}

function buildQuizQuestions() {
    const primary = getFilteredQuestions(appState.stats.currentDifficulty);
    const fallback = questionBank.filter(question => {
        return appState.selectedSubject === 'all' || question.subject === appState.selectedSubject;
    });

    return (primary.length ? primary : fallback).slice();
}

function showPage(pageName) {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.getElementById(pageName).classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function goHome() {
    showPage(appState.userName ? 'dashboard-page' : 'landing-page');
}

function requireLogin(pageName) {
    if (!appState.userName) {
        showPage('landing-page');
        focusLogin();
        return;
    }

    if (pageName === 'review-page') {
        renderAttempts('review-list', appState.attempts);
    }

    showPage(pageName);
}

function focusLogin() {
    document.getElementById('username').focus();
}

function showQuestionPreview() {
    document.getElementById('subject-preview').scrollIntoView({ behavior: 'smooth' });
}

async function handleLogin(event) {
    event.preventDefault();

    const usernameInput = document.getElementById('username');
    const loginStatus = document.getElementById('login-status');
    const loginButton = document.getElementById('login-btn');
    const username = usernameInput.value.trim();

    if (!username) {
        return false;
    }

    loginButton.disabled = true;
    loginStatus.textContent = 'Checking backend login...';

    try {
        const response = await apiFetch('/user/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username })
        });

        const result = await response.json();
        const loggedInUser = result.user?.username || username;

        appState.userName = loggedInUser;
        usernameInput.value = '';
        loginStatus.textContent = '';
        updateSessionUI();
        updateDashboard();
        showPage('dashboard-page');
    } catch (error) {
        console.error('Error logging in:', error);
        loginStatus.textContent = 'Could not log in. Make sure the backend is running.';
    } finally {
        loginButton.disabled = false;
    }

    return false;
}

function logout() {
    appState.userName = '';
    appState.attempts = [];
    appState.stats = {
        totalQuestions: 0,
        correctAnswers: 0,
        currentDifficulty: 'medium',
        accuracy: 0,
        streak: 0,
        totalTime: 0,
        lastSuggestion: ''
    };
    appState.selectedSubject = 'all';
    document.getElementById('subject-select').value = 'all';
    document.getElementById('difficulty-select').value = 'medium';
    updateSessionUI();
    updateDashboard();
    showPage('landing-page');
}

function updateSessionUI() {
    document.getElementById('nav-user').textContent = appState.userName || 'Guest';
    document.getElementById('nav-logout').hidden = !appState.userName;
    document.getElementById('display-name').textContent = appState.userName;
}

function updateDashboard() {
    const stats = appState.stats;
    const averageTime = stats.totalQuestions ? Math.round(stats.totalTime / stats.totalQuestions) : 0;
    const currentQuestions = getFilteredQuestions(stats.currentDifficulty);

    document.getElementById('total-questions').textContent = stats.totalQuestions;
    document.getElementById('correct-answers').textContent = stats.correctAnswers;
    document.getElementById('accuracy').textContent = `${stats.accuracy}%`;
    document.getElementById('current-level').textContent = stats.currentDifficulty.toUpperCase();
    document.getElementById('selected-topic').textContent = getSubjectLabel(appState.selectedSubject);
    document.getElementById('average-time').textContent = `${averageTime}s`;
    document.getElementById('streak-label').textContent = `${stats.streak} streak`;
    document.getElementById('last-suggestion').textContent = stats.lastSuggestion || 'Not available yet';
    document.getElementById('question-bank-count').textContent = `${currentQuestions.length || buildQuizQuestions().length} questions ready`;
    document.getElementById('difficulty-select').value = stats.currentDifficulty;
    renderAttempts('recent-attempts', appState.attempts.slice(0, 5));
    renderAttempts('review-list', appState.attempts);
}

function setSubject() {
    appState.selectedSubject = document.getElementById('subject-select').value;
    updateDashboard();
}

function setStartingDifficulty() {
    appState.stats.currentDifficulty = normalizeDifficulty(document.getElementById('difficulty-select').value);
    updateDashboard();
}

function resetProgress() {
    appState.stats.totalQuestions = 0;
    appState.stats.correctAnswers = 0;
    appState.stats.accuracy = 0;
    appState.stats.streak = 0;
    appState.stats.totalTime = 0;
    appState.stats.lastSuggestion = '';
    appState.attempts = [];
    updateDashboard();
}

function startQuiz() {
    if (!appState.userName) {
        requireLogin('dashboard-page');
        return;
    }

    const quizQuestions = buildQuizQuestions();

    if (!quizQuestions.length) {
        alert('No questions available for this selection.');
        return;
    }

    appState.quiz = {
        questions: quizQuestions,
        currentQuestionIndex: 0,
        selectedAnswer: null,
        isAnswered: false,
        startTime: Date.now(),
        nextDifficulty: null
    };

    loadQuestion();
    showPage('quiz-page');
}

function loadQuestion() {
    const currentQuestion = getCurrentQuestion();

    if (!currentQuestion) {
        backToDashboard();
        return;
    }

    const progress = ((appState.quiz.currentQuestionIndex + 1) / appState.quiz.questions.length) * 100;

    document.getElementById('question-number').textContent = appState.quiz.currentQuestionIndex + 1;
    document.getElementById('quiz-level').textContent = currentQuestion.difficulty.toUpperCase();
    document.getElementById('quiz-subject').textContent = currentQuestion.subject;
    document.getElementById('question-topic').textContent = `${currentQuestion.subject} · ${difficultyLabels[currentQuestion.difficulty]}`;
    document.getElementById('quiz-progress-label').textContent = `${appState.quiz.currentQuestionIndex + 1} / ${appState.quiz.questions.length}`;
    document.getElementById('quiz-progress').style.width = `${progress}%`;
    document.getElementById('question-text').textContent = currentQuestion.text;

    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = '';

    currentQuestion.options.forEach((option, index) => {
        const optionButton = document.createElement('button');
        optionButton.className = 'option';
        optionButton.type = 'button';
        optionButton.textContent = option;
        optionButton.onclick = () => selectOption(index);
        optionsContainer.appendChild(optionButton);
    });

    appState.quiz.selectedAnswer = null;
    appState.quiz.isAnswered = false;
    appState.quiz.nextDifficulty = null;
    appState.quiz.startTime = Date.now();

    document.getElementById('result-box').hidden = true;
    document.getElementById('submit-btn').hidden = false;
    document.getElementById('next-btn').hidden = true;
}

function getCurrentQuestion() {
    return appState.quiz.questions[appState.quiz.currentQuestionIndex];
}

function selectOption(index) {
    if (appState.quiz.isAnswered) return;

    appState.quiz.selectedAnswer = index;

    document.querySelectorAll('.option').forEach((option, optionIndex) => {
        option.classList.toggle('selected', optionIndex === index);
    });
}

async function submitAnswer() {
    if (appState.quiz.selectedAnswer === null) {
        alert('Please select an answer');
        return;
    }

    const currentQuestion = getCurrentQuestion();
    const selectedAnswer = appState.quiz.selectedAnswer;
    const isCorrect = selectedAnswer === currentQuestion.correct;
    const timeTaken = Math.max(1, Math.round((Date.now() - appState.quiz.startTime) / 1000));

    appState.stats.totalQuestions++;
    appState.stats.totalTime += timeTaken;
    appState.stats.streak = isCorrect ? appState.stats.streak + 1 : 0;

    if (isCorrect) {
        appState.stats.correctAnswers++;
    }

    appState.stats.accuracy = Math.round((appState.stats.correctAnswers / appState.stats.totalQuestions) * 100);

    try {
        const response = await apiFetch('/question/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                isCorrect,
                timeTaken,
                attempts: appState.stats.totalQuestions,
                pastAccuracy: appState.stats.accuracy / 100
            })
        });

        const result = await response.json();
        appState.quiz.nextDifficulty = normalizeDifficulty(result.nextDifficulty);
    } catch (error) {
        console.error('Error calling ML service:', error);
        appState.quiz.nextDifficulty = appState.stats.currentDifficulty;
    }

    appState.stats.currentDifficulty = appState.quiz.nextDifficulty;
    appState.stats.lastSuggestion = `${difficultyLabels[appState.quiz.nextDifficulty]} after this attempt`;

    appState.attempts.unshift({
        question: currentQuestion.text,
        subject: currentQuestion.subject,
        difficulty: currentQuestion.difficulty,
        selected: currentQuestion.options[selectedAnswer],
        correct: currentQuestion.options[currentQuestion.correct],
        isCorrect,
        timeTaken,
        nextDifficulty: appState.quiz.nextDifficulty,
        explanation: currentQuestion.explanation
    });

    showResult(isCorrect, currentQuestion, timeTaken);
    appState.quiz.isAnswered = true;
    updateDashboard();
}

function showResult(isCorrect, currentQuestion, timeTaken) {
    const resultBox = document.getElementById('result-box');
    const resultMessage = document.getElementById('result-message');
    const explanation = document.getElementById('answer-explanation');
    const nextDifficulty = document.getElementById('next-difficulty');

    document.querySelectorAll('.option').forEach((option, index) => {
        option.classList.remove('selected');
        option.disabled = true;

        if (index === currentQuestion.correct) {
            option.classList.add('correct');
        }

        if (index === appState.quiz.selectedAnswer && index !== currentQuestion.correct) {
            option.classList.add('incorrect');
        }
    });

    resultMessage.textContent = isCorrect ? 'Correct answer' : 'Needs revision';
    resultMessage.className = isCorrect ? 'correct-text' : 'incorrect-text';
    explanation.textContent = currentQuestion.explanation;
    nextDifficulty.textContent = `Time: ${timeTaken}s · Backend suggested next level: ${difficultyLabels[appState.quiz.nextDifficulty]}`;

    resultBox.hidden = false;
    document.getElementById('submit-btn').hidden = true;
    document.getElementById('next-btn').hidden = false;
}

function nextQuestion() {
    if (appState.quiz.currentQuestionIndex < appState.quiz.questions.length - 1) {
        appState.quiz.currentQuestionIndex++;

        const nextSet = getFilteredQuestions(appState.stats.currentDifficulty);
        const nextCandidate = nextSet.find(question => {
            return !appState.quiz.questions
                .slice(0, appState.quiz.currentQuestionIndex)
                .some(usedQuestion => usedQuestion.id === question.id);
        });

        if (nextCandidate) {
            appState.quiz.questions[appState.quiz.currentQuestionIndex] = nextCandidate;
        }

        loadQuestion();
    } else {
        backToDashboard();
    }
}

function backToDashboard() {
    updateDashboard();
    showPage('dashboard-page');
}

function renderAttempts(containerId, attempts) {
    const container = document.getElementById(containerId);

    if (!container) return;

    if (!attempts.length) {
        container.className = 'attempt-list empty-state';
        container.textContent = containerId === 'recent-attempts' ? 'No attempts yet.' : 'No attempts to review yet.';
        return;
    }

    container.className = 'attempt-list';
    container.innerHTML = attempts.map((attempt, index) => `
        <article class="attempt-item">
            <div>
                <strong>${index + 1}. ${attempt.subject}</strong>
                <p>${attempt.question}</p>
                <small>${difficultyLabels[attempt.difficulty]} · ${attempt.timeTaken}s · next ${difficultyLabels[attempt.nextDifficulty]}</small>
            </div>
            <span class="${attempt.isCorrect ? 'badge badge-correct' : 'badge badge-wrong'}">
                ${attempt.isCorrect ? 'Correct' : 'Review'}
            </span>
        </article>
    `).join('');
}

function renderSubjects() {
    const subjects = getSubjects();
    const subjectSelect = document.getElementById('subject-select');
    const subjectPreview = document.getElementById('subject-preview');

    subjects.forEach(subject => {
        const option = document.createElement('option');
        option.value = subject;
        option.textContent = subject;
        subjectSelect.appendChild(option);
    });

    subjectPreview.innerHTML = subjects.map(subject => {
        const count = questionBank.filter(question => question.subject === subject).length;
        return `
            <article class="subject-card">
                <h3>${subject}</h3>
                <p>${count} adaptive MCQs across easy, medium, and hard levels.</p>
            </article>
        `;
    }).join('');

    document.getElementById('landing-question-count').textContent = questionBank.length;
    document.getElementById('landing-subject-count').textContent = subjects.length;
}

document.addEventListener('DOMContentLoaded', () => {
    renderSubjects();
    updateSessionUI();
    updateDashboard();
    showPage('landing-page');
});
