document.addEventListener('DOMContentLoaded', () => {
    // Corrigido: `startQuiztn` para `startQuizBtn`
    const startScreen = document.getElementById('start-screen');
    const quizScreen = document.getElementById('quiz-screen');
    const startQuizBtn = document.getElementById('start-quiz-btn');
    const questionText = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options-container');
    const nextQuestionBtn = document.getElementById('next-question-btn');
    const submitQuizBtn = document.getElementById('submit-quiz-btn');
    const resultModal = document.getElementById('result-modal');
    const resultTitle = document.getElementById('result-title');
    const resultImage = document.getElementById('result-image');
    // Adicionado: Variável para a descrição do resultado
    const resultDescription = document.getElementById('result-description');
    // Adicionado: Variável para o botão de reiniciar
    const restartQuizBtn = document.getElementById('restart-quiz-btn');
    const messageBox = document.getElementById('message-box');
    const messageText = document.getElementById('message-text');
    const closeMessageBtn = document.getElementById('close-message-btn');

    // Ignorado: Estruturas de dados `quizData` e `results`
    const quizData = [
        {
            question: "What is your Current Life most Like?",
            options: [
                { text: "Relaxed, Quotidian and Safe",
                    scores: { Irae: , Luxuriae: , Superbiae: , Gulae: , Pigritiae: , Morositatis: , Invidiae:  } }
                { text: "Tense, Chaotic and Rushed",
                    scores: { Irae: , Luxuriae: , Superbiae: , Gulae: , Pigritiae: , Morositatis: , Invidiae:  } }
                { text: "Dull, Repetitive and Hopeless",
                    scores: { Irae: , Luxuriae: , Superbiae: , Gulae: , Pigritiae: , Morositatis: , Invidiae:  } }
                { text: "Frustrating, Cruel and Hateful",
                    scores: { Irae: , Luxuriae: , Superbiae: , Gulae: , Pigritiae: , Morositatis: , Invidiae:  } }
                { text: "Risky, Rewarding and Dangerous ",
                    scores: { Irae: , Luxuriae: , Superbiae: , Gulae: , Pigritiae: , Morositatis: , Invidiae:  } }
            ]
        },
        {
            question: "What do you Currently Think of your own Family?",
            options: [
                { text: "Well-meaning People who want the Best for me",
                    scores: { Irae: , Luxuriae: , Superbiae: , Gulae: , Pigritiae: , Morositatis: , Invidiae:  } }
                { text: "Apathetic Slobs who Would Rather Indulge than doing anything else",
                    scores: { Irae: , Luxuriae: , Superbiae: , Gulae: , Pigritiae: , Morositatis: , Invidiae:  } }
                { text: "Incompetent Dolts that can't Think Outside of their Own Little World",
                    scores: { Irae: , Luxuriae: , Superbiae: , Gulae: , Pigritiae: , Morositatis: , Invidiae:  } }
                { text: "Restrictive Chains that Keep me Away from what I Want",
                    scores: { Irae: , Luxuriae: , Superbiae: , Gulae: , Pigritiae: , Morositatis: , Invidiae:  } }
                { text: "Manipulative Opportunists who take Advantage of me to Live more Comfortably",
                    scores: { Irae: , Luxuriae: , Superbiae: , Gulae: , Pigritiae: , Morositatis: , Invidiae:  } }
            ]
        },
        {
            question: "You're in a Group Project and There are Multiple Conflicting Ideas on what should be Done. What do you Do?",
            options: [
                { text: "Try to Reach a Consensus between Every Proposed Idea",
                    scores: { Irae: , Luxuriae: , Superbiae: , Gulae: , Pigritiae: , Morositatis: , Invidiae:  } }
                { text: "Pick an Idea from Someone Else and Add to It",
                    scores: { Irae: , Luxuriae: , Superbiae: , Gulae: , Pigritiae: , Morositatis: , Invidiae:  } }
                { text: "Defend your Own Idea and Convince the Others to Choose It",
                    scores: { Irae: , Luxuriae: , Superbiae: , Gulae: , Pigritiae: , Morositatis: , Invidiae:  } }
                { text: "Void your Own Idea and Agency in the Debate",
                    scores: { Irae: , Luxuriae: , Superbiae: , Gulae: , Pigritiae: , Morositatis: , Invidiae:  } }
                { text: "Wait until The Debate Settles Down into a Decisive Choice of the Ideas",
                    scores: { Irae: , Luxuriae: , Superbiae: , Gulae: , Pigritiae: , Morositatis: , Invidiae:  } }
            ]
        },
        {
            question: "You are Confronted by an Armed Mugger at Night on the Street. What would you do?",
            options: [
                { text: "Comply with their Requests",
                    scores: { Irae: , Luxuriae: , Superbiae: , Gulae: , Pigritiae: , Morositatis: , Invidiae:  } }
                { text: "Look for an Opening to Fight Back",
                    scores: { Irae: , Luxuriae: , Superbiae: , Gulae: , Pigritiae: , Morositatis: , Invidiae:  } }
                { text: "Negotiate or Talk with the Mugger",
                    scores: { Irae: , Luxuriae: , Superbiae: , Gulae: , Pigritiae: , Morositatis: , Invidiae:  } }
                { text: "Run Away",
                    scores: { Irae: , Luxuriae: , Superbiae: , Gulae: , Pigritiae: , Morositatis: , Invidiae:  } }
                { text: "Buy Time until Someone Comes",
                    scores: { Irae: , Luxuriae: , Superbiae: , Gulae: , Pigritiae: , Morositatis: , Invidiae:  } }
            ]
        },
        {
            question: "When you're Struggling with doing Something, like Homework or a Project, what is generally your First Instinct?",
            options: [
                { text: "Take a Break and Come Back Later",
                    scores: { Irae: , Luxuriae: , Superbiae: , Gulae: , Pigritiae: , Morositatis: , Invidiae:  } }
                { text: "Look for Help or Assitance",
                    scores: { Irae: , Luxuriae: , Superbiae: , Gulae: , Pigritiae: , Morositatis: , Invidiae:  } }
                { text: "Go do Something Else",
                    scores: { Irae: , Luxuriae: , Superbiae: , Gulae: , Pigritiae: , Morositatis: , Invidiae:  } }
                { text: "Keep Trying",
                    scores: { Irae: , Luxuriae: , Superbiae: , Gulae: , Pigritiae: , Morositatis: , Invidiae:  } }
                { text: "Find a Different Approach",
                    scores: { Irae: , Luxuriae: , Superbiae: , Gulae: , Pigritiae: , Morositatis: , Invidiae:  } }
            ]
        },
        {
            question: "How do you Judge yourself based on what you Are or have Done so Far?",
            options: [
                { text: "",
                    scores: { Irae: , Luxuriae: , Superbiae: , Gulae: , Pigritiae: , Morositatis: , Invidiae:  } }
                { text: "Unimportant and Washed-up, not having made Any Inpactful Changes in the World or Anyones's Lives",
                    scores: { Irae: , Luxuriae: , Superbiae: , Gulae: , Pigritiae: , Morositatis: , Invidiae:  } }
                { text: "Selfish and Stubborn, ",
                    scores: { Irae: , Luxuriae: , Superbiae: , Gulae: , Pigritiae: , Morositatis: , Invidiae:  } }
                { text: "",
                    scores: { Irae: , Luxuriae: , Superbiae: , Gulae: , Pigritiae: , Morositatis: , Invidiae:  } }
                { text: "",
                    scores: { Irae: , Luxuriae: , Superbiae: , Gulae: , Pigritiae: , Morositatis: , Invidiae:  } }
            ]
        },
        {
            question: "What is your Ultimate Goal in Life?",
            options: [
                { text: "To Live Happily in Comfort and Safety",
                    scores: { Irae: , Luxuriae: , Superbiae: , Gulae: , Pigritiae: , Morositatis: , Invidiae:  } }
                { text: "To Change the World and Be Remembered for it",
                    scores: { Irae: , Luxuriae: , Superbiae: , Gulae: , Pigritiae: , Morositatis: , Invidiae:  } }
                { text: "To Be the Best at Something",
                    scores: { Irae: , Luxuriae: , Superbiae: , Gulae: , Pigritiae: , Morositatis: , Invidiae:  } }
                { text: "To Stand Out from Everyone Else",
                    scores: { Irae: , Luxuriae: , Superbiae: , Gulae: , Pigritiae: , Morositatis: , Invidiae:  } }
                { text: "To Enjoy All the of the Good Things in Life",
                    scores: { Irae: , Luxuriae: , Superbiae: , Gulae: , Pigritiae: , Morositatis: , Invidiae:  } }
            ]
        },
    ];

    const results = [
        {
            name: "Peccatulum Irae",
            description: "", // Corrigido: Adicionado dois pontos aqui
            image: "Assets/Irae.png",
            traits: { /* ... */ }
        },
        {
            name: "Peccatulum Luxuriae",
            description: "", // Corrigido: Adicionado dois pontos aqui
            image: "Assets/Luxuriae.png",
            traits: { /* ... */ }
        },
        {
            name: "Peccatulum Superbiae",
            description: "", // Corrigido: Adicionado dois pontos aqui
            image: "Assets/Superbiae.png",
            traits: { /* ... */ }
        },
        {
            name: "Peccatulum Gulae",
            description: "", // Corrigido: Adicionado dois pontos aqui
            image: "Assets/Gulae.png",
            traits: { /* ... */ }
        },
        {
            name: "Peccatulum Pigritiae",
            description: "", // Corrigido: Adicionado dois pontos aqui
            image: "Assets/Pigritiae.png",
            traits: { /* ... */ }
        },
        {
            name: "Peccatulum Morositatis",
            description: "", // Corrigido: Adicionado dois pontos aqui
            image: "Assets/Morositatis.png",
            traits: { /* ... */ }
        },
        {
            name: "Peccatulum Invidiae",
            description: "", // Corrigido: Adicionado dois pontos aqui
            image: "Assets/Invidiae.png",
            traits: { /* ... */ }
        },
    ];

    let currentQuestionIndex = 0;
    let userScores = {
        Irae: 0,
        Luxuriae: 0,
        Superbiae: 0,
        Gulae: 0,
        Pigritiae: 0,
        Morositatis: 0,
        Invidiae: 0
    };
    // Adicionado: Variável para a opção selecionada, inicializada como `null`
    let selectedOptionScores = null;

    function showMessage(message) {
        messageText.textContent = message;
        messageBox.style.display = 'flex';
    }

    function hideMessage() {
        messageBox.style.display = 'none';
    }

    function renderQuestion() {
        const currentQuestion = quizData[currentQuestionIndex];
        questionText.textContent = currentQuestion.question;
        optionsContainer.innerHTML = '';
        // Corrigido: Reseta a opção selecionada a cada nova pergunta
        selectedOptionScores = null;
        nextQuestionBtn.disabled = true;

        if (currentQuestionIndex === quizData.length - 1) {
            nextQuestionBtn.style.display = 'none';
            submitQuizBtn.style.display = 'block';
        } else {
            nextQuestionBtn.style.display = 'block';
            submitQuizBtn.style.display = 'none';
        }

        currentQuestion.options.forEach((option, index) => {
            const optionButton = document.createElement('button');
            // Corrigido: Usado `classList.add` no lugar de `classList`
            optionButton.classList.add('option-button');
            optionButton.textContent = option.text;
            optionButton.dataset.optionIndex = index;
            // Corrigido: Passado a função `handleOptionSelection` com os argumentos corretos
            optionButton.addEventListener('click', () => handleOptionSelection(optionButton, option.scores));
            optionsContainer.appendChild(optionButton);
        });
    }

    // Corrigido: Renomeado para `handleOptionSelection` para clareza
    function handleOptionSelection(clickedButton, scores) {
        document.querySelectorAll('.option-button').forEach(btn => {
            btn.classList.remove('selected');
        });
        clickedButton.classList.add('selected');
        // Corrigido: Atribuído o objeto de `scores` à variável global
        selectedOptionScores = scores;
        nextQuestionBtn.disabled = false;
        // Corrigido: Habilita o botão de submissão
        submitQuizBtn.disabled = false;
    }

    function goToNextQuestion() {
        if (selectedOptionScores === null) {
            showMessage('Please, Select 1 Option before Proceeding.');
            return;
        }

        for (const trait in selectedOptionScores) {
            if (userScores.hasOwnProperty(trait)) {
                // Corrigido: Soma o valor do score à pontuação do usuário
                userScores[trait] += selectedOptionScores[trait];
            }
        }
        currentQuestionIndex++;
        if (currentQuestionIndex < quizData.length) {
            renderQuestion();
        } else {
            showResult();
        }
    }

    function showResult() {
        let maxScore = -1;
        let dominantTrait = '';
        // Corrigido: Loop para encontrar o traço dominante, a lógica estava incompleta
        for (const trait in userScores) {
            if (userScores[trait] > maxScore) {
                maxScore = userScores[trait];
                dominantTrait = trait;
            }
        }
        
        let finalResult = null; // Inicializado como null
        let bestMatchScore = -1;
        
        results.forEach(result => {
            let matchScore = 0; // Inicializado dentro do loop para cada resultado
            // Corrigido: Iteração sobre os traços do objeto `result.traits`
            for (const trait in result.traits) {
                // Corrigido: Verifica se o traço existe em `userScores` antes de somar
                if (userScores.hasOwnProperty(trait)) {
                    matchScore += userScores[trait] * result.traits[trait];
                }
            }
            if (matchScore > bestMatchScore) {
                bestMatchScore = matchScore;
                finalResult = result;
            }
        });
        
        // Corrigido: Adicionado uma verificação para garantir que um resultado foi encontrado
        if (finalResult) {
            resultTitle.textContent = finalResult.name;
            resultImage.src = finalResult.image;
            resultDescription.textContent = finalResult.description;
        }

        quizScreen.classList.remove('active');
        resultModal.style.display = 'flex';
    }

    function restartQuiz() {
        currentQuestionIndex = 0;
        // Corrigido: A variável `userScores` precisa ser redefinida
        userScores = {
            Irae: 0,
            Luxuriae: 0,
            Superbiae: 0,
            Gulae: 0,
            Pigritiae: 0,
            Morositatis: 0,
            Invidiae: 0
        };
        // Corrigido: A variável `selectedOptionScores` deve ser redefinida
        selectedOptionScores = null;
        resultModal.style.display = 'none';
        startScreen.classList.add('active');
        // Removido: `quizScreen.classList.remove('active')` que estava redundante
        nextQuestionBtn.style.display = 'block';
        submitQuizBtn.style.display = 'none';
    }
    
    // Corrigido: `startQuiztn` para `startQuizBtn`
    startQuizBtn.addEventListener('click', () => {
        startScreen.classList.remove('active');
        quizScreen.classList.add('active');
        renderQuestion();
    });

    nextQuestionBtn.addEventListener('click', goToNextQuestion);
    
    submitQuizBtn.addEventListener('click', () => {
        if (selectedOptionScores === null) {
            showMessage('Please, Select at least 1 Option before Seeing the Result.');
            return;
        }
        
        for (const trait in selectedOptionScores) {
            if (userScores.hasOwnProperty(trait)) {
                // Corrigido: Referência correta ao valor do score
                userScores[trait] += selectedOptionScores[trait];
            }
        }
        showResult();
    });

    // Corrigido: O botão `restartQuizBtn` agora tem o listener correto
    restartQuizBtn.addEventListener('click', restartQuiz);
    closeMessageBtn.addEventListener('click', hideMessage);
    
    messageBox.addEventListener('click', (e) => {
        if (e.target === messageBox) {
            hideMessage();
        }
    });
});
/* Código corrigido pela IA Gemini
Questões Incompletas */ 