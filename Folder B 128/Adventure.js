document.addEventListener('DOMContentLoaded', () => {
    const storyTextEl = document.getElementById('story-text');
    const choicesArea = document.getElementById('choices-area');
    const inventoryListEl = document.getElementById('inventory-list');
    const emptyInventoryMessage = document.getElementById('empty-inventory-message');
    const restartGameBtn = document.getElementById('restart-game-btn');
    const saveGameBtn = document.getElementById('save-game-btn');
    const loadGameBtn = document.getElementById('load-game-btn');
    const messageBox = document.getElementById('message-box');
    const messageText = document.getElementById('message-text');
    // Corrected typo from 'close-mesage-btn' to 'close-message-btn'
    const closeMessageBtn = document.getElementById('close-message-btn');

    // Corrected syntax errors: missing commas, colons, and bracket
    const storyNodes = {
        'start': {
            text: "You Wake up at a Dark Forest, you need to get out of here.",
            choices: [
                { text: "Follow the Narrow Path", nextNodeId: "path_forest" },
                { text: "Explore the River", nextNodeId: "explore_stream" }
            ],
            effects: []
        },
        'path_forest': { // Corrected from 'path-forest' to match the link in 'start'
            text: "The Narrow Path is full of Dry Leaves, you hear rustling leaves, there's something shiny in them.",
            choices: [
                { text: "Investigate the Shine", nextNodeId: "get_key" },
                { text: "Ignore and Continue by the Path", nextNodeId: "deeper_forest" }
            ],
            effects: [] // Corrected syntax: missing bracket
        },
        'get_key': {
            text: "You Find a Rusty Key",
            choices: [
                { text: "Continue the Path", nextNodeId: "deeper_forest" }, // Added missing comma
            ],
            effects: [{ type: 'addItem', item: 'rusty_key' }] // Corrected syntax: missing bracket
        },
        'deeper_forest': { // Corrected syntax: missing colon
            text: 'You go Deeper into the Forest',
            choices: [
                { text: "Try to Open the Door with the Key", nextNodeId: "try_door_with_key", requires: ['rusty_key'] }, // Added 'requires' property
                { text: "Find another Path", nextNodeId: "lost_in_forest" }
            ],
            effects: []
        },
        'try_door_with_key': {
            text: "You use the rusty key to open the ancient door.",
            choices: [
                { text: "Enter the Treasure Room", nextNodeId: "treasure_room" }
            ],
            effects: [{ type: 'removeItem', item: 'rusty_key' }]
        },
        'explore_stream': {
            text: "You follow the stream, finding a cave entrance",
            choices: [
                { text: "Try to get the shiny object", nextNodeId: "get_gem" },
                { text: "Go Back", nextNodeId: "start" }
            ],
            effects: [] // Corrected from 'effect' to 'effects' for consistency
        },
        'get_gem': {
            text: "You retrieve a shiny gem from the stream.",
            choices: [
                { text: "Enter the Cave", nextNodeId: "cave_entrance" }
            ],
            effects: [{ type: 'addItem', item: 'shiny_gem' }]
        },
        'lost_in_forest': {
            text: "You are lost in the forest...",
            choices: [
                { text: "Game Over (Lost)", nextNodeId: "game_over_lost" }
            ],
            effects: []
        },
        'cave_entrance': {
            text: "You enter the Cave.",
            choices: [
                { text: "Examine the Altar", nextNodeId: "examine_altar" },
                { text: "Try to find an Exit", nextNodeId: "cave_exit" }
            ],
            effects: [] // Corrected from 'effect' to 'effects' for consistency
        },
        'cave_exit': {
            text: "You find another way out and escape the forest.",
            choices: [
                { text: "Game Over (Victory!)", nextNodeId: "game_over_win" }
            ],
            effects: []
        },
        'examine_altar': {
            text: "The altar has strange symbols.",
            choices: [
                { text: "Put the Gem in it", nextNodeId: "place_gem", requires: ['shiny_gem'] },
                { text: "Leave the altar and look for an exit", nextNodeId: "cave_exit" }
            ],
            effects: []
        },
        'place_gem': {
            text: "You put the gem on the Altar, You Escaped!",
            choices: [ // Corrected syntax: missing bracket
                { text: "Game Over (Victory!)", nextNodeId: "game_over_win" }
            ],
            effects: [{ type: 'removeItem', item: 'shiny_gem' }]
        },
        'treasure_room': {
            text: "You find in the passage a treasure room, Victory!",
            choices: [
                { text: "Game Over (Victory!)", nextNodeId: "game_over_win_treasure" }
            ],
            effects: []
        },
        'game_over_lost': {
            text: "Game Over. You got lost in the Forest.",
            choices: [],
            effects: []
        },
        'game_over_win': {
            text: "Game Over. You escaped the forest.", // Corrected typo 'foest'
            choices: [],
            effects: []
        },
        'game_over_win_treasure': {
            text: "Game Over. You escaped from the Forest, with great fortunes.",
            choices: [],
            effects: []
        }
    };
    const items = {
        'rusty_key': 'Rusty Key',
        'shiny_gem': 'Shiny Gem'
    };
    let currentStoryNodeId = 'start';
    let inventory = [];
    let gameActive = false;
    
    function showMessage(message) {
        messageText.textContent = message;
        messageBox.style.display = 'flex';
    }
    function hideMessage() {
        messageBox.style.display = 'none';
    }
    function renderStoryNode() {
        const node = storyNodes[currentStoryNodeId];
        if (!node) {
            console.error("Story node not found:", currentStoryNodeId);
            showMessage("Error: Story node not found. Restart the Game.");
            return;
        }
        storyTextEl.textContent = node.text;
        choicesArea.innerHTML = '';

        if (node.choices && node.choices.length > 0) {
            node.choices.forEach((choice, index) => {
                const choiceBtn = document.createElement('button');
                choiceBtn.classList.add('choice-btn');
                choiceBtn.textContent = choice.text;
                choiceBtn.dataset.choiceIndex = index;

                let isDisabled = false;
                if (choice.requires && choice.requires.length > 0) {
                    const missingItems = choice.requires.filter(requiredItem => !inventory.includes(requiredItem)); // Corrected space
                    if (missingItems.length > 0) {
                        isDisabled = true;
                        choiceBtn.title = `Requires: ${missingItems.map(item => items[item] || item).join(', ')}`;
                    }
                }
                choiceBtn.disabled = isDisabled;

                choiceBtn.addEventListener('click', () => makeChoice(index));
                choicesArea.appendChild(choiceBtn);
            });
        } else {
            const restartButton = document.createElement('button');
            restartButton.classList.add('choice-btn', 'primary'); // Added classes
            restartButton.textContent = "Restart Game"; // Added text content
            restartButton.addEventListener('click', restartGame);
            choicesArea.appendChild(restartButton);
            gameActive = false;
        }
        // Corrected syntax for the effects loop
        if (node.effects && node.effects.length > 0) {
            node.effects.forEach(effect => {
                if (effect.type === 'addItem') {
                    addItem(effect.item);
                } else if (effect.type === 'removeItem') {
                    removeItem(effect.item);
                }
            });
        }
        updateInventoryDisplay();
    }

    function makeChoice(choiceIndex) {
        if (!gameActive) return;

        const node = storyNodes[currentStoryNodeId];
        if (!node || !node.choices || !node.choices[choiceIndex]) {
            console.error("Invalid Choice.");
            return;
        }
        // Corrected typo from 'chose' to 'chosen'
        const chosen = node.choices[choiceIndex];

        if (chosen.requires && chosen.requires.length > 0) {
            const missingItems = chosen.requires.filter(requiredItem => !inventory.includes(requiredItem)); // Corrected space
            if (missingItems.length > 0) {
                showMessage(`You don't have the necessary items to make this choice: ${missingItems.map(item => items[item] || item).join(', ')}`);
                return;
            }
        }
        currentStoryNodeId = chosen.nextNodeId;
        renderStoryNode();
        saveGame();
    }
    function addItem(itemId) {
        if (!inventory.includes(itemId)) {
            inventory.push(itemId);
            showMessage(`You found: ${items[itemId] || itemId}!`);
            updateInventoryDisplay(); // Corrected typo 'updateInvertoryDisplay'
        }
    }
    
    function removeItem(itemId) {
        const index = inventory.indexOf(itemId);
        if (index > -1) {
            inventory.splice(index, 1);
            showMessage(`You used: ${items[itemId] || itemId}.`);
            updateInventoryDisplay(); // Corrected typo 'updateInvertoryDisplay'
        }
    }

    function updateInventoryDisplay() {
        inventoryListEl.innerHTML = '';
        if (inventory.length === 0) {
            emptyInventoryMessage.style.display = 'block';
        } else {
            emptyInventoryMessage.style.display = 'none';
            inventory.forEach(itemId => {
                const itemEl = document.createElement('li');
                itemEl.classList.add('inventory-item');
                itemEl.textContent = items[itemId] || itemId;
                inventoryListEl.appendChild(itemEl);
            });
        }
    }
    // Corrected function name from 'SaveGame' to 'saveGame' for consistency
    function saveGame() {
        const gameState = {
            currentStoryNodeId: currentStoryNodeId,
            inventory: inventory
        };
        localStorage.setItem('textAdventureSave', JSON.stringify(gameState));
        showMessage('Game Saved Successfully.'); // Corrected typo 'Successsfully'
    }

    function loadGame() {
        const savedState = localStorage.getItem('textAdventureSave');
        if (savedState) {
            if (confirm('Are you Sure you want to load the saved Game?')) { // Consolidated duplicate logic
                const gameState = JSON.parse(savedState);
                currentStoryNodeId = gameState.currentStoryNodeId;
                inventory = gameState.inventory;
                gameActive = true;
                renderStoryNode();
                updateInventoryDisplay();
                showMessage('Game loaded Successfully.'); // Changed message for clarity
            }
        } else {
            showMessage('No save game Found.');
        }
    }
    
    function restartGame() {
        if (confirm('Are you sure you want to restart Game?')) {
            currentStoryNodeId = 'start';
            inventory = [];
            gameActive = true;
            renderStoryNode();
            updateInventoryDisplay();
            showMessage('Game Restarted.');
        }
    }
    
    restartGameBtn.addEventListener('click', restartGame);
    saveGameBtn.addEventListener('click', saveGame);
    loadGameBtn.addEventListener('click', loadGame);
    closeMessageBtn.addEventListener('click', hideMessage);
    messageBox.addEventListener('click', (e) => {
        if (e.target === messageBox) {
            hideMessage();
        }
    });

    // The initial load logic was flawed. This version simplifies it to check for a save and then starts a new game if none is found.
    const initialLoad = localStorage.getItem('textAdventureSave');
    if (initialLoad) {
        loadGame();
    } else {
        restartGame();
    }
});
/* Código corrigido pela IA Gemini,
Descrições incompletas para as escolhas */