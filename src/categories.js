import { tasksRender } from "./tasks";

function Category(name) {
    this.name = name;
    this.id = (() => this.name+ Math.floor(Math.random() * 50))();
};
export function updateCategorySelectList () {
    const selectCategoryList = document.querySelector('#selectCategory');
    const noCategoryOption = selectCategoryList.querySelector('option[value="No category"]');
    selectCategoryList.innerHTML = ""; 
    selectCategoryList.appendChild(noCategoryOption);
    
    categoryManager.getCategories().forEach(category => {
        if (category.name !== 'No category') {
            const categoryListItem = document.createElement('option');
            categoryListItem.value = category.name;
            categoryListItem.textContent = category.name;
            selectCategoryList.appendChild(categoryListItem);
        }
    });
}
export function updateCategorySelectListA() {
    const modalWrapper = document.querySelector('.modal'); 
    const selectCategoryList = modalWrapper.querySelector('#selectCategory'); 
    const noCategoryOption = selectCategoryList.querySelector('option[value="No category"]');
    selectCategoryList.innerHTML = ""; 
    selectCategoryList.appendChild(noCategoryOption);
    
    categoryManager.getCategories().forEach(category => {
        if (category.name !== 'No category') {
            const categoryListItem = document.createElement('option');
            categoryListItem.value = category.name;
            categoryListItem.textContent = category.name;
            selectCategoryList.appendChild(categoryListItem);
        }
    });
}

export const categoryManager = (() => {
    let storedCategories = localStorage.getItem('categories');
    let categories = [];

    if (storedCategories) {

        categories = JSON.parse(storedCategories);
    }

    const createCategory = (name) => {
        const newCategory = new Category(name);
        categories.push(newCategory);
        updateCategorySelectList();
        localStorage.setItem('categories', JSON.stringify(categories));
        return newCategory;
    }
    const getCategories = () => categories;
    
    return {createCategory,
            getCategories
    };

})();

export function renderCategories() {
    const categoryList = document.querySelector('.category-list');
    categoryList.innerHTML = ''; 

    const categories = categoryManager.getCategories();

    categories.forEach(category => {
        if (category.name !== 'No category') {
        const newCategoryDiv = document.createElement('div');
        newCategoryDiv.classList.add('category');
        newCategoryDiv.setAttribute('data-category-id', category.id);
        
        const newCategoryButton = document.createElement('button');
        newCategoryButton.classList.add('category-main')
        newCategoryButton.textContent = category.name;
        
        const deleteCategoryBtn = document.createElement('button');
        deleteCategoryBtn.textContent = 'Delete';
        deleteCategoryBtn.classList.add('deleteCategoryBtn');
        deleteCategoryBtn.type = 'button';
        deleteCategoryBtn.innerHTML = '<i class="fa fa-times" aria-hidden="true">';

        newCategoryDiv.appendChild(newCategoryButton);
        newCategoryDiv.appendChild(deleteCategoryBtn);
        categoryList.appendChild(newCategoryDiv);
        }
    });
}

export function categoryButtonsEventListener() {
    const addCategoryBtn = document.querySelector('#add-category-btn');
    const submitCategoryBtn = document.querySelector('#submitCategoryBtn');
    const cancelCategoryBtn = document.querySelector('#cancelCategoryBtn');
    const categoryList = document.querySelector('.category-list')
    
    addCategoryBtn.addEventListener('click', ()=> {
        const addCategoryPopup = document.querySelector('#add-category-popup');
        const addCategoryBtn = document.querySelector('#add-category-btn');
        addCategoryPopup.style.display = 'flex';
        addCategoryBtn.style.display = 'none';

    })

    submitCategoryBtn.addEventListener('click', (event) =>{
        event.preventDefault();
        const categoryList = document.querySelector('.category-list');
        const addCategoryPopup = document.querySelector('#add-category-popup');
        const categoryName = document.querySelector('#categoryName').value.trim();
        const addCategoryBtn = document.querySelector('#add-category-btn');
        const categoryInput = document.querySelector('#categoryName');

        const newCategory = categoryManager.createCategory(categoryName);

        const newCategoryDiv = document.createElement('div');
        newCategoryDiv.classList.add('category');
        newCategoryDiv.setAttribute('data-category-id', newCategory.id);
        const newCategoryButton = document.createElement('button');
        const deleteCategoryBtn = document.createElement('button');
        deleteCategoryBtn.textContent = 'Delete';
        deleteCategoryBtn.classList.add('deleteCategoryBtn');
        deleteCategoryBtn.type = 'button';
        deleteCategoryBtn.innerHTML = '<i class="fa fa-times" aria-hidden="true">';
        newCategoryButton.classList.add('category-main')
        newCategoryButton.textContent = newCategory.name; 
        
        categoryList.appendChild(newCategoryDiv);
        newCategoryDiv.appendChild(newCategoryButton);
        newCategoryDiv.appendChild(deleteCategoryBtn);

        addCategoryPopup.style.display = 'none';
        addCategoryBtn.style.display = 'block';
        categoryInput.value = "";
        
    });

    cancelCategoryBtn.addEventListener('click', () => {
        const addCategoryBtn = document.querySelector('#add-category-btn');
        const addCategoryPopup = document.querySelector('#add-category-popup');

        addCategoryPopup.style.display = 'none';
        addCategoryBtn.style.display = 'block';
    });

    categoryList.addEventListener('click', (e) => {
    if (e.target && e.target.classList.contains('deleteCategoryBtn') || e.target.closest('.deleteCategoryBtn')){
        const currentCategory = e.target.closest('.category');
        if (currentCategory){
            const categoryIdtoDelete = currentCategory.getAttribute('data-category-id');
            if (categoryIdtoDelete){
                const categoryIndex = categoryManager.getCategories().findIndex(category => category.id === categoryIdtoDelete);
                if (categoryIndex !== -1){
                    categoryManager.getCategories().splice(categoryIndex, 1);
                    localStorage.setItem('categories', JSON.stringify(categoryManager.getCategories()));
                    currentCategory.remove();
                    updateCategorySelectList();
                }
            }
        }
    }
    });
}
