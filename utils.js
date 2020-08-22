

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



class AnnotationContainer {

    constructor(tierNames, annotationsAt) {
        this.tierNames = tierNames;
        this.annotationsAt = annotationsAt;
    }

    get TierNames() {
        return this.tierNames;
    }

    get AnnotationsAt() {
        return this.annotationsAt;
    }
}

class Annotation {

    constructor(ID, start, end, contents) {
        this.id = ID;
        this.start = start;
        this.end = end;
        this.contents = contents;
    }

    get ID() {
        return this.id;
    }

    get Start() {
        return this.start;
    }

    get End() {
        return this.end;
    }

    get Contents() {
        return this.contents;
    }

}

function Distance(annotation1, annotation2) {

    const d1 = Math.pow(annotation1.Start - annotation2.Start, 2);
    const d2 = Math.pow(annotation1.End - annotation2.End, 2);

    return d1 + d2;
}