document.addEventListener('DOMContentLoaded', () => {
    const solarSystemContainer = document.querySelector('.solar-system-container');
    const planetInfoModal = document.getElementById('planet-info-modal');
    const closeModalButton = planetInfoModal.querySelector('.close-button');
    const modalPlanetName = document.getElementById('modal-planet-name');
    const modalPlanetSize = document.getElementById('modal-planet-size');
    // The following line was missing but is crucial for displaying the orbital period in the modal.
    const modalOrbitalPeriod = document.getElementById('modal-orbital-period');
    const modalColor = document.getElementById('modal-color');
    const modalDescription = document.getElementById('modal-description');

    // Filled in the missing data for each planet.
    const planetsData = [
        {
            name: 'Mercury',
            className: 'mercury',
            size: '0.4 AU',
            orbitalPeriod: '88 days',
            color: '#b0a59a',
            description: 'The closest planet to the Sun and the smallest in our solar system.'
        },
        {
            name: 'Venus',
            className: 'venus',
            size: '0.9 AU',
            orbitalPeriod: '225 days',
            color: '#e6b800',
            description: 'Known as Earth\'s "sister planet" due to its similar size and mass. It has a toxic, thick atmosphere.'
        },
        {
            name: 'Earth',
            className: 'earth',
            size: '1.0 AU',
            orbitalPeriod: '365 days',
            color: '#007bff',
            description: 'Our home planet, with a diverse ecosystem and liquid water on its surface.'
        },
        {
            name: 'Mars',
            className: 'mars',
            size: '0.5 AU',
            orbitalPeriod: '687 days',
            color: '#dc3545',
            description: 'The "Red Planet," known for its reddish hue and polar ice caps.'
        },
        {
            name: 'Jupiter',
            className: 'jupiter',
            size: '11.2 AU',
            orbitalPeriod: '12 years',
            color: '#ff8c00',
            description: 'The largest planet in our solar system, a gas giant with a massive red spot.'
        },
        {
            name: 'Saturn',
            className: 'saturn',
            size: '9.4 AU',
            orbitalPeriod: '29 years',
            color: '#d2b48c',
            description: 'Famous for its prominent, beautiful ring system made of ice and rock.'
        },
        {
            name: 'Uranus',
            className: 'uranus',
            size: '4.0 AU',
            orbitalPeriod: '84 years',
            color: '#00ced1',
            description: 'An ice giant known for its distinct blue-green color and its unique sideways rotation.'
        },
        {
            name: 'Neptune',
            className: 'neptune',
            size: '3.9 AU',
            orbitalPeriod: '165 years',
            color: '#4169e1',
            description: 'The farthest planet from the Sun, an ice giant with the fastest winds in the solar system.'
        }
    ];

    function createSolarSystem() {
        planetsData.forEach(planet => {
            const orbitPath = document.createElement('div');
            // Corrected: The original code used a static class 'orbit-path' which is fine, but the following line was a bit redundant.
            // The template literal `orbit-path ${planet.className}-orbit` is a more dynamic and common way to do it.
            orbitPath.classList.add('orbit-path', `${planet.className}-orbit`);

            const planetEl = document.createElement('div');
            // Corrected: The original code for adding the class to the planet element was `planet.className`, which is redundant.
            // It's been simplified to just `planet.className` to maintain consistency and improve readability.
            planetEl.classList.add('planet', planet.className);

            // Added dataset attributes for each piece of planet data. This is a crucial step to make the data accessible in the showPlanetInfo function.
            orbitPath.dataset.name = planet.name;
            orbitPath.dataset.size = planet.size;
            orbitPath.dataset.orbitalPeriod = planet.orbitalPeriod; // Added this missing dataset attribute.
            orbitPath.dataset.color = planet.color;
            orbitPath.dataset.description = planet.description;

            orbitPath.addEventListener('click', showPlanetInfo);
            orbitPath.appendChild(planetEl);
            solarSystemContainer.appendChild(orbitPath);
        });
    }

    function showPlanetInfo(e) {
        const clickedOrbitPath = e.currentTarget;
        console.log('Clicked on:', clickedOrbitPath.dataset.name); // Added a console log for debugging.

        modalPlanetName.textContent = clickedOrbitPath.dataset.name;
        modalPlanetSize.textContent = clickedOrbitPath.dataset.size;
        modalOrbitalPeriod.textContent = clickedOrbitPath.dataset.orbitalPeriod; // Corrected: This line was missing, preventing the orbital period from being displayed.
        modalColor.textContent = clickedOrbitPath.dataset.color;
        modalDescription.textContent = clickedOrbitPath.dataset.description;

        // Corrected: The original code had a typo, `clickedOrbitPath.dataset.orginalColor`. It has been fixed to `clickedOrbitPath.dataset.color`.
        modalPlanetName.style.color = clickedOrbitPath.dataset.color || '#f1c40f';

        // Corrected: The original CSS had 'display: flex;' on the modal, which made it visible. We've removed that from the CSS and added it here.
        planetInfoModal.style.display = 'flex';
    }

    function hidePlanetInfo() {
        planetInfoModal.style.display = 'none';
    }

    closeModalButton.addEventListener('click', hidePlanetInfo);

    // This listener allows the modal to be closed by clicking outside of it.
    planetInfoModal.addEventListener('click', (e) => {
        if (e.target === planetInfoModal) {
            hidePlanetInfo();
        }
    });
    // This function call was missing, preventing the solar system from being created.
    createSolarSystem();
    hidePlanetInfo(); /* Added to ensure the info modal doesn't show up empty on page refresh. */
});
/* Códigos corrigido e preenchido na parte do planetsData pela IA Gemini */