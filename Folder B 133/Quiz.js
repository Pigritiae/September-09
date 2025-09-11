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
                    scores: { Irae: 0, Luxuriae: 0, Superbiae: 1, Gulae: 0, Pigritiae: 3, Morositatis: 2, Invidiae: 0 } },
                { text: "Tense, Chaotic and Rushed",
                    scores: { Irae: 1, Luxuriae: 3, Superbiae: 0, Gulae: 0, Pigritiae: 0, Morositatis: 0, Invidiae: 2 } },
                { text: "Dull, Repetitive and Hopeless",
                    scores: { Irae: 0, Luxuriae: 1, Superbiae: 0, Gulae: 0, Pigritiae: 0, Morositatis: 3, Invidiae: 2 } },
                { text: "Frustrating, Cruel and Hateful",
                    scores: { Irae: 3, Luxuriae: 1, Superbiae: 2, Gulae: 0, Pigritiae: 0, Morositatis: 0, Invidiae: 0 } },
                { text: "Risky, Rewarding and Dangerous ",
                    scores: { Irae: 0, Luxuriae: 3, Superbiae: 0, Gulae: 2, Pigritiae: 0, Morositatis: 0, Invidiae: 1 } },
            ]
        },
        {
            question: "What do you Currently Think of your own Family?",
            options: [
                { text: "Well-meaning People who want the Best for me",
                    scores: { Irae: 0, Luxuriae: 3, Superbiae: 0, Gulae: 1, Pigritiae: 2, Morositatis: 0, Invidiae: 0 } },
                { text: "Apathetic Slobs who Would Rather Indulge than do anything else",
                    scores: { Irae: 1, Luxuriae: 0, Superbiae: 3, Gulae: 2, Pigritiae: 0, Morositatis: 0, Invidiae: 0 } },
                { text: "Incompetent Dolts who can't Think Outside of their Own Little World",
                    scores: { Irae: 3, Luxuriae: 1, Superbiae: 2, Gulae: 0, Pigritiae: 0, Morositatis: 0, Invidiae: 0 } },
                { text: "Restrictive Chains that Keep me Away from what I Want",
                    scores: { Irae: 0, Luxuriae: 1, Superbiae: 0, Gulae: 0, Pigritiae: 3, Morositatis: 2, Invidiae: 1 } },
                { text: "Manipulative Opportunists who take Advantage of me to Live more Comfortably",
                    scores: { Irae: 0, Luxuriae: 1, Superbiae: 0, Gulae: 0, Pigritiae: 0, Morositatis: 3, Invidiae: 2 } },
            ]
        },
        {
            question: "You're in a Group Project and There are Multiple Conflicting Ideas on what should be Done. What do you Do?",
            options: [
                { text: "Try to Reach a Consensus between Every Proposed Idea",
                    scores: { Irae: 0, Luxuriae: 1, Superbiae: 0, Gulae: 3, Pigritiae: 0, Morositatis: 2, Invidiae: 0 } },
                { text: "Pick an Idea from Someone Else and Add to It",
                    scores: { Irae: 0, Luxuriae: 2, Superbiae: 0, Gulae: 1, Pigritiae: 0, Morositatis: 0, Invidiae: 3 } },
                { text: "Defend your Own Idea and Convince the Others to Choose It",
                    scores: { Irae: 3, Luxuriae: 2, Superbiae: 1, Gulae: 0, Pigritiae: 0, Morositatis: 0, Invidiae: 0 } },
                { text: "Withdraw yourself from the Debate",
                    scores: { Irae: 0, Luxuriae: 0, Superbiae: 0, Gulae: 0, Pigritiae: 3, Morositatis: 2, Invidiae: 1 } },
                { text: "Wait until The Debate Settles Down into a Decisive Choice, then Voice your opinion",
                    scores: { Irae: 0, Luxuriae: 0, Superbiae: 0, Gulae: 0, Pigritiae: 2, Morositatis: 3, Invidiae: 1 } },
            ]
        },
        {
            question: "You are Confronted by an Armed Mugger at Night on the Street. What would you do?",
            options: [
                { text: "Comply with their Requests",
                    scores: { Irae: 0, Luxuriae: 0, Superbiae: 0, Gulae: 0, Pigritiae: 3, Morositatis: 2, Invidiae: 1 } },
                { text: "Look for an Opening to Fight Back",
                    scores: { Irae: 3, Luxuriae: 0, Superbiae: 2, Gulae: 1, Pigritiae: 0, Morositatis: 0, Invidiae: 0 } },
                { text: "Negotiate or Talk with the Mugger",
                    scores: { Irae: 0, Luxuriae: 3, Superbiae: 0, Gulae: 1, Pigritiae: 2, Morositatis: 0, Invidiae: 0 } },
                { text: "Run Away",
                    scores: { Irae: 0, Luxuriae: 0, Superbiae: 0, Gulae: 1, Pigritiae: 3, Morositatis: 2, Invidiae: 0 } },
                { text: "Buy Time until Someone Comes",
                    scores: { Irae: 0, Luxuriae: 0, Superbiae: 0, Gulae: 0, Pigritiae: 2, Morositatis: 2, Invidiae: 3 } },
            ]
        },
        {
            question: "When you're Struggling with doing Something, like Homework or a Project, what is generally your First Instinct?",
            options: [
                { text: "Take a Break and Come Back Later",
                    scores: { Irae: 0, Luxuriae: 0, Superbiae: 1, Gulae: 2, Pigritiae: 0, Morositatis: 3, Invidiae: 0 } },
                { text: "Look for Help or Assitance",
                    scores: { Irae: 0, Luxuriae: 0, Superbiae: 0, Gulae: 0, Pigritiae: 2, Morositatis: 1, Invidiae: 3 } },
                { text: "Go do Something Else",
                    scores: { Irae: 1, Luxuriae: 0, Superbiae: 0, Gulae: 0, Pigritiae: 3, Morositatis: 2, Invidiae: 0 } },
                { text: "Keep Trying",
                    scores: { Irae: 2, Luxuriae: 0, Superbiae: 3, Gulae: 0, Pigritiae: 0, Morositatis: 0, Invidiae: 1 } },
                { text: "Find a Different Approach",
                    scores: { Irae: 1, Luxuriae: 2, Superbiae: 3, Gulae: 0, Pigritiae: 0, Morositatis: 0, Invidiae: 0 } },
            ]
        },
        {
            question: "What is Closest to your Current Objective?",
            options: [
                { text: "To Get a Stable and Well-paying Job",
                    scores: { Irae: 0, Luxuriae: 0, Superbiae: 0, Gulae: 3, Pigritiae: 2, Morositatis: 1, Invidiae: 0 } },
                { text: "To Find a Soul-mate",
                    scores: { Irae: 0, Luxuriae: 3, Superbiae: 0, Gulae: 2, Pigritiae: 0, Morositatis: 0, Invidiae: 1 } },
                { text: "To be Free to do what I Want",
                    scores: { Irae: 1, Luxuriae: 0, Superbiae: 3, Gulae: 0, Pigritiae: 0, Morositatis: 0, Invidiae: 2 } },
                { text: "To Prove my Worth or Capability in Something",
                    scores: { Irae: 1, Luxuriae: 0, Superbiae: 2, Gulae: 0, Pigritiae: 0, Morositatis: 0, Invidiae: 3 } },
                { text: "I Currently have no Objective...",
                    scores: { Irae: 0, Luxuriae: 0, Superbiae: 0, Gulae: 0, Pigritiae: 2, Morositatis: 3, Invidiae: 1 } },
            ]
        },
        {
            question: "What is your Ultimate Goal in Life?",
            options: [
                { text: "To Live Happily in Comfort and Safety",
                    scores: { Irae: 0, Luxuriae: 1, Superbiae: 0, Gulae: 2, Pigritiae: 3, Morositatis: 0, Invidiae: 0 } },
                { text: "To Change the World and Be Remembered for it",
                    scores: { Irae: 0, Luxuriae: 3, Superbiae: 1, Gulae: 0, Pigritiae: 0, Morositatis: 0, Invidiae: 2 } },
                { text: "To Be the Best at Something",
                    scores: { Irae: 0, Luxuriae: 1, Superbiae: 3, Gulae: 0, Pigritiae: 0, Morositatis: 0, Invidiae: 2 } },
                { text: "To Stand Out from Everyone Else",
                    scores: { Irae: 0, Luxuriae: 1, Superbiae: 2, Gulae: 0, Pigritiae: 0, Morositatis: 0, Invidiae: 3 } },
                { text: "To Enjoy All the of the Good Things in Life",
                    scores: { Irae: 0, Luxuriae: 1, Superbiae: 0, Gulae: 3, Pigritiae: 2, Morositatis: 0, Invidiae: 0 } },
            ]
        },
    ];

    const results = [
        {
            name: "Peccatulum Irae",
            description: '"No! I will Not have that!"'<br>"To be Wrathful is to Oppose anything and anyone that goes against Oneself, Rules, Opinions, Ideas and anything else that doesn't benefit you is often Vehemently Denied.", // Corrigido: Adicionado dois pontos aqui
            image: "Assets/Irae.png",
            traits: { Irae }
        },
        {
            name: "Peccatulum Luxuriae",
            description: 'My Presence in this World must Last Forever After my Death.'<br>"To be Lustful is to Desire the Spread of the Self, not Just from Procreating and Continuing one's Bloodline, but also Sharing Ideas and Ingraining oneself to People's Memory.",
            image: "Assets/Luxuriae.png",
            traits: { Luxuriae }
        },
        {
            name: "Peccatulum Superbiae",
            description: '"I am the Best, I Deserve Everything. Everyone who thinks Otherwise is Stupid and will Pay for Thinking that"'<br>"To be Prideful is to Impose one's Will, Contrary to Everything else, and Everyone else is just a Tool for that Will or an Obstacle that Must be Destroyed.",
            image: "Assets/Superbiae.png",
            traits: { Superbiae }
        },
        {
            name: "Peccatulum Gulae",
            description: '"Money can Buy Happiness. I can Buy All the Food, Fun and Power with Enough of it."'<br>"To Be Gluttonous(or Greedy) is to Ceaselessly Desire Everything Material, not Stopping even when there's no more to be adquired, All in an Effort to be Happy; or otherwise Forget Pain.",
            image: "Assets/Gulae.png",
            traits: { Gulae }
        },
        {
            name: "Peccatulum Pigritiae",
            description: '"I am Perfectly Safe this Way. I Should Stay as I am to Stay Safe and Happy."'<br>"To Be Slothful is to Resist Change and Stay the Way you are, even when Faced with Extreme Situations or Circumstances, in this Wild, Unpredictable World, Stability and Safety is a Luxury Worth Giving up Everything for.",
            image: "Assets/Pigritiae.png",
            traits: { Pigritiae }
        },
        {
            name: "Peccatulum Morositatis",
            description: '"This World Cannot Change... And Neither can I..."'<br>"To Be Gloomful is to Wallow in Despair and Isolate yourself from Everything, Closing yourself Off from All Chance of Change, and Accepting the World as a Cruel and Uncaring Place where you Don't and Can't Belong.",
            image: "Assets/Morositatis.png",
            traits: { Morositatis }
        },
        {
            name: "Peccatulum Invidiae",
            description: '"How... How can everyone Else be so Much Better than me in Every Way!?"'<br>"To Be Envious is to be Frustrated for Lacking Something that Others don't, and especially to Act on that Anger. In a Social Vacuum, you would Feel Empty, your Happiness is Dependent on Besting Others and Proving Yourself.",
            image: "Assets/Invidiae.png",
            traits: { Invidiae }
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
/* Código corrigido pela IA Gemini */
