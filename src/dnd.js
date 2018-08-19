/* Задание со звездочкой */

/*
 Создайте страницу с кнопкой.
 При нажатии на кнопку должен создаваться div со случайными размерами, цветом и позицией на экране
 Необходимо предоставить возможность перетаскивать созданные div при помощи drag and drop
 Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер
 */

/*
 homeworkContainer - это контейнер для всех ваших домашних заданий
 Если вы создаете новые html-элементы и добавляете их на страницу, то дабавляйте их только в этот контейнер

 Пример:
   const newDiv = document.createElement('div');
   homeworkContainer.appendChild(newDiv);
 */
const homeworkContainer = document.querySelector('#homework-container');

/*
 Функция должна создавать и возвращать новый div с классом draggable-div и случайными размерами/цветом/позицией
 Функция должна только создавать элемент и задвать ему случайные размер/позицию/цвет
 Функция НЕ должна добавлять элемент на страницу. На страницу элемент добавляется отдельно

 Пример:
   const newDiv = createDiv();
   homeworkContainer.appendChild(newDiv);
 */
function createDiv() {
    function rnd(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    const div = document.createElement('div');

    div.classList.add('draggable-div');
    div.setAttribute('draggable', true)
    div.style.position = 'absolute';
    div.style.width = rnd(0, 300) + 'px';
    div.style.height = rnd(0, 300) + 'px';
    div.style.backgroundColor = 'rgb('+rnd(0, 255)+','+rnd(0, 255)+','+rnd(0, 255)+')';
    div.style.top = rnd(0, 300) + 'px';
    div.style.left = rnd(0, 300) + 'px';

    return div;
}

/*
 Функция должна добавлять обработчики событий для перетаскивания элемента при помощи drag and drop

 Пример:
   const newDiv = createDiv();
   homeworkContainer.appendChild(newDiv);
   addListeners(newDiv);
 */
function addListeners(target) {
    let startX,
        startY,
        dragStartX,
        dragStartY,
        currentElement;

    target.addEventListener('mousedown', function(e) {
        e.preventDefault();
        currentElement = e.target;
        currentElement.style.zIndex = '1000';
        startX = parseInt(currentElement.style.left);
        startY = parseInt(currentElement.style.top); 
        dragStartX = e.clientX; 
        dragStartY = e.clientY; 
    });

    document.addEventListener('mousemove', function(e) {
        e.preventDefault();
        currentElement.style.left = startX - (dragStartX - e.clientX) + 'px';
        currentElement.style.top = startY - (dragStartY - e.clientY) + 'px'; 
    });

    target.addEventListener('mouseup', function(e) {
        if (currentElement) {
            e.preventDefault();
            currentElement.style.zIndex = 'initial';
            currentElement = null;
        }
    });
}

/*
function addListeners(target) {
    let startX,
        startY,
        dragStartX,
        dragStartY,
        currentDrag;

    target.addEventListener('dragstart', (e) => {
        currentDrag = e.target;
        currentDrag.style.zIndex = '1000';
        startX = parseInt(currentDrag.style.left);
        startY = parseInt(currentDrag.style.top); 
        dragStartX = e.clientX; 
        dragStartY = e.clientY; 
    });

    target.addEventListener('dragover', (e) => {
        e.preventDefault();
        if (currentDrag) {
            currentDrag.style.left = startX - (dragStartX - e.clientX) + 'px';
            currentDrag.style.top = startY - (dragStartY - e.clientY) + 'px'; 
        }
    });

    target.addEventListener('drop', (e) => {
        if (currentDrag) {
            e.preventDefault();
            currentDrag.style.zIndex = 'initial';
            currentDrag = null;
        }
    });
                
}
*/
let addDivButton = homeworkContainer.querySelector('#addDiv');

addDivButton.addEventListener('click', function() {
    // создать новый div
    const div = createDiv();

    // добавить на страницу
    homeworkContainer.appendChild(div);
    // назначить обработчики событий мыши для реализации D&D
    addListeners(div);
    // можно не назначать обработчики событий каждому div в отдельности, а использовать делегирование
    // или использовать HTML5 D&D - https://www.html5rocks.com/ru/tutorials/dnd/basics/
});

export {
    createDiv
};
