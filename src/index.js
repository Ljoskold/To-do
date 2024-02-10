import './styles.css';
import { categoryManager,categoryButtonsEventListener,renderCategories, updateCategorySelectList } from './categories';
import { taskManager,tasksButtonsEventListener, attachCategoryListEventListener, renderForToday, renderForWeek, renderAllTasks} from './tasks';

console.log(categoryManager.getCategories());
console.log(taskManager.getTasks());

function buttonsListener(){
    const todayBtn = document.querySelector('.todayBtn');
    const weekBtn = document.querySelector('.weekBtn');
    const allTasksBtn = document.querySelector('.alltasksBtn');
    const buttons = document.querySelectorAll('.nav-buttons');
    const categoryButtons = document.querySelectorAll('.category-main');

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            buttons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            categoryButtons.forEach(btn => btn.classList.remove('active'));
        });
    });

    todayBtn.addEventListener('click', () => {
        renderForToday();
    })
    weekBtn.addEventListener('click', () => {
        renderForWeek();
    })
    allTasksBtn.addEventListener('click', () => {
        renderAllTasks();
    })

    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active'); 
            buttons.forEach(btn => btn.classList.remove('active'));
        })
    })
};

// localStorage.clear();
categoryButtonsEventListener();
renderCategories();
attachCategoryListEventListener();
tasksButtonsEventListener();
buttonsListener();
updateCategorySelectList();

