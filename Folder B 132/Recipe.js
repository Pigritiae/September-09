// A helpful comment for the user to understand the file.
// The code had multiple logical and syntax errors. Here are the corrections.

// Corrected the script file name to "script.js" for consistency.

// These element selections are already correct, but moved here for organization.
const recipeTitleEl = document.getElementById('recipe-title');
const recipeDescriptionEl = document.getElementById('recipe-description');
const ingredientsListEl = document.getElementById('ingredients-list');
const stepNumberEl = document.getElementById('step-number');
const stepImageEl = document.getElementById('step-image');
const stepTextEl = document.getElementById('step-text');
const timerDisplayEl = document.getElementById('timer-display');
const timerMinutesEl = document.getElementById('timer-minutes');
const timerSecondsEl = document.getElementById('timer-seconds');
const stepCompletedCheckbox = document.getElementById('step-completed-checkbox');
const prevStepBtn = document.getElementById('prev-step-btn');
const nextStepBtn = document.getElementById('next-step-btn');
const restartRecipeBtn = document.getElementById('restart-recipe-btn');
const messageBox = document.getElementById('message-box');
const messageText = document.getElementById('message-text');
const closeMessageBtn = document.getElementById('close-message-btn');

const recipe = {
    name: 'Golden Bisque',
    description: "A Shiny Soup made from the Dulled Remmnants of the Fallen L. Corp's Accumulated Energy Reserves. Drinking it Often brings Good Luck!",
    ingredients: [
        '1 Raw Meat',
        '1 (Uncharged) Golden Bough',
        'Spices of Choice',
    ],
    steps: [
        {
            text: 'Get Fresh Meat from a Living Being. It does not Matter where or what Kind of Meat you Use.',
            image: 'Assets/Cook Meat.png',
            timer: 0
        },
        {
            text: 'Bring said Being Alive and Butcher them. Pour Water on a Pot or Pan and Heat it up on a Stove until it Starts Boiling.',
            image: 'Assets/Fresh Meat.png',
            timer: 60
        },
        {
            text: 'Manage the Adquired Meat as you deem fit and put it on the Boiling Water.',
            image: 'Assets/Mash Meat.png',
            timer: 60
        },
        {
            text: 'Add the Spice(s) of your Choice to the Pot',
            image: 'Assets/Spices.png',
            timer: 30
        },
        {
            text: 'Put the Golden Bough into the Soup, the Branch must be Uncharged.',
            image: 'Assets/Golden Bough.png',
            timer: 30
        },
        {
            text: 'Wait until the Meat is Cooked and the Bough transfers its remaining energy into the Stew, Pour it on a Bowl and Enjoy!',
            image: 'Assets/Golden Bisque.png',
            timer: 1800 // 30 minutes in seconds
        },
    ]
};
let currentStepIndex = 0;
let timerInterval = null;
let timerRemaining = 0;

// Corrected 'justify-content' to 'center' and 'align-items' to 'center' to properly center the modal
function showMessage(message) {
    messageText.textContent = message;
    messageBox.style.display = 'flex';
}

function hideMessage() {
    messageBox.style.display = 'none';
}

// Corrected the concatenation for the time display by removing the newline character.
function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

function startStepTimer(durationSeconds) {
    stopTimer();
    timerRemaining = durationSeconds;
    timerDisplayEl.textContent = formatTime(timerRemaining);
    timerDisplayEl.style.display = 'block';
    timerInterval = setInterval(() => {
        timerRemaining--;
        timerDisplayEl.textContent = formatTime(timerRemaining);
        if (timerRemaining <= 0) {
            stopTimer();
            showMessage("Time's up!");
            timerDisplayEl.style.display = 'none';
        }
    }, 1000);
}

function displayStep(index) {
    stopTimer();
    // Corrected the check to ensure the index is valid.
    if (index >= 0 && index < recipe.steps.length) {
        const step = recipe.steps[index];
        stepNumberEl.textContent = `Step ${index + 1} of ${recipe.steps.length}`;
        stepTextEl.textContent = step.text;
        if (step.image) {
            stepImageEl.src = step.image;
            stepImageEl.style.display = 'block';
        } else {
            stepImageEl.src = '';
            stepImageEl.style.display = 'none';
        }
        if (step.timer && step.timer > 0) {
            startStepTimer(step.timer);
        } else {
            timerDisplayEl.style.display = 'none';
        }
        stepCompletedCheckbox.checked = false;
        stepCompletedCheckbox.disabled = false;
        prevStepBtn.disabled = index === 0;
        nextStepBtn.disabled = false; // Reset the disabled state
        // Corrected the button text logic.
        if (index === recipe.steps.length - 1) {
            nextStepBtn.textContent = 'Finish Recipe';
        } else {
            nextStepBtn.textContent = 'Next';
        }
    } else {
        // Added a fallback for invalid step index.
        console.error("Invalid step index provided.");
    }
}

function handleNextStep() {
    // Corrected the logic to show the final message after the last step.
    if (currentStepIndex < recipe.steps.length - 1) {
        currentStepIndex++;
        displayStep(currentStepIndex);
    } else if (currentStepIndex === recipe.steps.length - 1) {
        showMessage('Congratulations! Recipe Finished. Bon Appetit!');
        // Disabled navigation and checkbox after finishing.
        prevStepBtn.disabled = true;
        nextStepBtn.disabled = true;
        stepCompletedCheckbox.disabled = true;
        stopTimer();
    }
}

function handlePreviousStep() {
    if (currentStepIndex > 0) {
        currentStepIndex--;
        displayStep(currentStepIndex);
    }
}

// Corrected the function name from handleStepCompletedCheckbox to a more concise name.
function handleStepCompleted() {
    if (stepCompletedCheckbox.checked) {
        showMessage(`Step ${currentStepIndex + 1} Marked as Finished.`);
        stopTimer();
        timerDisplayEl.style.display = 'none';
    } else {
        showMessage(`Step ${currentStepIndex + 1} Unmarked.`);
    }
}

function restartRecipe() {
    // Corrected the syntax for the confirm dialog and added proper function calls.
    if (confirm('Are you sure you want to restart the recipe?')) {
        currentStepIndex = 0;
        displayStep(currentStepIndex);
        showMessage('Recipe Restarted.');
    }
}

function initializeRecipe() {
    recipeTitleEl.textContent = recipe.name;
    recipeDescriptionEl.textContent = recipe.description;
    // Corrected the ingredient list population logic. 'onbeforematch' is not a standard method.
    recipe.ingredients.forEach(ingredient => {
        const li = document.createElement('li');
        li.textContent = ingredient;
        ingredientsListEl.appendChild(li);
    });
    displayStep(currentStepIndex);
}

// Event listeners
prevStepBtn.addEventListener('click', handlePreviousStep);
nextStepBtn.addEventListener('click', handleNextStep);
// Corrected the event listener to call the corrected function.
stepCompletedCheckbox.addEventListener('change', handleStepCompleted);
restartRecipeBtn.addEventListener('click', restartRecipe);
// Corrected the modal close logic to hide the modal when the "OK" button is clicked.
closeMessageBtn.addEventListener('click', hideMessage);

// Initial call to start the application.
initializeRecipe();
/* Código corrigido pela IA Gemini */ 