
const summary = document.getElementById( "src" );
const detail = document.getElementById( "dest" );

function AddSource( text ) {
    // summary.value += `${text}\n`;
    summary.innerText += `${text}\n`;

}

function AddDest( text ) {
    // detail.value += `${text}\n`;
    detail.innerText += `${text}\n`;
}



function Upload() {
    console.log( "Upload" );

    var element = document.getElementById( "upload_file" );
    var file = element.files[0];
    console.log( file );


    var fileReader = new FileReader();

    fileReader.onload = function () {
        const txt = fileReader.result;

        Convert( txt );
    }

    fileReader.readAsText( file );
    
}


function ToJson( parsed ) {

    const project = new ProjectFile();
    project.project = "test";
    project.date = NowAsStr();
    project.tiers = parsed.AnnotationsAt;

    const json = JSON.stringify( project, null, 2 );

    return json;

}


function ToText( parsed ) {

    const tiers = parsed.TierNames;
    const annotationsAt = parsed.AnnotationsAt;

    return tiers.map( (tier) => {
        console.log( annotationsAt[tier] );
        return annotationsAt[tier].map( (annotation) => `${tier}: ${annotation}\n` );
    } ).flat();

}

function Convert( eaf ) {

    const srcFormat = document.getElementById( "src-format" ).value;
    const destFormat = document.getElementById( "dest-format" ).value;

    console.log( srcFormat );
    console.log( destFormat );

    const parsed = ParseEaf( eaf );

    const result = ToJson( parsed );
    // const result = ToText( parsed );


    AddSource( eaf );
    AddDest( result );

    hljs.initHighlighting.called = false;
    hljs.initHighlighting();

}

function Save() {

    const text = detail.innerText;
    const filename = "result.json";

    SaveTextAsFile( filename, text );
}