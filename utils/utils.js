

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


NowAsStr = () => Date.now().toString();


function SaveTextAsFile( fileName, text ) {

    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob( [text], {type: 'text/plain'}) );
    a.download = fileName;

    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

}

function ZeroPadding( num, length ){
    return ( '0000000000' + num ).slice( -length );
}