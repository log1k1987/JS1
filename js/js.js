new Promise(resolve => {
    if (document.readyState == 'complete') {
        resolve();
    } else {
        window.onload = resolve;
    }
})
    .then(() => {
        return new Promise(resolve => {
            VK.init({
                // Инициализация приложения
                apiId: 6674558,
            });

            VK.Auth.getLoginStatus(response => {
                if (response.session) {
                    resolve(response.session.mid);
                } else {
                    VK.Auth.login(response => {
                        if (response.session) {
                            resolve(response.session.mid);
                        } else {
                            alert('Ошибка авторизации');
                        }
                    }, 2);
                }
            });
        });
    })
    .then(mid => {
        if (localStorage[mid]) {
            // Проверка localstor
            return JSON.parse(localStorage[mid]);
        } else {
            return new Promise((resolve, reject) => {
                VK.Api.call(
                    // получаем список друзей
                    'friends.get',
                    {
                        fields: 'photo_50',
                        version: 5.84,
                    },
                    response => {
                        if (response.response) {
                            resolve(response.response);
                        } else {
                            reject('Не удалось получить список друзей');
                        }
                    }
                );
            });
        }
    })
    .then(response => {
        let closeButton = document.querySelector('.fa-times'), // кнопка выхода
            searchInLeft = document.querySelector('#searchInLeft'), // левый инпут
            searchInRight = document.querySelector('#searchInRight'), // правый инпут
            saveButton = document.querySelector('#saveButton'), // Кнопка сохранить
            friendsPanel = document.querySelector('[data-content=friends-panel]'), // div с div'вами в которых списки :0
            source = document.querySelector('#friendsLi').innerHTML, // для Handlebars
            template = Handlebars.compile(source), // создание шаба Handlebars
            friendsList = [], // массив left
            friendsFiltered = [], // массив right
            targetElem,
            specterLi,
            specterLiX,
            specterLiY; // переменные dnd

        // @param list - массив друзей
        // @param side - left или right
        let showFriendsList = (list, side) => {
            let listOfFriends = document.createElement('ul'),
                container = document.querySelector(`[data-list=${side}]`),
                notFoundFriends = [{ no_match: 'Друзья не найдены!' }];
            if (!list.length) {
                list = notFoundFriends;
            }

            listOfFriends.innerHTML = template({ friend: list });
            container.appendChild(listOfFriends); // вывод списка
        };

        // @param side - left или right
        let removeFriendsList = side => {
            let container = document.querySelector(`[data-list=${side}]`),
                list = container.children[1];
            console.log(container.children[1]);
            list.remove();
        };

        // Поиск друзей
        let searchInList = e => {
            let search = e.target || e;
            console.log(search);
            // @param list - массив друзей
            // @param side - left или right
            let localSearch = (list, side) => {
                if (list.length) {
                    let searchString = search.value.toLowerCase();
                    let isIncluded = obj => {
                        return (
                            obj.first_name.toLowerCase().startsWith(searchString) ||
                            obj.last_name.toLowerCase().startsWith(searchString) ||
                            (obj.first_name + ' ' + obj.last_name).toLowerCase().startsWith(searchString)
                        );
                    };

                    removeFriendsList(side);
                    showFriendsList(list.filter(isIncluded), side);
                }
                return list;
            };
            //console.log(searchInLeft);
            //console.log(search);
            // где ищем
            if (search === searchInLeft) {
                friendsList = localSearch(friendsList, 'left');
            } else if (search === searchInRight) {
                friendsFiltered = localSearch(friendsFiltered, 'right');
            }
        };

        // переносим друзей
        let toggleFriend = e => {
            let elem = e.target || e.children[1].children[0],
                parentElem = elem.parentNode;

            // @param listMain массив в который добавим
            // @param listSecondary массив из которого удалим
            // @param sideM список в который добавим (left или right)
            // @param sideS список из которого удалим (left или right)
            let localToggle = (listMain, listSecondary, sideM, sideS) => {
                let li = parentElem.parentNode,
                    uid = parentElem.previousElementSibling.dataset.id;
                if (listMain.length) removeFriendsList(sideM);
                listMain.push(
                    listSecondary.splice(
                        listSecondary.findIndex(obj => {
                            if (obj.uid == uid) {
                                !obj.filtered ? (obj.filtered = true) : delete obj.filtered;
                                return true;
                            } else {
                                return false;
                            }
                        }),
                        1
                    )[0]
                );
                li.remove();
                showFriendsList(listMain, sideM);
                if (!listSecondary.length) removeFriendsList(sideS);
                return [listMain, listSecondary];
            };

            // определяем направление
            if (elem.classList.contains('fa-plus')) {
                [friendsFiltered, friendsList] = localToggle(friendsFiltered, friendsList, 'right', 'left');
                searchInList(searchInRight);
            } else if (elem.classList.contains('fa-times')) {
                [friendsList, friendsFiltered] = localToggle(friendsList, friendsFiltered, 'left', 'right');
                searchInList(searchInLeft);
            }
        };

        // делаем аватар
        let captureFriend = e => {
            if (e.button == 0) {
                if (specterLi) {
                    specterLi.remove();
                    specterLi = specterLiX = specterLiY = targetElem = null;
                    return false;
                }
                let elem = e.target.classList.contains('fa') ? null : e.target.closest('li');
                if (elem && elem.children[0].dataset.id) {
                    e.preventDefault();
                    targetElem = elem;
                    specterLi = document.createElement('div');

                    specterLi.innerHTML = elem.innerHTML;
                    specterLi.className = 'specter';
                    specterLi.style.left = e.pageX - e.offsetX + 'px';
                    specterLi.style.top = e.pageY - e.offsetY + 'px';
                    specterLi.style.width = window.getComputedStyle(elem).width;

                    specterLiX = e.offsetX;
                    specterLiY = e.offsetY;
                    document.body.appendChild(specterLi);
                }
            }
        };

        // при событии mousemove
        let moveFriend = e => {
            e.preventDefault();
            if (specterLi) {
                specterLi.style.left = e.pageX - specterLiX + 'px';
                specterLi.style.top = e.pageY - specterLiY + 'px';
            }
        };

        // переброс из одного списка в другой, mouseup
        let releaseFriend = e => {
            e.preventDefault();
            if (e.button == 0) {
                if (specterLi) {
                    specterLi.style.visibility = 'hidden';
                    let targetList = document.elementFromPoint(e.clientX, e.clientY).closest('.container'),
                        dataList = targetList ? targetList.dataset.list : null,
                        isElemLeft = targetElem.children[1].children[0].classList.contains('fa-plus');

                    if ((dataList == 'right' && isElemLeft) || (dataList == 'left' && !isElemLeft)) {
                        specterLi.style.visibility = 'visible';
                        toggleFriend(targetElem);
                    }

                    specterLi.remove();
                    specterLi = specterLiX = specterLiY = targetElem = null;
                }
            }
        };

        // сохраняем в локалстор
        let saveSession = () => {
            localStorage[VK.Auth.getSession().mid] = JSON.stringify({ friendsList, friendsFiltered });
            alert('Данные успешно сохранены!');
        };

        // Разрываем сессию
        let logout = () => {
            if (
                confirm(
                    'Все не сохраненные данные будут удалены. Вы действительно хотите закончить работу с приложением?'
                )
            ) {
                VK.Auth.logout(response => {
                    if (!response.session) {
                        alert('Сессия разорвана');
                    }
                });
            }
        };

        // Проверяем чего вернулось
        if (!response.length) {
            friendsList = response.friendsList;
            friendsFiltered = response.friendsFiltered;
        } else {
            friendsList = response;
        }

        //showFriendsList(friendsList, 'left');
        if (friendsList.length) {
            showFriendsList(friendsList, 'left');
        }
        if (friendsFiltered.length) {
            showFriendsList(friendsFiltered, 'right');
        }

        searchInLeft.addEventListener('input', searchInList);
        searchInRight.addEventListener('input', searchInList);
        friendsPanel.addEventListener('click', toggleFriend);
        saveButton.addEventListener('click', saveSession);

        document.body.addEventListener('mousedown', captureFriend);
        document.body.addEventListener('mousemove', moveFriend);
        document.body.addEventListener('mouseup', releaseFriend);
        closeButton.addEventListener('click', logout);
    })
    .catch(error => {
        alert(error);
    });
