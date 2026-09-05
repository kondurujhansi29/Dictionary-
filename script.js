const defaultDictionary = {
    computer: {
        meaning: 'An electronic device used to process data and perform tasks.',
        category: 'Technology',
        difficulty: 'Beginner',
        synonyms: ['device', 'machine', 'system'],
        example: 'The computer processed the report in minutes.',
        tip: 'Use it when talking about digital tools or devices.'
    },
    java: {
        meaning: 'A high-level programming language commonly used for web and enterprise software.',
        category: 'Technology',
        difficulty: 'Intermediate',
        synonyms: ['language', 'platform'],
        example: 'Java is often used to build scalable backend systems.',
        tip: 'This word is especially useful in technology and software contexts.'
    },
    array: {
        meaning: 'A collection of values stored in a structured order.',
        category: 'Technology',
        difficulty: 'Intermediate',
        synonyms: ['list', 'collection', 'sequence'],
        example: 'The array stored all the values before processing them.',
        tip: 'Think of it as a numbered list used in programming.'
    },
    algorithm: {
        meaning: 'A step-by-step procedure for solving a problem or completing a task.',
        category: 'Science',
        difficulty: 'Intermediate',
        synonyms: ['procedure', 'method', 'formula'],
        example: 'The algorithm sorted the data efficiently.',
        tip: 'A useful word in math, science, and programming.'
    },
    database: {
        meaning: 'An organized system for storing and managing information.',
        category: 'Technology',
        difficulty: 'Beginner',
        synonyms: ['repository', 'storehouse', 'records'],
        example: 'The company keeps customer records in a secure database.',
        tip: 'Good word for business, software, and digital systems.'
    },
    internet: {
        meaning: 'A global network that connects computers and devices around the world.',
        category: 'Technology',
        difficulty: 'Beginner',
        synonyms: ['web', 'network', 'online'],
        example: 'People use the internet to communicate and access information.',
        tip: 'Use it when discussing online communication or global connectivity.'
    },
    creativity: {
        meaning: 'The ability to imagine new ideas or approaches and turn them into something original.',
        category: 'Education',
        difficulty: 'Beginner',
        synonyms: ['imagination', 'innovation', 'originality'],
        example: 'Creativity helps teams solve problems in fresh ways.',
        tip: 'It is a strong word for art, design, and business strategy.'
    },
    resilience: {
        meaning: 'The ability to recover quickly from difficulty or adapt under pressure.',
        category: 'Lifestyle',
        difficulty: 'Intermediate',
        synonyms: ['strength', 'endurance', 'adaptability'],
        example: 'Her resilience helped the team stay focused during the challenge.',
        tip: 'Use it to describe emotional or professional toughness.'
    }
};

let dictionary = JSON.parse(JSON.stringify(defaultDictionary));

document.addEventListener('DOMContentLoaded', function () {
    loadDictionary();
    setupEventListeners();
    renderQuickSuggestions();
    updateStats();
    renderWordOfTheDay();
    displayAllWords();
});

function normalizeWord(word) {
    return String(word || '').trim().toLowerCase();
}

function getEntry(word) {
    const key = normalizeWord(word);
    const entry = dictionary[key];
    if (!entry) return null;

    if (typeof entry === 'string') {
        return {
            meaning: entry,
            category: 'General',
            difficulty: 'Beginner',
            synonyms: [],
            example: 'A clear example will appear here when you add one.',
            tip: 'Add a custom example to build your memory.'
        };
    }

    return entry;
}

function setupEventListeners() {
    document.querySelectorAll('.nav-btn').forEach((btn) => {
        btn.addEventListener('click', handleNavigation);
    });

    document.getElementById('heroSearchBtn').addEventListener('click', searchFromHome);
    document.getElementById('heroSearchInput').addEventListener('keypress', function (e) {
        if (e.key === 'Enter') searchFromHome();
    });

    document.getElementById('closeResultBtn').addEventListener('click', closeResultCard);

    document.getElementById('searchBtn').addEventListener('click', searchWord);
    document.getElementById('searchInput').addEventListener('keypress', function (e) {
        if (e.key === 'Enter') searchWord();
    });

    document.getElementById('addWordForm').addEventListener('submit', handleAddWord);
    document.getElementById('filterInput').addEventListener('keyup', filterWords);
    document.getElementById('wordOfDaySpeak').addEventListener('click', () => speakWord(document.getElementById('wordOfDay').textContent));

    document.getElementById('quickSuggestions').addEventListener('click', function (event) {
        const suggestion = event.target.closest('.suggestion-chip');
        if (!suggestion) return;
        const value = suggestion.dataset.word;
        if (value) {
            document.getElementById('heroSearchInput').value = value;
            displaySearchResult(value);
        }
    });

    document.addEventListener('click', function (event) {
        const speakBtn = event.target.closest('.speak-btn');
        if (speakBtn) {
            const word = speakBtn.dataset.word;
            if (word) speakWord(word);
        }
    });
}

function handleNavigation(event) {
    const pageName = event.currentTarget.dataset.page;

    document.querySelectorAll('.nav-btn').forEach((button) => {
        button.classList.toggle('active', button === event.currentTarget);
    });

    document.querySelectorAll('.page').forEach((page) => {
        page.classList.toggle('active', page.id === pageName);
    });

    if (pageName === 'all') {
        displayAllWords();
    }
}

function renderQuickSuggestions() {
    const container = document.getElementById('quickSuggestions');
    const words = Object.keys(dictionary).slice(0, 6);
    container.innerHTML = words.map((word) => `
        <button class="suggestion-chip" data-word="${word}" type="button">${capitalize(word)}</button>
    `).join('');
}

function searchFromHome() {
    const word = normalizeWord(document.getElementById('heroSearchInput').value);

    if (!word) {
        showMessage('Please enter a word to search.', 'error', document.getElementById('messageBox'));
        return;
    }

    displaySearchResult(word);
}

function searchWord() {
    const word = normalizeWord(document.getElementById('searchInput').value);

    if (!word) {
        showMessage('Please enter a word to search.', 'error', document.getElementById('messageBox'));
        return;
    }

    const resultContent = document.getElementById('searchResultContent');
    const entry = getEntry(word);

    if (entry) {
        resultContent.innerHTML = buildResultMarkup(word, entry, true);
    } else {
        resultContent.innerHTML = `
            <div class="not-found-box">
                <h3>Word not found</h3>
                <p>"${capitalize(word)}" is not in the current dictionary. You can add it from the Add Word page.</p>
                <button class="tiny-btn" onclick="document.querySelector('.nav-btn[data-page=\'add\']').click();">Add this word</button>
            </div>
        `;
    }
}

function displaySearchResult(word) {
    const resultCard = document.getElementById('resultCard');
    const resultContent = document.getElementById('resultContent');
    const entry = getEntry(word);

    if (entry) {
        resultContent.innerHTML = buildResultMarkup(word, entry, false);
        resultCard.classList.remove('hidden');
    } else {
        resultContent.innerHTML = `
            <div class="not-found-box compact-box">
                <h3>Not found</h3>
                <p>"${capitalize(word)}" is not in the dictionary yet.</p>
            </div>
        `;
        resultCard.classList.remove('hidden');
    }

    document.getElementById('heroSearchInput').value = '';
}

function buildResultMarkup(word, entry, fullWidth) {
    const category = entry.category || 'General';
    const difficulty = entry.difficulty || 'Beginner';
    const synonyms = Array.isArray(entry.synonyms) && entry.synonyms.length ? entry.synonyms : ['insight', 'knowledge'];
    const example = entry.example || 'Example text will appear here.';
    const tip = entry.tip || 'Practice this word in daily conversation.';
    const aiInsight = generateAiInsight(word, entry);

    return `
        <div class="result-header ${fullWidth ? 'big-header' : ''}">
            <div>
                <span class="result-category">${category}</span>
                <h3>${capitalize(word)}</h3>
            </div>
            <button class="speak-btn" type="button" data-word="${word}">🔊 Speak</button>
        </div>
        <p class="result-meaning">${entry.meaning}</p>
        <div class="meta-grid">
            <div><span>Difficulty</span><strong>${difficulty}</strong></div>
            <div><span>Synonyms</span><strong>${synonyms.slice(0, 2).join(', ')}</strong></div>
        </div>
        <div class="insight-card">
            <h4>AI insight</h4>
            <p>${aiInsight}</p>
        </div>
        <div class="mini-grid">
            <div class="mini-panel">
                <h5>Example</h5>
                <p>“${example}”</p>
            </div>
            <div class="mini-panel">
                <h5>Memory tip</h5>
                <p>${tip}</p>
            </div>
        </div>
    `;
}

function generateAiInsight(word, entry) {
    const difficulty = entry.difficulty || 'Beginner';
    const category = entry.category || 'General';
    const action = difficulty === 'Beginner' ? 'easy to remember' : difficulty === 'Intermediate' ? 'worth revisiting often' : 'best learned with repeated practice';
    return `“${capitalize(word)}” fits best in a ${category.toLowerCase()} context and is ${action}. Try using it in a sentence to improve recall.`;
}

function closeResultCard() {
    document.getElementById('resultCard').classList.add('hidden');
}

function handleAddWord(event) {
    event.preventDefault();

    const wordInput = document.getElementById('wordInput');
    const meaningInput = document.getElementById('meaningInput');
    const categoryInput = document.getElementById('categoryInput');
    const exampleInput = document.getElementById('exampleInput');
    const messageBox = document.getElementById('messageBox');

    const word = normalizeWord(wordInput.value);
    const meaning = meaningInput.value.trim();
    const category = categoryInput.value;
    const example = exampleInput.value.trim() || 'A strong example will make this word easier to remember.';

    if (!word || !meaning) {
        showMessage('Please fill in the word and meaning.', 'error', messageBox);
        return;
    }

    if (dictionary[word]) {
        showMessage('This word already exists in the dictionary.', 'error', messageBox);
        return;
    }

    dictionary[word] = {
        meaning,
        category,
        difficulty: 'Beginner',
        synonyms: [],
        example,
        tip: 'This is a custom word you added to your personal vocabulary list.'
    };

    saveDictionary();
    updateStats();
    renderQuickSuggestions();
    displayAllWords();
    showMessage('Word added successfully!', 'success', messageBox);
    document.getElementById('addWordForm').reset();
}

function showMessage(message, type, messageBox) {
    messageBox.textContent = message;
    messageBox.className = `message-box ${type}`;

    setTimeout(() => {
        messageBox.className = 'message-box';
    }, 2600);
}

function displayAllWords() {
    const wordsContainer = document.getElementById('wordsContainer');
    const words = Object.keys(dictionary).sort();

    if (!words.length) {
        wordsContainer.innerHTML = '<div class="empty-state">No words yet. Start by adding your first one.</div>';
        return;
    }

    const isDefault = (word) => defaultDictionary[word] !== undefined;

    wordsContainer.innerHTML = words.map((word) => {
        const entry = getEntry(word);
        const badgeClass = isDefault(word) ? 'default-badge' : 'custom-badge';
        const badgeText = isDefault(word) ? 'Default' : 'Custom';
        const cardClass = isDefault(word) ? 'default-card' : 'custom-card';
        const actions = isDefault(word) ? '' : `
            <div class="word-actions">
                <button class="delete-btn" type="button" onclick="deleteWord('${word}')">Delete</button>
            </div>
        `;

        return `
            <article class="word-card ${cardClass}">
                <span class="word-badge ${badgeClass}">${badgeText}</span>
                <h3 class="word-title">${capitalize(word)}</h3>
                <div class="word-meta">
                    <span>${entry.category}</span>
                    <span>${entry.difficulty}</span>
                </div>
                <p class="word-meaning">${entry.meaning}</p>
                ${actions}
            </article>
        `;
    }).join('');
}

function deleteWord(word) {
    if (!confirm(`Delete "${capitalize(word)}" from your personal library?`)) return;

    delete dictionary[word];
    saveDictionary();
    updateStats();
    renderQuickSuggestions();
    displayAllWords();
    alert('Word deleted successfully.');
}

function filterWords() {
    const filterInput = normalizeWord(document.getElementById('filterInput').value);
    const wordCards = document.querySelectorAll('.word-card');

    wordCards.forEach((card) => {
        const text = card.querySelector('.word-title').textContent.toLowerCase();
        card.style.display = text.includes(filterInput) ? 'block' : 'none';
    });
}

function saveDictionary() {
    const userWords = {};

    Object.keys(dictionary).forEach((word) => {
        if (!defaultDictionary[word]) {
            userWords[word] = dictionary[word];
        }
    });

    localStorage.setItem('lexiAiDictionary', JSON.stringify(userWords));
}

function loadDictionary() {
    const saved = localStorage.getItem('lexiAiDictionary');

    if (!saved) return;

    try {
        const parsed = JSON.parse(saved);
        Object.keys(parsed).forEach((word) => {
            dictionary[word] = parsed[word];
        });
    } catch (error) {
        console.error('Could not load saved dictionary:', error);
    }
}

function updateStats() {
    const totalCount = Object.keys(dictionary).length;
    const userCount = Object.keys(dictionary).filter((word) => !defaultDictionary[word]).length;

    document.getElementById('totalWordsCount').textContent = totalCount;
    document.getElementById('userWordsCount').textContent = userCount;
    document.getElementById('miniTotalWords').textContent = totalCount;
    document.getElementById('miniUserWords').textContent = userCount;
    document.getElementById('learningScore').textContent = `${Math.min(99, 78 + userCount)}%`;
    document.getElementById('smartMatches').textContent = Math.max(12, totalCount + 10);
}

function renderWordOfTheDay() {
    const words = Object.keys(dictionary);
    const selectedWord = words[Math.floor(Math.random() * words.length)] || 'algorithm';
    const entry = getEntry(selectedWord);

    document.getElementById('wordOfDay').textContent = capitalize(selectedWord);
    document.getElementById('wordOfDayMeaning').textContent = entry.meaning;
}

function capitalize(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

function speakWord(word) {
    const speech = window.speechSynthesis;
    if (!speech || !word) return;

    speech.cancel();
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.lang = 'en-US';
    speech.speak(utterance);
}

document.addEventListener('keydown', function (event) {
    if (event.ctrlKey && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        document.getElementById('heroSearchInput').focus();
    }
});
