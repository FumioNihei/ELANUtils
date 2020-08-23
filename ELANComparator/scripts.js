
const summary = document.getElementById( "summary" );
const detail = document.getElementById( "detail" );

function AddSummary( text ) {
    summary.value += `${text}\n`;
}

function AddDetail( text ) {
    detail.value += `${text}\n`;
}


let base = undefined;

window.onload = function () {

    function reqListener() {
        base = ParseEaf( this.responseText );
        console.log( base );
        console.log( base.TierNames );
    }

    var oReq = new XMLHttpRequest();
    oReq.addEventListener("load", reqListener);
    oReq.open("GET", "https://fumionihei.github.io/ELANUtils/ELANComparator/base.eaf");
    oReq.send();
};



function Upload() {
    console.log( "Upload" );

    var element = document.getElementById( "upload_file" );
    var file = element.files[0];
    console.log( file );


    var fileReader = new FileReader();

    fileReader.onload = function () {
        const txt = fileReader.result;

        const compare = ParseEaf( txt );
        console.log( compare );
        console.log( compare.TierNames );

        Compare( base, compare ); 
        
        // const json = JSON.parse( fileReader.result );
    }

    fileReader.readAsText( file );
    
}




function Compare( base, compare ) {

    const targetTiers = Intersect(base.TierNames, compare.TierNames);

    console.log(targetTiers);

    // const targetTier = targetTiers[0];

    let totalScore = 0;

    for (const targetTier of targetTiers) {

        AddSummary( `# 注釈層: ${targetTier}` );

        const annotations1 = base.AnnotationsAt[targetTier];
        const annotations2 = compare.AnnotationsAt[targetTier];

        
        AddSummary(`注釈数 (yours): ${annotations2.length}`);
        AddSummary(`注釈数 (ours): ${annotations1.length}`);
        

        const closestPairs = annotations1.map(annotation1 => {

            let closestAnnotation = annotations2[0];
            let closestDistance = Distance(annotation1, annotations2[0]);

            for (const annotation2 of annotations2) {

                const distance = Distance(annotation1, annotation2);

                closestAnnotation = closestDistance > distance ? annotation2 : closestAnnotation;
                closestDistance = Math.min(closestDistance, distance);
            }

            return [annotation1, closestAnnotation];
        });

        const totalDistance = closestPairs
            .map( (pair) => Distance(pair[0], pair[1]) )
            .reduce( (total, value) => total + value );

        const score = totalDistance / closestPairs.length;

        
        AddSummary( `スコア: ${score}` );
        totalScore += score;



        AddDetail( `# 注釈層: ${targetTier}` );

        for (const pair of closestPairs) {

            const target = pair[0];
            const closest = pair[1];
            const distance = Distance(target, closest);

            // console.log(`${target} - ${closest}: ${distance}`);
            AddDetail(`(${target}) - (${closest}), score: ${distance}`);

        }


    }


    AddSummary( `# 最終結果` );
    AddSummary( `最終スコア: ${totalScore}` );

}
