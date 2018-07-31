/* ДЗ 2 - работа с массивами и объеектами */

/*
 Задание 1:

 Напишите аналог встроенного метода forEach для работы с массивами
 Посмотрите как работает forEach и повторите это поведение для массива, который будет передан в параметре array
 */
function forEach(array, fn) {
    for (let i = 0; i < array.length; i++) {
        fn(array[i], i, array);
    }
}

/*
 Задание 2:

 Напишите аналог встроенного метода map для работы с массивами
 Посмотрите как работает map и повторите это поведение для массива, который будет передан в параметре array
 */
function map(array, fn) {
    let newArr = [];

    for (let i = 0; i < array.length; i++) {
        newArr.push(fn(array[i], i, array));
    }
    
    return newArr;
}

/*
 Задание 3:

 Напишите аналог встроенного метода reduce для работы с массивами
 Посмотрите как работает reduce и повторите это поведение для массива, который будет передан в параметре array
 */
function reduce(array, fn, initial) {
    let i = (initial) ? 0 : 1;

    initial = (!initial) ? array[0] : initial;
    
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
    let arr = [];

    for (let i in obj) {
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
function slice(array, from = 0, to = array.length) {
    let newArr = [];
   
    to = (to < 0) ? array.length + to: to;
    from = (from < -array.length) ? 0: from;
    from = (from < 0) ? array.length + from: from;
    to = (to > array.length) ? array.length: to;
    
    for (let i = from; i < to; i++) {
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
    const handler = {
        set: function(target, propertyName, value) {
            target[propertyName] = Math.pow(value, 2);
            return true;
        }
    }
   
    return new Proxy(obj, handler);
}

export {
    forEach,
    map,
    reduce,
    upperProps,
    slice,
    createProxy
};
