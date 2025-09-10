document.addEventListener('DOMContentLoaded', () => {
    const postTitleInput = document.getElementById('post-title');
    const postContentTextarea = document.getElementById('post-content');
    const postCategorySelect = document.getElementById('post-category');
    const publishPostBtn = document.getElementById('publish-post-btn');
    const newCategoryNameInput = document.getElementById('new-category-name');
    const addCategoryBtn = document.getElementById('add-category-btn');
    const categoriesListUl = document.getElementById('categories-list');
    const filterCategorySelect = document.getElementById('filter-category');
    const postsListDiv = document.getElementById('posts-list');
    const messageBox = document.getElementById('message-box');
    const messageText = document.getElementById('message-text');
    const closeMessageBtn = document.getElementById('close-message-btn');

    let categories = [];
    let posts = [];

    // Função para gerar um ID de post único.
    function generatePostId() {
        // CORREÇÃO: "Masth" foi alterado para "Math". É um erro de digitação.
        return `post-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    }

    // Função para gerar um ID de categoria único.
    function generateCategoryId() {
        // CORREÇÃO: "DataTransfer" foi alterado para "Date". É um erro de digitação.
        return `cat-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    }

    function showMessage(message) {
        messageText.textContent = message;
        messageBox.style.display = 'flex';
    }

    function hideMessage() {
        messageBox.style.display = 'none';
    }

    function renderCategories() {
        categoriesListUl.innerHTML = '';
        postCategorySelect.innerHTML =
            '<option value="">Select a Category</option>';
        filterCategorySelect.innerHTML =
            '<option value="all">All Categories</option>';

        if (categories.length === 0) {
            const emptyMessage = document.createElement('li');
            emptyMessage.classList.add('empty-message');
            emptyMessage.textContent = 'No Category Added.';
            categoriesListUl.appendChild(emptyMessage);
        } else {
            categories.forEach(category => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <span class="category-name">${category.name}</span>
                    <button class="delete-category-btn" data-category-id="${category.id}">Remove</button>
                `;
                categoriesListUl.appendChild(li);

                const optionPost = document.createElement('option');
                optionPost.value = category.id;
                optionPost.textContent = category.name;
                postCategorySelect.appendChild(optionPost);

                const optionFilter = document.createElement('option');
                optionFilter.value = category.id;
                optionFilter.textContent = category.name;
                filterCategorySelect.appendChild(optionFilter);
            });
        }
    }

    function renderPosts() {
        postsListDiv.innerHTML = '';
        const selectedCategoryId = filterCategorySelect.value;
        // CORREÇÃO: A comparação `selectedCategoryId = 'all'` é uma atribuição (`=`), o que causaria erro de lógica. A comparação correta é `===`.
        const filteredPosts = selectedCategoryId === 'all' ? posts : posts.filter(post => post.category === selectedCategoryId);

        if (filteredPosts.length === 0) {
            const emptyMessage = document.createElement('p');
            emptyMessage.classList.add('empty-message');
            emptyMessage.textContent = 'No Posts Found for this Category.';
            postsListDiv.appendChild(emptyMessage);
            return;
        }

        filteredPosts.forEach(post => {
            const postCard = document.createElement('div');
            // CORREÇÃO: "post-catrd" foi corrigido para "post-card". É um erro de digitação.
            postCard.classList.add('post-card');
            postCard.dataset.postId = post.id;
            // CORREÇÃO: O find estava com um espaço indevido `find (cat => ...)` o correto é `find(cat => ...)`.
            const categoryName = categories.find(cat => cat.id === post.category)?.name || 'No Category';
            const formattedDate = new Date(post.date).toLocaleDateString('pt-BR', {
                year: 'numeric', month: 'long', day: 'numeric'
            });

            postCard.innerHTML = `
                <h3>${post.title}</h3>
                <p class="post-meta">Category: ${categoryName} | Published in: ${formattedDate}</p>
                <p class="post-content-preview">${post.content}</p>
                <div class="post-actions">
                    <button class="action-button edit-post-btn" data-post-id="${post.id}">Edit</button>
                    <button class="action-button delete-post-btn" data-post-id="${post.id}">Delete</button>
                </div>
            `;
            postsListDiv.appendChild(postCard);
        });
    }

    function saveData() {
        // CORREÇÃO: O `JSON.stringify` estava incorreto. Faltava uma vírgula entre o nome da chave e o valor.
        localStorage.setItem('miniCmsCategories', JSON.stringify(categories));
        localStorage.setItem('miniCmsPosts', JSON.stringify(posts));
    }

    function loadData() {
        const savedCategories = localStorage.getItem('miniCmsCategories');
        const savedPosts = localStorage.getItem('miniCmsPosts');
        if (savedCategories) {
            categories = JSON.parse(savedCategories);
        }
        if (savedPosts) {
            posts = JSON.parse(savedPosts);
        }
    }

    function handleAddCategory() {
        const name = newCategoryNameInput.value.trim();
        if (!name) {
            showMessage('Please Insert a Category Name.');
            return;
        }
        // CORREÇÃO: "toLoweCase" foi alterado para "toLowerCase". É um erro de digitação.
        if (categories.some(cat => cat.name.toLowerCase() === name.toLowerCase())) {
            showMessage('This Category already Exists!');
            return;
        }
        const newCategory = { id: generateCategoryId(), name: name };
        categories.push(newCategory);
        saveData();
        renderCategories();
        newCategoryNameInput.value = '';
        showMessage(`Category "${name}" Added!`);
    }

    function handleDeleteCategory(categoryId) {
        if (confirm('Are you Sure you want to Delete this Category? All of its Posts will be Gone.')) {
            categories = categories.filter(cat => cat.id !== categoryId);
            // CORREÇÃO: A lógica para remover posts da categoria apagada estava incorreta, pois ela apenas limpava o campo de categoria, mas não removia o post. A nova lógica agora filtra os posts e remove aqueles que pertencem à categoria deletada.
            posts = posts.filter(post => post.category !== categoryId);
            saveData();
            renderCategories();
            renderPosts();
            showMessage('Category Removed Successfully');
        }
    }

    function handlePublishPost() {
        const title = postTitleInput.value.trim();
        const content = postContentTextarea.value.trim();
        const categoryId = postCategorySelect.value;
        if (!title || !content) {
            showMessage('please, Fill out the Title and Post Content.');
            return;
        }
        if (!categoryId) {
            showMessage('Please Select a Category for this Post.');
            return;
        }
        const postId = publishPostBtn.dataset.editingPostId;
        if (postId) {
            const postIndex = posts.findIndex(p => p.id === postId);
            if (postIndex !== -1) {
                posts[postIndex].title = title;
                posts[postIndex].content = content;
                posts[postIndex].category = categoryId;
                showMessage('Post Updated Successfully!');
            }
            publishPostBtn.textContent = 'Publish';
            delete publishPostBtn.dataset.editingPostId;
        } else {
            const newPost = {
                id: generatePostId(),
                title: title,
                content: content,
                category: categoryId,
                date: new Date().toISOString()
            };
            posts.unshift(newPost);
            showMessage('Post Created Successfully!');
        }
        saveData();
        renderPosts();
        postTitleInput.value = '';
        postContentTextarea.value = '';
        postCategorySelect.value = '';
    }

    function handleEditPost(postId) {
        const postToEdit = posts.find(post => post.id === postId);
        if (postToEdit) {
            postTitleInput.value = postToEdit.title;
            postContentTextarea.value = postToEdit.content;
            postCategorySelect.value = postToEdit.category;
            publishPostBtn.textContent = 'Update Post';
            publishPostBtn.dataset.editingPostId = postId;
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    function handleDeletePost(postId) {
        if (confirm('Are you Sure you want to Delete this Post?')) {
            // CORREÇÃO: A lógica do filtro estava com um erro de sintaxe. Faltava um sinal de `>` entre `post = post.id`. O correto é `post => post.id`.
            posts = posts.filter(post => post.id !== postId);
            saveData();
            renderPosts();
            showMessage('Post Deleted Successfully!');
        }
    }

    addCategoryBtn.addEventListener('click', handleAddCategory);
    publishPostBtn.addEventListener('click', handlePublishPost);
    filterCategorySelect.addEventListener('change', renderPosts);

    categoriesListUl.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-category-btn')) {
            const categoryId = e.target.dataset.categoryId;
            handleDeleteCategory(categoryId);
        }
    });

    postsListDiv.addEventListener('click', (e) => {
        if (e.target.classList.contains('edit-post-btn')) {
            const postId = e.target.dataset.postId;
            handleEditPost(postId);
        } else if (e.target.classList.contains('delete-post-btn')) {
            const postId = e.target.dataset.postId;
            handleDeletePost(postId);
        }
    });

    closeMessageBtn.addEventListener('click', hideMessage);
    messageBox.addEventListener('click', (e) => {
        if (e.target === messageBox) {
            hideMessage();
        }
    });

    loadData();
    renderCategories();
    renderPosts();
});
/* Código corrigido pela IA Gemini */