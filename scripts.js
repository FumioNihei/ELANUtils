

const text = `<?xml version="1.0" encoding="UTF-8"?>
<ANNOTATION_DOCUMENT AUTHOR="" DATE="2020-08-21T15:37:59+09:00" FORMAT="3.0" VERSION="3.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="http://www.mpi.nl/tools/elan/EAFv3.0.xsd">
    <HEADER MEDIA_FILE="" TIME_UNITS="milliseconds">
        <MEDIA_DESCRIPTOR MEDIA_URL="file:///C:/Users/Fumi/da/medias/export-audio/BP-S2/2-2-1.wav" MIME_TYPE="audio/x-wav"/>
        <PROPERTY NAME="URN">urn:nl-mpi-tools-elan-eaf:b9f83ed4-09e6-4f4a-9db1-e542c3ab941d</PROPERTY>
        <PROPERTY NAME="lastUsedAnnotationId">3</PROPERTY>
    </HEADER>
    <TIME_ORDER>
        <TIME_SLOT TIME_SLOT_ID="ts1" TIME_VALUE="2060"/>
        <TIME_SLOT TIME_SLOT_ID="ts2" TIME_VALUE="4230"/>
        <TIME_SLOT TIME_SLOT_ID="ts3" TIME_VALUE="4315"/>
        <TIME_SLOT TIME_SLOT_ID="ts4" TIME_VALUE="6445"/>
        <TIME_SLOT TIME_SLOT_ID="ts5" TIME_VALUE="6590"/>
        <TIME_SLOT TIME_SLOT_ID="ts6" TIME_VALUE="10270"/>
    </TIME_ORDER>
    <TIER LINGUISTIC_TYPE_REF="default-lt" TIER_ID="default">
        <ANNOTATION>
            <ALIGNABLE_ANNOTATION ANNOTATION_ID="a1" TIME_SLOT_REF1="ts1" TIME_SLOT_REF2="ts2">
                <ANNOTATION_VALUE>hello</ANNOTATION_VALUE>
            </ALIGNABLE_ANNOTATION>
        </ANNOTATION>
        <ANNOTATION>
            <ALIGNABLE_ANNOTATION ANNOTATION_ID="a2" TIME_SLOT_REF1="ts5" TIME_SLOT_REF2="ts6">
                <ANNOTATION_VALUE>this</ANNOTATION_VALUE>
            </ALIGNABLE_ANNOTATION>
        </ANNOTATION>
    </TIER>
    <TIER LINGUISTIC_TYPE_REF="default-lt" TIER_ID="testes">
        <ANNOTATION>
            <ALIGNABLE_ANNOTATION ANNOTATION_ID="a3" TIME_SLOT_REF1="ts3" TIME_SLOT_REF2="ts4">
                <ANNOTATION_VALUE>apple</ANNOTATION_VALUE>
            </ALIGNABLE_ANNOTATION>
        </ANNOTATION>
    </TIER>
    <LINGUISTIC_TYPE GRAPHIC_REFERENCES="false" LINGUISTIC_TYPE_ID="default-lt" TIME_ALIGNABLE="true"/>
    <CONSTRAINT DESCRIPTION="Time subdivision of parent annotation's time interval, no time gaps allowed within this interval" STEREOTYPE="Time_Subdivision"/>
    <CONSTRAINT DESCRIPTION="Symbolic subdivision of a parent annotation. Annotations refering to the same parent are ordered" STEREOTYPE="Symbolic_Subdivision"/>
    <CONSTRAINT DESCRIPTION="1-1 association with a parent annotation" STEREOTYPE="Symbolic_Association"/>
    <CONSTRAINT DESCRIPTION="Time alignable annotations within the parent annotation's time interval, gaps are allowed" STEREOTYPE="Included_In"/>
</ANNOTATION_DOCUMENT>
`;

function ToDictionary( array, func1, func2 ) {

    const retult = array.reduce( (map, element) => {
        map[ func1(element) ] = func2(element);
        return map;
    }, {} );

    return retult;
}


function Parse() {

    const parser = new DOMParser();

    const document = parser.parseFromString( text, "text/xml" );



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

            return [ID, timesAt[start], timesAt[end], content];
        } );

        return [ tierName, IDs ];
    } );
    
    const tierNames = tiers.map( tier => tier.getAttribute( "TIER_ID" ) );
    const annotationsAt = ToDictionary( annotations, (element) => element[0], (element) => element[1] );



    // console.log( timesAt );
    console.log( annotationsAt );
    console.log( tierNames );


}