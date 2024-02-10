import { categoryManager,updateCategorySelectList, updateCategorySelectListA} from "./categories";
import { format , isToday, isThisWeek} from "date-fns";

function Task(name, description, date, priority, selectedCategory, status){
    this.name = name;
    this.description = description;
    this.date = date;
    this.priority = priority;
    this.status = status;
    this.id = name.replace(/\s+/g, '') + Math.floor(Math.random() * 500);
    this.categoryName = selectedCategory;
}

export const taskManager = (() => {
    let storedTasks = localStorage.getItem('tasks');
    let tasks = [];

    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
    }

    const createTask = (name, description, date, priority, selectedCategory, status) => {
        const newTask = new Task (name, description, date, priority, selectedCategory, status);
        tasks.push(newTask);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        return newTask;
    }

    const getTasks = () => tasks;

    const getTasksByCategory = (categoryName) => {
        return tasks.filter(task => task.categoryName === categoryName);
    };

 
    return {
        createTask,
        getTasks,
        getTasksByCategory
    };

})();

let selectedCategory = null;

export function attachCategoryListEventListener() {
    const categoryList = document.querySelector('.category-list');

    categoryList.addEventListener('click', (e) => {
        if (e.target && e.target.classList.contains('category-main')) {
            let selectedCategoryId = e.target.closest('.category').getAttribute('data-category-id');
            selectedCategory = categoryManager.getCategories().find(category => category.id === selectedCategoryId);
            if (selectedCategory) {
                const contentHeader = document.querySelector('.content-header');
                const categoryNameHeader = document.querySelector('#category-name-header');
                
                categoryNameHeader.textContent = selectedCategory.name;

                contentHeader.style.display = 'flex';
                renderForCategories(selectedCategory);
            }
        }
    });
}

function renderForCategories(){
    const taskListContainer = document.querySelector('#task-list');
    taskListContainer.innerHTML = "";

    const tasks = taskManager.getTasks();

    tasks.forEach(task => {
        if (task.categoryName === selectedCategory.name) {
            tasksRender(task);
        }
    });
}

export function renderForToday() {
    const contentHeader = document.querySelector('.content-header');
    const todayHeader = document.querySelector('#category-name-header');
    todayHeader.textContent = "Today's tasks";
    const taskListContainer = document.querySelector('#task-list');
    taskListContainer.innerHTML = "";
    if (contentHeader.style.display = 'none'){
        contentHeader.style.display = 'flex';
    }

    const tasks = taskManager.getTasks();

    tasks.forEach(task => {
        if (isToday(new Date(task.date))) {
            tasksRender(task);
        }
    }); 
}

export function renderForWeek (){
    const contentHeader = document.querySelector('.content-header');
    const todayHeader = document.querySelector('#category-name-header');
    todayHeader.textContent = "This week tasks";
    const taskListContainer = document.querySelector('#task-list');
    taskListContainer.innerHTML = "";
    if (contentHeader.style.display = 'none'){
        contentHeader.style.display = 'flex';
    }

    const tasks = taskManager.getTasks();

    tasks.forEach(task => {
        if (isThisWeek(new Date(task.date))) {
            tasksRender(task);
        }
    }); 
}
export function renderAllTasks(){
    const contentHeader = document.querySelector('.content-header');
    const todayHeader = document.querySelector('#category-name-header');
    todayHeader.textContent = "All your tasks";
    const taskListContainer = document.querySelector('#task-list');
    taskListContainer.innerHTML = "";
    if (contentHeader.style.display = 'none'){
        contentHeader.style.display = 'flex';
    }

    const tasks = taskManager.getTasks();

    tasks.forEach(task => {
            tasksRender(task);
    });
}
export function tasksRender(task){
    const content = document.querySelector('.content');
    const taskListContainer = document.querySelector('#task-list');
    const newTaskDiv = document.createElement('div');
    newTaskDiv.classList.add('task');
    newTaskDiv.setAttribute('data-task-id', task.id);
    const selectCategoryList = document.querySelector('#selectCategory').value;

    const taskElements = document.createElement('div');
    taskElements.classList.add('task-elements');
    const doneCheckBox = document.createElement('input');
    doneCheckBox.type = 'checkbox';
    doneCheckBox.classList.add('checkBox');
    doneCheckBox.setAttribute('data-selected', 'done');
    doneCheckBox.setAttribute('data-unselected', 'undone');
    doneCheckBox.checked = task.status === 'done';
    if (doneCheckBox.checked) {
        newTaskDiv.style.backgroundColor = 'green'; 
    }
    else {
        newTaskDiv.style.backgroundColor = 'rgba(176 218 218 / 67%)';
    }
    doneCheckBox.addEventListener('change', () => {
        if (doneCheckBox.checked) {
            task.status = 'done';
            newTaskDiv.style.backgroundColor = 'green';
        } else {
            task.status = 'undone';
            newTaskDiv.style.backgroundColor = 'rgba(176 218 218 / 67%)';
        }
        localStorage.setItem('tasks', JSON.stringify(taskManager.getTasks()));
    });
    const taskNameRender = document.createElement('h1');
    taskNameRender.classList.add('taskNameRender');
    taskNameRender.textContent = task.name;
    const descriptionBtnRender = document.createElement('button');
    descriptionBtnRender.classList.add('descriptionBtnRender');
    descriptionBtnRender.textContent = 'details';
    const taskDate = task.date.trim(); 
    const dateRender = document.createElement('p');
    dateRender.classList.add('dueDateRender');
    if (taskDate) {
        const dueDate = new Date(taskDate);
        const options = { month: 'long', day: 'numeric' };
        const formattedDate = dueDate.toLocaleDateString('en-US', options);
        dateRender.textContent = formattedDate;
    } else {
        dateRender.textContent = ""; 
    }
    
    const categoryName = document.createElement('p');
    categoryName.classList.add('categoryNameRender');
    categoryName.textContent = task.categoryName;
    const priorityRender = document.createElement('p');
    priorityRender.classList.add('priorityRender');
    priorityRender.innerHTML = getPriorityStyle(task.priority);

    const editBtn = document.createElement('button');
    editBtn.classList.add('editBtn');
    editBtn.innerHTML = '<i class="fa fa-pencil" aria-hidden="true"></i>';
    const deleteTaskBtn = document.createElement('button');
    deleteTaskBtn.classList.add('deleteTaskBtn');
    deleteTaskBtn.innerHTML = '<i class="fa fa-trash-o" aria-hidden="true"></i>';
    const descriptionSpan = document.createElement('span');
    descriptionSpan.classList.add('descriptionSpan');
    descriptionSpan.textContent = task.description;

    taskListContainer.appendChild(newTaskDiv);
    newTaskDiv.appendChild(taskElements);
    taskElements.appendChild(doneCheckBox);
    taskElements.appendChild(taskNameRender);
    taskElements.appendChild(descriptionBtnRender);
    taskElements.appendChild(dateRender);
    taskElements.appendChild(categoryName);
    taskElements.appendChild(priorityRender);
    taskElements.appendChild(editBtn);
    taskElements.appendChild(deleteTaskBtn);
    newTaskDiv.appendChild(descriptionSpan);
    
    editBtn.addEventListener('click', () => {
        editTask(task);
    });            
}

function editTask(task){
    const taskListContainer = document.querySelector('#task-list');
    const content = document.querySelector('.content')
    const modal = document.createElement('div');
    modal.classList.add('modal');
    modal.innerHTML = 
            `<span><strong>Edit task</strong></span>
            <div class="edit-wrapper">
                <label for="taskName">Name:</label>
                <input type="text" name="taskName" id="taskEditName" autocomplete="off">
            </div>
            <div class="edit-wrapper">
                <label for="taskDescription">Description:</label>
                <input type="text" name="taskDescription" id="taskEditDescription" autocomplete="off">
            </div>
            <div class="edit-wrapper">
                <label for="dueDate">Due Date:</label>
                <input type="date" name="dueDateEdit" id="dueDateEdit">
            </div>
            <div class="radio">
                <label for="priority">Priority:</label>
                <input type="radio" name="priority" id="priorityLow" value="low">
                <input type="radio" name="priority" id="priorityMedium" value="medium">
                <input type="radio" name="priority" id="priorityHigh" value="high">
            </div>
            <div class="edit-wrapper">
                        <label for="selectCategory">Select category:</label>
                        <select name="selectCategory" id="selectCategory">
                            <option value="No category"> No category</option>
                        </select>
                    </div>
            <div class="edit-buttons-wrapper">
                <button type="button"id="editTaskBtn">Ok</button>
                <button type="button" id="editTaskCancelBtn">Cancel</button>
            </div>`;
        
    content.appendChild(modal);
    taskListContainer.style.filter = 'blur(2px)';
  

    modal.querySelector('#taskEditName').value = task.name;
    modal.querySelector('#taskEditDescription').value = task.description;
    modal.querySelector('#dueDateEdit').value = task.date;
    updateCategorySelectListA();

    const selectCategory = modal.querySelector('#selectCategory');
    selectCategory.value = task.categoryName;
    console.log("task.categoryName:", task.categoryName);
    console.log("selectCategory.value:", selectCategory.value);

    const priorityRadio = modal.querySelector(`input[value="${task.priority}"]`);
    if (priorityRadio) {
        priorityRadio.checked = true;
    } 

    const saveEditTaskBtn = modal.querySelector('#editTaskBtn');
    saveEditTaskBtn.addEventListener('click', () => {
    
        task.name = modal.querySelector('#taskEditName').value;
        task.description = modal.querySelector('#taskEditDescription').value;
        task.date = modal.querySelector('#dueDateEdit').value;
        task.priority = modal.querySelector('input[name="priority"]:checked').value;
        task.categoryName = modal.querySelector('#selectCategory').value;
        task.status = 'undone';

        const taskDiv = document.querySelector(`[data-task-id="${task.id}"]`);
        taskDiv.querySelector('.taskNameRender').textContent = task.name;
        taskDiv.querySelector('.descriptionSpan').textContent = task.description;
        taskDiv.querySelector('.dueDateRender').textContent = task.date;
        taskDiv.querySelector('.categoryNameRender').textContent = task.categoryName;
        taskDiv.querySelector('.priorityRender').innerHTML = getPriorityStyle(task.priority);

        content.removeChild(modal);
        taskListContainer.style.filter = 'none'; 

        const tasks = taskManager.getTasks();
        localStorage.setItem('tasks', JSON.stringify(tasks));   
    });
    

    const cancelButton = modal.querySelector('#editTaskCancelBtn');
    cancelButton.addEventListener('click', () => {
        content.removeChild(modal);
        taskListContainer.style.filter = 'none'; 
    });
}

export function tasksButtonsEventListener () {
    const addTaskBtn = document.querySelector('#add-task-btn');
    const taskListContainer = document.querySelector('#task-list');
    const contentHeader = document.querySelector('.content-header');
    const addTaskPopup = document.querySelector('#add-task-popup');
    const submitTaskBtn = document.querySelector('#submitTaskBtn');
    const cancelTaskBtn = document.querySelector('#cancelTaskBtn');

    addTaskBtn.addEventListener('click', () => {
        addTaskBtn.style.display = 'none';
        addTaskPopup.style.display = 'flex';
        taskListContainer.style.display = 'none'
    });


    submitTaskBtn.addEventListener('click', () => {
        const taskName = document.querySelector('#taskName').value.trim();
        const taskDescription = document.querySelector('#taskDescription').value.trim();
        const dueDate = document.querySelector('#dueDate').value;
        const selectedPriority = document.querySelector('input[name="priority"]:checked').value;
        const selectedCategory = document.querySelector('#selectCategory').value;

        const newTask = taskManager.createTask(taskName, taskDescription, dueDate, selectedPriority, selectedCategory,status);
        tasksRender(newTask);

        addTaskPopup.querySelector('#taskName').value = ""; 
        addTaskPopup.querySelector('#taskDescription').value = ""; 
        addTaskPopup.querySelector('#dueDate').value = ""; 
        const priorityRadio = addTaskPopup.querySelector('input[name="priority"]:checked');
        if (priorityRadio) {
            priorityRadio.checked = false; 
        }
        
        addTaskPopup.style.display = 'none';
        addTaskBtn.style.display = 'block';
        taskListContainer.style.display = 'flex';
    })
    cancelTaskBtn.addEventListener('click', () => {
        addTaskPopup.querySelector('#taskName').value = ""; 
        addTaskPopup.querySelector('#taskDescription').value = ""; 
        addTaskPopup.querySelector('#dueDate').value = ""; 
        const priorityRadio = document.querySelector('input[name="priority"]:checked');
        if (priorityRadio) {
            priorityRadio.checked = false; 
        }
        addTaskPopup.style.display = 'none';
        addTaskBtn.style.display = 'block';
        taskListContainer.style.display = 'flex';

    
    })

    taskListContainer.addEventListener('click', (e) => {
        if (e.target && e.target.classList.contains('deleteTaskBtn') || e.target.closest('.deleteTaskBtn')){
            const currentTask = e.target.closest('.task');
            
            if (currentTask){
                const taskIdtoDelete = currentTask.getAttribute('data-task-id');
                
                if (taskIdtoDelete){
                    const taskIndex = taskManager.getTasks().findIndex(task => task.id === taskIdtoDelete);
                  
                    if (taskIndex !== -1){
                        taskManager.getTasks().splice(taskIndex, 1);
                        localStorage.setItem('tasks', JSON.stringify(taskManager.getTasks()));
                        currentTask.remove();
                    }
                }
            }
        }
        else if (e.target && e.target.classList.contains('descriptionBtnRender')) {
            const descriptionBtn = e.target;
            const taskContainer = descriptionBtn.closest('.task');
            const descriptionSpan = taskContainer.querySelector('.descriptionSpan');
            
            if (descriptionSpan) {
                const computedStyle = window.getComputedStyle(descriptionSpan);
                const displayValue = computedStyle.getPropertyValue('display');
                
                if (displayValue === 'none') {
                    descriptionSpan.style.display = 'block';
                } else {
                    descriptionSpan.style.display = 'none';
                }
            }
        }
        });
    
    
}

function getPriorityStyle(priority) {
    let style = '';
    switch (priority) {
        case 'low':
            style = '<p style="background-color: #00CA4E; border-radius: 50px; width: 10px; height: 10px;"></p>';
            break;
        case 'medium':
            style = '<p style="background-color: #FFBD44; border-radius: 50px; width: 10px; height: 10px;"></p>';
            break;
        case 'high':
            style = '<p style="background-color: #FF605C; border-radius: 50px; width: 10px; height: 10px;"></p>';
            break;
    }
    return style;
}