

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

    toString() {
        return `${this.ID}, ${this.Start}, ${this.End}, ${this.Contents}`;
    }

}


class ProjectFile {
    project = undefined;
    date = undefined;
    tiers = undefined;
}



function Distance(annotation1, annotation2) {

    // const d1 = Math.sqrt( Math.pow(annotation1.Start - annotation2.Start, 2) );
    // const d2 = Math.sqrt( Math.pow(annotation1.End - annotation2.End, 2) );

    const d1 = Math.abs( annotation1.Start - annotation2.Start );
    const d2 = Math.abs( annotation1.End - annotation2.End );

    return ( d1 + d2 ) / 2;
}




function ParseEaf( eaf ) {

    const parser = new DOMParser();

    const document = parser.parseFromString( eaf, "text/xml" );



    const timeSlots = Array.from( document.getElementsByTagName("TIME_SLOT") );
    const times = timeSlots.map( (element) => [ element.getAttribute("TIME_SLOT_ID"), element.getAttribute("TIME_VALUE") ]  );
    
    const timesAt = ToDictionary( times, (element) => element[0], (element) => parseInt(element[1]) );
    


    const tiers = Array.from( document.getElementsByTagName("TIER") );
    const annotations = tiers.map( tier => {

        const tierName = tier.getAttribute( "TIER_ID" );
        const annotations = Array.from( tier.getElementsByTagName( "ALIGNABLE_ANNOTATION" ) );

        const IDs = annotations.map( annotation => {

            const ID = annotation.getAttribute( "ANNOTATION_ID" );
            const start = annotation.getAttribute( "TIME_SLOT_REF1" );
            const end = annotation.getAttribute( "TIME_SLOT_REF2" );
            const content = annotation.getElementsByTagName( "ANNOTATION_VALUE" )[0].childNodes[0].nodeValue;

            return new Annotation( ID, timesAt[start], timesAt[end], content );
        } );

        return [ tierName, IDs ];
    } );
    
    const tierNames = tiers.map( tier => tier.getAttribute( "TIER_ID" ) );
    const annotationsAt = ToDictionary( annotations, (element) => element[0], (element) => element[1] );


    return new AnnotationContainer( tierNames, annotationsAt );
}

