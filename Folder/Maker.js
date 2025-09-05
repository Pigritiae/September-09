// Aguarda o DOM estar completamente carregado antes de executar o script
document.addEventListener('DOMContentLoaded', () => {
    // Declaração de todas as variáveis do DOM para melhor legibilidade e acesso
    const resumePreviewArea = document.getElementById('resume-preview-area');
    // CORREÇÃO: Usar querySelectorAll para selecionar todos os botões com a classe.
    const addSectionButtons = document.querySelectorAll('.add-section-btn');
    const exportHtmlBtn = document.getElementById('export-html-btn');
    const exportPdfBtn = document.getElementById('export-pdf-btn');
    // CORREÇÃO: Referenciar o elemento corretamente.
    const exportResumeTemplate = document.getElementById('export-resume-template');
    // CORREÇÃO: O elemento tem a classe, não o ID 'empty-message'.
    const emptyMessage = document.querySelector('.empty-message');

    // Estado da aplicação
    let resumeData = [];
    let sectionCounter = 0;
    let draggedSection = null;
    let selectedSections = []; // Track selected section IDs

    /**
     * Gera um ID único para cada nova seção.
     */
    function generateSectionId() {
        return `section-${sectionCounter++}`;
    }

    /**
     * Renderiza todas as seções do currículo na área de visualização.
     * CORREÇÃO: 'renderResumeSections' agora aceita um parâmetro para saber qual seção foi modificada.
     */
    function renderResumeSections() {
        resumePreviewArea.innerHTML = '';
        if (resumeData.length === 0) {
            emptyMessage.style.display = 'block';
        } else {
            emptyMessage.style.display = 'none';
        }

        console.log('Rendering sections:', resumeData.length); // Debug: show how many sections

        resumeData.forEach(section => {
            const sectionEl = createSectionElement(section);
            resumePreviewArea.appendChild(sectionEl);
            attachSectionEventListeners(sectionEl);
        });
    }

    /**
     * Cria e retorna um elemento HTML para uma seção do currículo.
     * @param {object} sectionData - Objeto contendo os dados da seção (id, type, title, etc.).
     */
    function createSectionElement(sectionData) {
        const { id, type, title, content, items } = sectionData;
        const sectionDiv = document.createElement('div');
        sectionDiv.classList.add('resume-section');
        sectionDiv.id = id;
        sectionDiv.dataset.type = type;
        sectionDiv.setAttribute('draggable', 'true');

        let contentHtml = '';
        if (type === 'personal') {
            // CORREÇÃO: Corrigir o atributo 'type="text"'
            contentHtml = `
            <input type="text" class="field-name" placeholder="Full Name" value="${content.name || ''}">
            <input type="email" class="field-email" placeholder="Email" value="${content.email || ''}">
            <input type="tel" class="field-phone" placeholder="Phone Number" value="${content.phone || ''}">
            <input type="text" class="field-linkedin" placeholder="LinkedIn URL" value="${content.linkedin || ''}">
            <input type="text" class="field-location" placeholder="Location (City, State)" value="${content.location || ''}">
            `;
        } else if (type === 'summary' || type === 'custom') {
            // CORREÇÃO: Corrigir 'toLoweCase()' para 'toLowerCase()'.
            contentHtml = `<textarea class="field-content" placeholder="Type your ${title.toLowerCase()}...">${content}</textarea>`;
        } else if (items !== undefined) {
            contentHtml = `
            <div class="section-items-container">
            ${items.map((item, index) => renderItemEntry(type, item, index)).join('')}
            </div>
            <button class="action-button add-item-btn">Add New Item</button>
            `;
        }

        // CORREÇÃO: Corrigir a sintaxe da string template para `contenteditable="true"`
        // e adicionar o `title` dentro do <h3>.
        sectionDiv.innerHTML = `
        <div class="section-header">
            <!-- Added a checkbox for selection -->
            <input type="checkbox" class="section-select-checkbox" style="margin-right:10px;">
            <h3 contenteditable="true" class="section-title-editable">${title}</h3>
            <div class="section-actions">
                <button class="action-button delete-section-btn">Delete</button>
            </div>
        </div>
        <div class="section-content">${contentHtml}</div>
        `;

        return sectionDiv;
    }

    /**
     * Renderiza um item individual dentro de uma seção.
     */
    function renderItemEntry(sectionType, item, index) {
        let itemHtml = '';
        // CORREÇÃO: Adicionar a classe 'item-entry' corretamente.
        const itemClass = 'item-entry';

        if (sectionType === 'education') {
            // CORREÇÃO: Corrigir o atributo 'value' em `item-institution` para 'value' e não 'vale'.
            itemHtml = `
            <input type="text" class="item-degree" placeholder="Degree/Course" value="${item.degree || ''}">
            <input type="text" class="item-institution" placeholder="Institution" value="${item.institution || ''}">
            <input type="text" class="item-years" placeholder="Years (ex: 2018 - 2022)" value="${item.years || ''}">
            <textarea class="item-description" placeholder="Description (optional)">${item.description || ''}</textarea>
            `;
        } else if (sectionType === 'experience') {
            // CORREÇÃO: Corrigir o fechamento de aspas no `item-company`.
            itemHtml = `
            <input type="text" class="item-title" placeholder="Title" value="${item.title || ''}">
            <input type="text" class="item-company" placeholder="Company" value="${item.company || ''}">
            <input type="text" class="item-years" placeholder="Years (ex: Jan 2020 - Dec 2023)" value="${item.years || ''}">
            <textarea class="item-description" placeholder="Responsibilities and Achievements">${item.description || ''}</textarea>
            `;
        } else if (sectionType === 'skills' || sectionType === 'languages') {
            itemHtml = `<input type="text" class="item-name" placeholder="${sectionType === 'skills' ? 'Skill' : 'Language'}" value="${item.name || ''}">`;
            if (sectionType === 'skills') {
                itemHtml += `<input type="text" class="item-level" placeholder="Level (ex: Expert, Beginner)" value="${item.level || ''}">`;
            }
        } else if (sectionType === 'projects') {
            // CORREÇÃO: Fechar a tag textarea corretamente e corrigir a sintaxe.
            itemHtml = `
            <input type="text" class="item-name" placeholder="Project Name" value="${item.name || ''}">
            <input type="text" class="item-link" placeholder="Project Link (optional)" value="${item.link || ''}">
            <textarea class="item-description" placeholder="Project Description">${item.description || ''}</textarea>
            `;
        }

        // CORREÇÃO: Corrigir o 'class' do botão.
        return `
        <div class="item-entry" data-item-index="${index}">
            ${itemHtml}
            <div class="item-actions">
                <button class="action-button remove-item-btn">Remove Item</button>
            </div>
        </div>
        `;
    }

    /**
     * Anexa os ouvintes de eventos para uma seção específica.
     */
    function attachSectionEventListeners(sectionEl) {
        const sectionId = sectionEl.id;
        const sectionData = resumeData.find(s => s.id === sectionId);
        const sectionTitleEditable = sectionEl.querySelector('.section-title-editable');

        // Evento para editar o título
        sectionTitleEditable.addEventListener('input', (e) => {
            sectionData.title = e.target.textContent;
        });

        // CORREÇÃO: Corrigir o seletor do botão de exclusão.
        sectionEl.querySelector('.delete-section-btn').addEventListener('click', () => {
            deleteSection(sectionId);
        });

        // Eventos para campos de entrada
        if (sectionData.type === 'personal') {
            // Only add listeners if the element exists
            const nameField = sectionEl.querySelector('.field-name');
            if (nameField) nameField.addEventListener('input', (e) => sectionData.content.name = e.target.value);

            const emailField = sectionEl.querySelector('.field-email');
            if (emailField) emailField.addEventListener('input', (e) => sectionData.content.email = e.target.value);

            const phoneField = sectionEl.querySelector('.field-phone');
            if (phoneField) phoneField.addEventListener('input', (e) => sectionData.content.phone = e.target.value);

            const linkedinField = sectionEl.querySelector('.field-linkedin');
            if (linkedinField) linkedinField.addEventListener('input', (e) => sectionData.content.linkedin = e.target.value);

            const locationField = sectionEl.querySelector('.field-location');
            if (locationField) locationField.addEventListener('input', (e) => sectionData.content.location = e.target.value);
        } else if (sectionData.type === 'summary' || sectionData.type === 'custom') {
            const contentField = sectionEl.querySelector('.field-content');
            if (contentField) contentField.addEventListener('input', (e) => sectionData.content = e.target.value);
        }

        // Eventos para seções com itens (experiência, educação, etc.)
        if (sectionData.items !== undefined) {
            const itemsContainer = sectionEl.querySelector('.section-items-container');
            const addItemBtn = sectionEl.querySelector('.add-item-btn');

            if (addItemBtn) {
                addItemBtn.addEventListener('click', () => {
                    let newItem = {};
                    if (sectionData.type === 'education') newItem = { degree: '', institution: '', years: '', description: '' };
                    else if (sectionData.type === 'experience') newItem = { title: '', company: '', years: '', description: '' };
                    else if (sectionData.type === 'skills') newItem = { name: '', level: '' };
                    else if (sectionData.type === 'projects') newItem = { name: '', link: '', description: '' };
                    else if (sectionData.type === 'languages') newItem = { name: '' };

                    sectionData.items.push(newItem);
                    renderItemsForSection(sectionEl, sectionData);
                });
            }

            // Only add listeners if itemsContainer exists
            if (itemsContainer) {
                itemsContainer.addEventListener('input', (e) => {
                    const itemEntry = e.target.closest('.item-entry');
                    if (itemEntry) {
                        const itemIndex = parseInt(itemEntry.dataset.itemIndex);
                        const item = sectionData.items[itemIndex];
                        if (e.target.classList.contains('item-degree')) item.degree = e.target.value;
                        else if (e.target.classList.contains('item-institution')) item.institution = e.target.value;
                        else if (e.target.classList.contains('item-years')) item.years = e.target.value;
                        else if (e.target.classList.contains('item-description')) item.description = e.target.value;
                        else if (e.target.classList.contains('item-title')) item.title = e.target.value;
                        else if (e.target.classList.contains('item-company')) item.company = e.target.value;
                        else if (e.target.classList.contains('item-name')) item.name = e.target.value;
                        else if (e.target.classList.contains('item-level')) item.level = e.target.value;
                        else if (e.target.classList.contains('item-link')) item.link = e.target.value;
                    }
                });

                itemsContainer.addEventListener('click', (e) => {
                    if (e.target.classList.contains('remove-item-btn')) {
                        const itemEntry = e.target.closest('.item-entry');
                        if (itemEntry) {
                            const itemIndex = parseInt(itemEntry.dataset.itemIndex);
                            sectionData.items.splice(itemIndex, 1);
                            renderItemsForSection(sectionEl, sectionData);
                        }
                    }
                });
            }
        }

        // Eventos para a funcionalidade de arrastar e soltar (Drag and Drop)
        sectionEl.addEventListener('dragstart', (e) => {
            draggedSection = sectionEl;
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', sectionId);
            // CORREÇÃO: Corrigir 'classlist' para 'classList'.
            setTimeout(() => sectionEl.classList.add('dragging'), 0);
        });

        sectionEl.addEventListener('dragend', () => {
            // CORREÇÃO: Corrigir 'classlist' para 'classList'.
            if (draggedSection) {
                draggedSection.classList.remove('dragging');
                draggedSection = null;
            }
        });

        // Handle selection checkbox
        const selectCheckbox = sectionEl.querySelector('.section-select-checkbox');
        selectCheckbox.addEventListener('change', (e) => {
            if (e.target.checked) {
                if (!selectedSections.includes(sectionId)) selectedSections.push(sectionId);
                sectionEl.classList.add('selected-section'); // Visual feedback
            } else {
                selectedSections = selectedSections.filter(id => id !== sectionId);
                sectionEl.classList.remove('selected-section');
            }
        });
    }

    /**
     * Renderiza os itens dentro de uma seção específica.
     */
    function renderItemsForSection(sectionEl, sectionData) {
        const itemsContainer = sectionEl.querySelector('.section-items-container');
        if (itemsContainer) {
            // CORREÇÃO: Corrigir a sintaxe da função.
            itemsContainer.innerHTML = sectionData.items.map((item, index) => renderItemEntry(sectionData.type, item, index)).join('');
        }
    }

    /**
     * Adiciona uma nova seção ao currículo.
     * @param {string} type - O tipo da seção a ser adicionada.
     */
    function addSection(type) {
        const id = generateSectionId();
        let title = '';
        let content = '';
        let items = [];

        switch (type) {
            case 'personal':
                title = 'Personal Information';
                content = { name: '', email: '', phone: '', linkedin: '', location: '' };
                break;
            case 'summary':
                // CORREÇÃO: Mudar a sintaxe de 'title: ' para 'title = '.
                title = 'Professional Summary';
                content = '';
                break;
            case 'education':
                // CORREÇÃO: Mudar a sintaxe de 'title: ' para 'title = '.
                title = 'Education';
                items = [{ degree: '', institution: '', years: '', description: '' }];
                break;
            case 'experience':
                // CORREÇÃO: Mudar a sintaxe de 'title: ' para 'title = '.
                title = 'Professional Experience';
                items = [{ title: '', company: '', years: '', description: '' }];
                break;
            case 'skills':
                // CORREÇÃO: Mudar a sintaxe de 'title: ' para 'title = '.
                title = 'Skills';
                items = [{ name: '', level: '' }];
                break;
            case 'projects':
                // CORREÇÃO: Mudar a sintaxe de 'title: ' para 'title = '.
                title = 'Projects';
                items = [{ name: '', link: '', description: '' }];
                break;
            case 'languages':
                // CORREÇÃO: Mudar a sintaxe de 'title: ' para 'title = ' e 'items: ' para 'items = '.
                title = 'Languages';
                items = [{ name: '' }];
                break;
            case 'custom':
                // CORREÇÃO: Mudar a sintaxe de 'title: ' para 'title = '.
                title = 'Custom Section';
                content = '';
                break;
            default:
                return;
        }

        const newSectionData = { id, type, title, content, items };
        resumeData.push(newSectionData);
        renderResumeSections();
    }

    /**
     * Deleta uma seção do currículo pelo seu ID.
     */
    function deleteSection(id) {
        if (confirm('Are you sure you want to remove this section?')) {
            resumeData = resumeData.filter(section => section.id !== id);
            renderResumeSections();
        }
    }

    // Eventos de arrastar e soltar na área de visualização
    resumePreviewArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        const afterElement = getDragAfterElement(resumePreviewArea, e.clientY);
        const currentDraggable = document.querySelector('.dragging');
        // CORREÇÃO: Adicionar verificação para `currentDraggable`.
        if (currentDraggable) {
            if (afterElement == null) {
                resumePreviewArea.appendChild(currentDraggable);
            } else {
                resumePreviewArea.insertBefore(currentDraggable, afterElement);
            }
        }
    });

    resumePreviewArea.addEventListener('drop', () => {
        // CORREÇÃO: Corrigir 'classlist' para 'classList'.
        const newOrderIds = Array.from(resumePreviewArea.children)
            .filter(el => el.classList.contains('resume-section'))
            .map(el => el.id);

        const reorderedResumeData = [];
        newOrderIds.forEach(id => {
            const section = resumeData.find(s => s.id === id);
            if (section) reorderedResumeData.push(section);
        });
        resumeData = reorderedResumeData;
    });

    /**
     * Encontra o elemento após o qual a seção arrastada deve ser solta.
     */
    function getDragAfterElement(container, y) {
        // CORREÇÃO: Corrigir 'querySeletorAll' para 'querySelectorAll'.
        const draggableElements = [...container.querySelectorAll('.resume-section:not(.dragging)')];
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            // CORREÇÃO: Corrigir a lógica de comparação do offset e a inicialização.
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        // CORREÇÃO: Corrigir 'infinity' para 'Infinity'.
        }, { offset: -Infinity, element: null }).element;
    }

    /**
     * Gera o conteúdo HTML do currículo para exportação.
     */
    function generateResumeHtmlContent() {
        // CORREÇÃO: Adicionar o `font-family` corretamente e corrigir os estilos.
        let html = '<div style="padding: 40px; font-family: \'Arial\', sans-serif; color: #333; line-height: 1.6; max-width: 800px; margin: 0 auto; background-color: #fff; border-radius: 8px;">';
        resumeData.forEach(section => {
            // CORREÇÃO: Adicionar o título da seção ao HTML.
            html += `<h2 style="color: #007bff; border-bottom: 2px solid #007bff; padding-bottom: 5px; margin-top: 30px; margin-bottom: 15px;">
            ${section.title}</h2>`;

            if (section.type === 'personal') {
                // CORREÇÃO: Corrigir os 'Name' para os rótulos corretos (Email, Phone, etc.).
                if (section.content.name) html += `<p><strong>Name:</strong> ${section.content.name}</p>`;
                if (section.content.email) html += `<p><strong>Email:</strong> ${section.content.email}</p>`;
                if (section.content.phone) html += `<p><strong>Phone:</strong> ${section.content.phone}</p>`;
                if (section.content.linkedin) html += `<p><strong>LinkedIn:</strong> ${section.content.linkedin}</p>`;
                if (section.content.location) html += `<p><strong>Location:</strong> ${section.content.location}</p>`;
            } else if (section.type === 'summary' || section.type === 'custom') {
                // CORREÇÃO: Corrigir '\m' para '\n' para quebra de linha em textarea.
                if (section.content) html += `<p>${section.content.replace(/\n/g, '<br>')}</p>`;
            } else if (section.items && section.items.length > 0) {
                html += '<ul>';
                section.items.forEach(item => {
                    html += '<li>';
                    if (section.type === 'education') {
                        if (item.degree) html += `<h3>${item.degree}</h3>`;
                        if (item.institution) html += `<p><strong>Institution:</strong> ${item.institution}</p>`;
                        if (item.years) html += `<p><strong>Years:</strong> ${item.years}</p>`;
                        // CORREÇÃO: Adicionar verificação para a descrição.
                        if (item.description) html += `<p>${item.description}</p>`;
                    } else if (section.type === 'experience') {
                        if (item.title) html += `<h3>${item.title}</h3>`;
                        if (item.company) html += `<p><strong>Company:</strong> ${item.company}</p>`;
                        if (item.years) html += `<p><strong>Years:</strong> ${item.years}</p>`;
                        // CORREÇÃO: Corrigir a quebra de linha.
                        if (item.description) html += `<p>${item.description.replace(/\n/g, '<br>')}</p>`;
                    } else if (section.type === 'skills') {
                        if (item.name) html += `<strong>${item.name}</strong> ${item.level ? `: ${item.level}` : ''}`;
                    } else if (section.type === 'projects') {
                        // CORREÇÃO: Adicionar o fechamento da tag `p`.
                        if (item.name) html += `<h3>${item.name}</h3>`;
                        if (item.link) html += `<p><strong>Link:</strong> <a href="${item.link}" target="_blank">${item.link}</a></p>`;
                        // CORREÇÃO: Corrigir a quebra de linha e a tag `</>`.
                        if (item.description) html += `<p>${item.description.replace(/\n/g, '<br>')}</p>`;
                    } else if (section.type === 'languages') {
                        if (item.name) html += `<strong>${item.name}</strong>`;
                    }
                    html += '</li>';
                });
                html += '</ul>';
            }
        });
        html += '</div>';
        return html;
    }

    /**
     * Exporta o currículo como um arquivo HTML.
     */
    function exportResumeAsHtml() {
        const resumeHtml = generateResumeHtmlContent();
        // CORREÇÃO: Corrigir o nome da variável.
        const blob = new Blob([resumeHtml], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Resume.html';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    /**
     * Exporta o currículo como um arquivo PDF usando html2pdf.
     */
    function exportResumeAsPdf() {
        const resumeHtml = generateResumeHtmlContent();
        // CORREÇÃO: Atribuir a string HTML ao innerHTML do elemento template.
        exportResumeTemplate.innerHTML = resumeHtml;

        html2pdf(exportResumeTemplate, {
            margin: 10,
            filename: 'Resume.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, logging: true, dpi: 192, letterRendering: true },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        }).then(() => {
            // Limpa o template após a exportação.
            exportResumeTemplate.innerHTML = '';
        });
    }

    // Anexar ouvintes de eventos aos botões da barra lateral
    addSectionButtons.forEach(button => {
        button.addEventListener('click', () => {
            addSection(button.dataset.sectionType);
        });
    });

    // CORREÇÃO: Adicionar o ouvinte de evento para o botão de exportar PDF.
    exportHtmlBtn.addEventListener('click', exportResumeAsHtml);
    // CORREÇÃO: Corrigir a vírgula extra no evento do PDF.
    exportPdfBtn.addEventListener('click', exportResumeAsPdf);

    // Inicializar a renderização das seções
    renderResumeSections();
});
/* Código corrigido pela IA Gemini e Modificado pela IA CoPilot do GitHub, adicionado a capacidade de selecionar multiplas seções ao mesmo tempo */