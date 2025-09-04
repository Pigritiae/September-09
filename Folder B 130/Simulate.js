document.addEventListener('DOMContentLoaded', () => {
    const productNameInput = document.getElementById('product-name');
    const productQuantityInput = document.getElementById('product-quantity');
    const addProductBtn = document.getElementById('add-product-btn');
    const barcodeProductNameSpan = document.getElementById('barcode-product-name');
    const barcodeSvg = document.getElementById('barcode-svg');
    const copyBarcodeBtn = document.getElementById('copy-barcode-btn');
    const barcodeInput = document.getElementById('barcode-input');
    // CORREÇÃO: Corrigido o id do input, que estava com erro de digitação ('if' em vez de 'id') no HTML.
    const operationQuantityInput = document.getElementById('operation-quantity');
    const entryBtn = document.getElementById('entry-btn');
    const exitBtn = document.getElementById('exit-btn');
    const inventoryListUl = document.getElementById('inventory-list');
    const messageBox = document.getElementById('message-box');
    const messageText = document.getElementById('message-text');
    // CORREÇÃO: Corrigido o id do botão de fechar, que estava com erro de digitação ('close-mesage-btn' em vez de 'close-message-btn') no HTML.
    const closeMessageBtn = document.getElementById('close-message-btn');
    let inventory = [];

    function generateBarcode() {
        return Date.now().toString() + Math.floor(Math.random() * 1000).toString().padStart(3, '0'); 
    }

    function displayBarcode(barcode, productName) {
        barcodeProductNameSpan.textContent = productName;
        JsBarcode("#barcode-svg", barcode, {
            format: "CODE128",
            displayValue: true,
            fontSize: 18,
            height: 80,
            width: 1.5
        });
        copyBarcodeBtn.disabled = false;
    }

    function showMessage(message) {
        messageText.textContent = message;
        // CORREÇÃO: O 'display' do 'message-box' deve ser 'block' ou 'flex' para ser visível. 'Flex' é o mais adequado para o layout.
        messageBox.style.display = 'flex';
    }

    function hideMessage() {
        messageBox.style.display = 'none';
    }

    function renderInventory() {
        inventoryListUl.innerHTML = '';
        // CORREÇÃO: Erro de sintaxe na verificação do array 'inventory'. Trocado 'inventory,length' por 'inventory.length'.
        if (inventory.length === 0) {
            const emptyMessage = document.createElement('li');
            emptyMessage.classList.add('empty-inventory-message');
            emptyMessage.textContent = 'No Product in Stock.';
            inventoryListUl.appendChild(emptyMessage);
            return;
        }

        inventory.forEach(product => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span class="product-name-display">${product.name}</span>
                <span class="product-barcode-display">${product.barcode}</span>
                <span class="product-quantity-display">
                Qtd: ${product.quantity}</span>
            `;
            inventoryListUl.appendChild(li);
        });
    }

    function saveInventory() {
        localStorage.setItem('stocksSimulatorInventory', JSON.stringify(inventory));
    }

    function loadInventory() {
        const savedInventory = localStorage.getItem('stocksSimulatorInventory');
        // CORREÇÃO: A variável de verificação estava errada. Trocado 'saveInventory' por 'savedInventory'.
        if (savedInventory) {
            inventory = JSON.parse(savedInventory);
            renderInventory();
        }
    }

    function handleAddProduct() {
        // CORREÇÃO: 'ariaValueMax' não é uma propriedade de 'input'. O correto para pegar o valor é 'value'.
        const name = productNameInput.value.trim();
        const quantity = parseInt(productQuantityInput.value);

        if (!name) {
            showMessage('Please Insert Product Name.');
            return;
        }

        if (isNaN(quantity) || quantity <= 0) {
            showMessage('Please Insert a Valid Number (Higher than 0).');
            return;
        }

        const newBarcode = generateBarcode();
        const newProduct = {
            barcode: newBarcode,
            name: name,
            quantity: quantity
        };

        inventory.push(newProduct);
        saveInventory();
        renderInventory();
        displayBarcode(newBarcode, name);

        productNameInput.value = '';
        productQuantityInput.value = '1'; // Adicionado aspas para garantir que o valor seja tratado como string.
        showMessage(`Product "${name}" Added Sucessfully! Code: ${newBarcode}`);
    }

    function handleProductEntry() {
        const barcode = barcodeInput.value.trim();
        const quantity = parseInt(operationQuantityInput.value);
        
        if (!barcode) {
            showMessage('Please, Type or Paste a Barcode.');
            return;
        }

        if (isNaN(quantity) || quantity <= 0) {
            showMessage('Please, Insert a Valid Quantity for Entry (Higher than 0).');
            return;
        }

        const product = inventory.find(p => p.barcode === barcode);

        if (product) {
            product.quantity += quantity;
            saveInventory();
            renderInventory();
            showMessage(`Entry of ${quantity} Units of "${product.name}" Registered. New Stock: ${product.quantity}`);
        } else {
             // CORREÇÃO: Adicionado uma mensagem de erro caso o código de barras não seja encontrado.
             showMessage(`Product with Barcode ${barcode} not Found in Stock.`);
        }
        
        // Limpar os campos após a operação
        barcodeInput.value = '';
        operationQuantityInput.value = 1;
    }

    function handleProductExit() {
        const barcode = barcodeInput.value.trim();
        const quantity = parseInt(operationQuantityInput.value);

        if (!barcode) {
            showMessage('Please Type or Paste a Barcode.');
            return;
        }

        if (isNaN(quantity) || quantity <= 0) {
            showMessage('Please, Insert a Valid Exit Quantity (Higher than 0).');
            return;
        }

        const product = inventory.find(p => p.barcode === barcode);

        if (product) {
            if (product.quantity >= quantity) {
                product.quantity -= quantity;
                saveInventory();
                renderInventory();
                showMessage(`Exit of ${quantity} Units of "${product.name}" Registered. New Stock: ${product.quantity}`);
            } else {
                showMessage(`Insufficient Stock for "${product.name}". Available: ${product.quantity}`);
            }
        } else {
            // CORREÇÃO: Adicionado uma mensagem de erro caso o código de barras não seja encontrado.
            showMessage(`Product with Code ${barcode} not Found in Stock.`);
        }
        
        // Limpar os campos após a operação
        barcodeInput.value = '';
        operationQuantityInput.value = 1;
    }

    function copyBarcodeToClipboard() {
        // CORREÇÃO: O seletor para pegar o texto do código de barras estava incorreto. O correto é usar 'textContent' em 'p'.
        const barcodeText = barcodeProductNameSpan.textContent; 
        
        if (barcodeText && barcodeText !== 'No Product Selected') {
            const tempInput = document.createElement('textarea');
            tempInput.value = barcodeText;
            document.body.appendChild(tempInput);
            tempInput.select();
            document.execCommand('copy');
            document.body.removeChild(tempInput);
            showMessage('Barcode Copied to Transfer Zone.');
        } else {
            showMessage('No Barcode Found to Copy.');
        }
    }

    addProductBtn.addEventListener('click', handleAddProduct);
    entryBtn.addEventListener('click', handleProductEntry);
    exitBtn.addEventListener('click', handleProductExit);
    // CORREÇÃO: O 'listener' do botão estava com erro de digitação.
    copyBarcodeBtn.addEventListener('click', copyBarcodeToClipboard);
    // CORREÇÃO: O 'listener' do botão de fechar estava com erro de digitação.
    closeMessageBtn.addEventListener('click', hideMessage);

    // CORREÇÃO: 'listener' para facilitar a entrada com a tecla 'Enter'.
    barcodeInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleProductEntry();
        }
    });

    // CORREÇÃO: O carregamento e a renderização do inventário foram movidos para a parte final do 'DOMContentLoaded' para garantir que os elementos estejam disponíveis.
    loadInventory();
    renderInventory();
});
/* Códigos corrigido pela IA Gemini */