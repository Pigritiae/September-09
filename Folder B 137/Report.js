const stateSelect = document.getElementById('state');
const predictDiv = document.getElementById('predict');

const apiKey = 'c86629e074d116560e283ad1eabe863f';

const capitals = {
    'AC': 'Rio Branco',
    'AL': 'Maceió',
    'AP': 'Macapá',
    'AM': 'Manaus',
    'BA': 'Salvador',
    'CE': 'Fortaleza',
    'DF': 'Brasília',
    'ES': 'Vitória',
    'GO': 'Goiânia',
    'MA': 'São Luís',
    'MT': 'Cuiabá',
    'MS': 'Campo Grande',
    'MG': 'Belo Horizonte',
    'PA': 'Belém',
    'PB': 'João Pessoa',
    'PR': 'Curitiba',
    'PE': 'Recife',
    'PI': 'Teresina',
    'RJ': 'Rio de Janeiro',
    'RN': 'Natal',
    'RS': 'Porto Alegre',
    'RO': 'Porto Velho',
    'RR': 'Boa Vista',
    'SC': 'Florianópolis',
    'SP': 'São Paulo',
    'SE': 'Aracaju',
    'TO': 'Palmas',
};

stateSelect.addEventListener('change', function() {
    const stateSelected = this.value;

    if (stateSelected) {
        const city = capitals[stateSelected];
        searchPrediction(city);
    } else {
        predictDiv.innerHTML = '';
    }
});

function searchPrediction(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city},BR&appid=${apiKey}&units=metric&lang=pt_br`;

    fetch(apiUrl)
    .then(response => {
        if (!response.ok) {
            throw new Error(`Requisition Error: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        exhibitPrediction(data);
    })
    .catch(error => {
        console.error('Error at Prediction Search:', error);
        predictDiv.innerHTML = `<p>Error at Weather Report Search. Try Again Later.</p>`;
    });
}

function exhibitPrediction(data) {
    const temperature = data.main.temp;
    const description = data.weather[0].description;
    const icon = data.weather[0].icon;
    const city = data.name;

    const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

    const predictionHTML = `
    <h2>Weather Report in ${city}</h2>
    <p>Temperature: ${temperature}°C</p>
    <p>Description: ${description}</p>
    <img src="${iconUrl}" alt="Time Icon">
    `;

    predictDiv.innerHTML = predictionHTML;
}