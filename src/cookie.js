/*
 ДЗ 7 - Создать редактор cookie с возможностью фильтрации

 7.1: На странице должна быть таблица со списком имеющихся cookie. Таблица должна иметь следующие столбцы:
   - имя
   - значение
   - удалить (при нажатии на кнопку, выбранная cookie удаляется из браузера и таблицы)

 7.2: На странице должна быть форма для добавления новой cookie. Форма должна содержать следующие поля:
   - имя
   - значение
   - добавить (при нажатии на кнопку, в браузер и таблицу добавляется новая cookie с указанным именем и значением)

 Если добавляется cookie с именем уже существующией cookie, то ее значение в браузере и таблице должно быть обновлено

 7.3: На странице должно быть текстовое поле для фильтрации cookie
 В таблице должны быть только те cookie, в имени или значении которых, хотя бы частично, есть введенное значение
 Если в поле фильтра пусто, то должны выводиться все доступные cookie
 Если дабавляемая cookie не соответсвуте фильтру, то она должна быть добавлена только в браузер, но не в таблицу
 Если добавляется cookie, с именем уже существующией cookie и ее новое значение не соответствует фильтру,
 то ее значение должно быть обновлено в браузере, а из таблицы cookie должна быть удалена

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
// текстовое поле для фильтрации cookie
const filterNameInput = homeworkContainer.querySelector('#filter-name-input');
// текстовое поле с именем cookie
const addNameInput = homeworkContainer.querySelector('#add-name-input');
// текстовое поле со значением cookie
const addValueInput = homeworkContainer.querySelector('#add-value-input');
// кнопка "добавить cookie"
const addButton = homeworkContainer.querySelector('#add-button');
// таблица со списком cookie
const listTable = homeworkContainer.querySelector('#list-table tbody');

listCookie();

filterNameInput.addEventListener('keyup', function() {
    listCookie();
});

function listCookie() {
    let cookie = getCookie();
    let chunk = filterNameInput.value;

    if (chunk) {
        listTable.innerHTML='';
        if (cookie) {
            Object.keys(cookie).forEach(item => {
                if (isMatching(cookie[item], chunk) || isMatching(item, chunk)) {
                    cookieRow(item, cookie[item]);
                }
            });   
        }
        
    }
    if (!chunk.length) {
        listTable.innerHTML='';
        if (cookie) {
            Object.keys(cookie).forEach(item => {
                cookieRow(item, cookie[item]);
            });   
        }
    }
}
function cookieRow(name, value) {
    let row = document.createElement('TR');

    row.className='row';
    row.innerHTML = `<td>${name}</td><td>${value}</td><td><button>Удалить</button></td>`;
    listTable.appendChild(row);
    row.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
            listTable.removeChild(row);
            delCook(name);
        }
    });
}

addButton.addEventListener('click', () => {
    // здесь можно обработать нажатие на кнопку "добавить cookie"
    let cookName = addNameInput.value,
        cookValue = addValueInput.value,
        cookie = getCookie();
    
    if (cookName && cookValue) {

        if (cookie[cookName]) { // 
            delCook(cookie[cookName]);
            delRow(cookie[cookName]);
        }
        document.cookie = `${cookName}=${cookValue}`;
    
        cookieRow(cookName, cookValue);
       
        addNameInput.value = '';
        addValueInput.value = '';
    }
});

function getCookie() {
    let cookie = document.cookie.split('; ').reduce((prev, current) => {
        const [name, value] = current.split('=');
      
        prev[name]=value;
      
        return prev;
    }, {});

    return cookie;
}

function delCook(cookName) {
    document.cookie = cookName += '=; expires=' + new Date(0);
}

function delRow(rowName) {
    for (let i = 0; i < listTable.rows.length; i++) {
        if (rowName === listTable.rows[i].cells[0].textContent) {
            listTable.rows[i].cells[2].children[0].click();
        }
    }
}
function isMatching(full, chunk) {
    return full.toLowerCase().indexOf(chunk.toLowerCase()) !== -1;
}