let myMap, myPlacemark;

// Дождёмся загрузки API и готовности DOM.
ymaps.ready(init);

function init() {
    myMap = new ymaps.Map('map', {
        center: [55.76, 37.64],
        zoom: 10,
        controls: ['zoomControl', 'searchControl'],
    });

    // Слушаем клик на карте.
    myMap.events.add('click', e => {
        let coords = e.get('coords'),
            position = e.get('position');

        baseInformation(coords, position);
        clusterer.balloon.close();
    });

    let customItemContentLayout = ymaps.templateLayoutFactory.createClass(
        // Флаг "raw" означает, что данные вставляют "как есть" без экранирования html.
        '<h2 class=ballon__header>{{ properties.balloonContentHeader|raw }}</h2>' +
            '<div class=ballon__body>{{ properties.balloonContentBody|raw }}</div>' +
            '<div class=ballon__footer>{{ properties.balloonContentFooter|raw }}</div>'
    );

    clusterer = new ymaps.Clusterer({
        preset: 'islands#invertedVioletClusterIcons',
        clusterDisableClickZoom: true,
        openBalloonOnClick: true,
        clusterBalloonContentLayout: 'cluster#balloonCarousel',
        clusterBalloonItemContentLayout: customItemContentLayout,
    });
}

let information = {};

//наполнение массива информацией
function baseInformation(coords, position) {
    geocode(coords);
    information[`${coords[0]}-${coords[1]}`] = {};
    information[`${coords[0]}-${coords[1]}`].position = position;
}

//получение адреса
function geocode(coords) {
    ymaps.geocode(coords).then(res => {
        let firstGeoObject = res.geoObjects.get(0);
        information[`${coords[0]}-${coords[1]}`].address = firstGeoObject.getAddressLine();
        creatBallon(coords);
    });
}

//создание основного блока
function creatBallon(coords) {
    let wrapper = document.querySelector('.review-elem'),
        reviewBlockWidth = 320,
        reviewBlockHeigth = 539,
        item = information[`${coords[0]}-${coords[1]}`],
        windowHeight = window.innerHeight,
        windowWidth = window.innerWidth,
        positionTop =
            item.position[1] + reviewBlockHeigth > windowHeight ? windowHeight - reviewBlockHeigth : item.position[1],
        positionLeft =
            item.position[0] + reviewBlockWidth > windowWidth ? windowWidth - reviewBlockWidth : item.position[0];

    wrapper.style.top = positionTop + 'px';
    wrapper.style.left = positionLeft + 'px';
    wrapper.style.zIndex = '100';

    wrapper.innerHTML = `
    <div class="review">

        <div class="review-header">
            <div class="address">
                <p>${item.address}</p>
            </div>
            <button>x</button>
        </div>

        <div class="review-wrapper">

            <div class="review-body">
                <span>Отзывов пока нет</span>
            </div>
        
            <div class="review-review">
                <p>Ваш отзыв</p>
                <div class="review-form">
                    <input class="review__name" type="text" placeholder="Ваше имя">
                    <input class="review__place" type="text" placeholder="Укажите место">
                    <textarea class="review__comment" placeholder="Поделитесь впечатлением"></textarea>
                </div>
            </div>
        
            <div class="review-footer">
                <button>Добавить</button>
            </div>
            
        </div>   
        
    </div>`;

    onButtonChange(coords);
    updateReview(coords);
}

//обработка блока с отзывами
function updateReview(coords) {
    let reviewBodyElem = document.querySelector('.review-body'),
        item = information[`${coords[0]}-${coords[1]}`];

    if (item.reviews) {
        reviewBodyElem.innerHTML = '';

        for (let review of item.reviews) {
            let elem = document.createElement('div');
            elem.classList.add('.review-item');
            let item = `<p><span class="review-item__name"><b>${
                review.name
            }</b></span><span class="review-item__place">${review.place}</span><span class="review-item__date">${
                review.date
            }</span></p>
                        <p class="review-item__review">${review.comment}</p>
                    `;
            elem.innerHTML = item;
            reviewBodyElem.appendChild(elem);
        }
    }
}

//Обработка кнопки Добавить
function onButtonChange(coords) {
    let reviewElem = document.querySelector('.review-elem'),
        buttonAdd = document.querySelector('.review-footer button'),
        buttonClose = document.querySelector('.review-header button'),
        nameElem = document.querySelector('.review__name'),
        placeElem = document.querySelector('.review__place'),
        commentElem = document.querySelector('.review__comment'),
        item = information[`${coords[0]}-${coords[1]}`],
        arr = item.reviews || [];

    buttonAdd.addEventListener('click', () => {
        if (nameElem.value.length == 0 || placeElem.value.length == 0 || commentElem.value.length == 0) {
            return false;
        }

        let review = {};

        review.name = nameElem.value;
        review.place = placeElem.value;
        review.comment = commentElem.value;
        review.date = new Date().toLocaleString();
        arr.push(review);

        item.reviews = arr;

        updateReview(coords);
        createPlacemark(coords);

        nameElem.value = '';
        placeElem.value = '';
        commentElem.value = '';
    });

    buttonClose.addEventListener('click', () => {
        reviewElem.innerHTML = '';
    });
}

//Создание метки
function createPlacemark(coords) {
    let item = information[`${coords[0]}-${coords[1]}`],
        dataCoords = `${coords[0]}-${coords[1]}`,
        lastReview = item.reviews.length - 1,
        placeMarkData = {
            balloonContentHeader: `${item.reviews[lastReview].name}`,
            balloonContentBody: `<a href="#" class="clusters-link" data-coords="${dataCoords}">${item.address}</a>${
                item.reviews[lastReview].comment
            }`,
            balloonContentFooter: `${item.reviews[lastReview].date}`,
        },
        options = {
            openBalloonOnClick: false,
        },
        myPlacemark = new ymaps.Placemark(coords, placeMarkData, options);

    myMap.geoObjects.add(myPlacemark);

    myPlacemark.events.add('click', function() {
        creatBallon(coords);
    });

    createCluster(myPlacemark);
}

//Добавление метки в кластер
function createCluster(placemarks) {
    clusterer.add(placemarks);
    myMap.geoObjects.add(clusterer);
}

//Слушаем клик по адресу в карусели кластера
document.addEventListener('click', e => {
    e.preventDefault();

    if (e.target.className == 'clusters-link') {
        let coords = e.target.dataset.coords.split('-');

        clusterer.balloon.close();
        creatBallon(coords);
    }
});
