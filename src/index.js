/* ДЗ 2 - работа с массивами и объеектами */

/*
 Задание 1:

 Напишите аналог встроенного метода forEach для работы с массивами
 Посмотрите как работает forEach и повторите это поведение для массива, который будет передан в параметре array
 */
function forEach(array, fn) {
    for (var i = 0; i < array.length; i++) {
        fn(array[i], i, array);
    }
}

/*
 Задание 2:

 Напишите аналог встроенного метода map для работы с массивами
 Посмотрите как работает map и повторите это поведение для массива, который будет передан в параметре array
 */
function map(array, fn) {
    var newArr = [];

    for (var i = 0; i < array.length; i++) {
        newArr[i] = fn(array[i], i, array);
    }
    
    return newArr;
}

/*
 Задание 3:

 Напишите аналог встроенного метода reduce для работы с массивами
 Посмотрите как работает reduce и повторите это поведение для массива, который будет передан в параметре array
 */
function reduce(array, fn, initial) {
    var i;

    if (!initial) {
        i = 1;

        initial=array[0];
    } else {
        i = 0;
    }
    
    for (; i < array.length; i++) {
        initial = fn(initial, array[i], i, array);
    }
    
    return initial;
}

/*
 Задание 4:

 Функция должна перебрать все свойства объекта, преобразовать их имена в верхний регистр и вернуть в виде массива

 Пример:
   upperProps({ name: 'Сергей', lastName: 'Петров' }) вернет ['NAME', 'LASTNAME']
 */
function upperProps(obj) {
    var arr = [];

    for (var i in obj) {
        if (!obj.hasOwnProperty(i)) {
            continue;
        }
        arr.push(i.toUpperCase());
    }

    return arr;
}

/*
 Задание 5 *:

 Напишите аналог встроенного метода slice для работы с массивами
 Посмотрите как работает slice и повторите это поведение для массива, который будет передан в параметре array
 */
function slice(array, from, to) {
    var newArr = [],
        end,
        i;

    if (!to) {
        i = from,
        end = array.length;
    } else if (!to && !from) {
        i = 0,
        end = array.length;
    } else {
        i = from,
        end = to;
    }

    for (; i < end; i++) {
        newArr.push(array[i]);
    }

    return newArr;
}

/*
 Задание 6 *:

 Функция принимает объект и должна вернуть Proxy для этого объекта
 Proxy должен перехватывать все попытки записи значений свойств и возводить это значение в квадрат
 */
function createProxy(obj) {
}

export {
    forEach,
    map,
    reduce,
    upperProps,
    slice,
    createProxy
};
