

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
        // return `${this.ID}, ${this.Start}, ${this.End}, ${this.Contents}`;
        return `${this.ID},${this.Start},${this.End},${this.Contents}`;
    }



    #ZeroPadding( num, length ){
        return ( '0000000000' + num ).slice( -length );
    }

    #Format( time ) {
        const mil = time % 1000;
        const sec = parseInt(time / 1000) % 60;
        const min = parseInt(time / (1000*60)) % 60;
        return `${ this.#ZeroPadding(min, 2) }:${ this.#ZeroPadding(sec, 2) }.${ this.#ZeroPadding(mil, 3) }`;
    }

    ToFormatString() {
        const start = this.#Format( this.Start );
        const end = this.#Format( this.End );
        // return `${start},${end},${this.Contents}`;
        return `${start};${end};${this.Contents}`;
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






class EafConverter {
    static Parse( eaf ) {

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

                const annotationNode = annotation.getElementsByTagName( "ANNOTATION_VALUE" )[0].childNodes;
                const content = annotationNode.length > 0 ? annotationNode[0].nodeValue : "";
    
                return new Annotation( ID, timesAt[start], timesAt[end], content );
            } );
    
            return [ tierName, IDs ];
        } );
        
        const tierNames = tiers.map( tier => tier.getAttribute( "TIER_ID" ) );
        const annotationsAt = ToDictionary( annotations, (element) => element[0], (element) => element[1] );
    
    
        return new AnnotationContainer( tierNames, annotationsAt );
    }


    static ToJson( parsed ) {

        const project = new ProjectFile();
        project.project = "test";
        project.date = NowAsStr();
        project.tiers = parsed.AnnotationsAt;
    
        const json = JSON.stringify( project, null, 2 );
    
        return json;
    
    }
    
    
    static ToText( parsed ) {
    
        const tiers = parsed.TierNames;
        const annotationsAt = parsed.AnnotationsAt;
    
        const result = tiers.map( (tier) => {
            console.log( annotationsAt[tier] );
            return annotationsAt[tier].map( (annotation) => `${tier},${annotation}` );
        } ).flat();
    
        return result.join( "\n" );
    }

}
