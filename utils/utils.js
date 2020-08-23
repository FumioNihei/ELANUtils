

function ToDictionary(array, func1, func2) {

    const retult = array.reduce((map, element) => {
        map[func1(element)] = func2(element);
        return map;
    }, {});

    return retult;
}

function Intersect(array1, array2) {
    return array1.filter(value => array2.includes(value));
}



