
const summary = document.getElementById( "src" );
const detail = document.getElementById( "dest" );

function AddSource( text ) {
    summary.innerText += `${text}\n`;
}

function AddDest( text ) {
    detail.innerText += `${text}\n`;
}

function ClearTextArea() {
    summary.innerText = "";
    detail.innerText = "";
}

var annotationFiles = [];

function Upload() {
    const destFormat = document.getElementById( "dest-format" ).value;

    if( destFormat == "select output format..." ) {
        alert( "select output format!!!" );
        return;
    }

    console.log( "Upload" );
    ClearTextArea();
    annotationFiles = [];

    // const element = document.getElementById( "upload_file" );
    // const file = element.files[0];
    // const extension = file.name.split( '.' )[1];
    // console.log( file );


    // var fileReader = new FileReader();

    // fileReader.onload = function () {
    //     const txt = fileReader.result;

    //     Convert( txt, extension, destFormat );
    // }

    // fileReader.readAsText( file );



    const element = document.getElementById( "upload_file" );
    const files = element.files;
    // const file = element.files[0];
    // const extension = file.name.split( '.' )[1];

    var fileName = files[0].name.split( '.' )[0];
    var extension = files[0].name.split( '.' )[1];
    console.log( files[0] );


    var fileReader = new FileReader();

    fileReader.onload = function () {
        const txt = fileReader.result;

        const result = Convert( txt, extension, destFormat );

        // srcs.push( txt );
        // dests.push( result );

        annotationFiles.push( [ fileName, txt, result ] );
    }

    for (const file of files) {
        fileName = file.name.split( '.' )[0];
        extension = file.name.split( '.' )[1];
        fileReader.readAsText( file );
    }
    
    
}




function ConvertFromEaf( eaf, dest_format ) {

    const parsed = EafConverter.Parse( eaf );

    if( dest_format == "json" ) return EafConverter.ToJson( parsed );
    if( dest_format == "txt" ) return EafConverter.ToText( parsed );
    if( dest_format == "eaf" ) return eaf;

    return "Not Implemented...";
}

function Convert( input, src_format, dest_format ) {

    const result
        = src_format == "eaf" ? ConvertFromEaf( input, dest_format )
        : src_format == "txt" ? "Not Implemented..."
        : src_format == "json" ? "Not Implemented..."
        : "Not Implemented...";


    AddSource( input );
    AddDest( result );

    hljs.initHighlighting.called = false;
    // hljs.configure({
    //     languages: dest_format
    // });
    hljs.initHighlighting();

    return result;

}

function Save() {

    // const text = detail.innerText;
    // const filename = "result.json";

    // SaveTextAsFile( filename, text );

    const ext = document.getElementById( "dest-format" ).value;

    for (const file of annotationFiles) {

        const filename = `${file[0]}.${ext}`;
        const text = file[2];

        SaveTextAsFile( filename, text );
        
    }
}