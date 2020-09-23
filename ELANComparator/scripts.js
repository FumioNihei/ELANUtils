
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
        base = EafConverter.Parse( this.responseText );
        console.log( base );
        console.log( base.TierNames );
    }

    var oReq = new XMLHttpRequest();
    oReq.addEventListener("load", reqListener);
    // oReq.open("GET", "https://fumionihei.github.io/ELANUtils/ELANComparator/base.eaf");
    // oReq.open("GET", "https://fumionihei.github.io/ELANUtils/ELANComparator/UtteranceSegmentation-training/A.eaf");
    oReq.open("GET", "https://fumionihei.github.io/ELANUtils/ELANComparator/UtteranceSegmentation-training/B.eaf");
    oReq.send();


    // oReq = new XMLHttpRequest();
    // oReq.addEventListener("load", reqListener);
    // oReq.open("GET", "https://fumionihei.github.io/ELANUtils/ELANComparator/base.eaf");
    // oReq.send();
};



function Upload() {
    console.log( "Upload" );

    var element = document.getElementById( "upload_file" );
    var file = element.files[0];
    console.log( file );
    console.log( file.name );


    var fileReader = new FileReader();

    fileReader.onload = function () {
        const txt = fileReader.result;

        const compare = EafConverter.Parse( txt );
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

        
        AddSummary(`注釈数 (あなたのデータ): ${annotations2.length}`);
        AddSummary(`注釈数 (正解): ${annotations1.length}`);
        

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

        
        AddSummary( `スコア: ${ score.toFixed(2) }` );
        totalScore += score;



        AddDetail( `# --- 注釈層: ${targetTier} ---------` );
        for (const pair of closestPairs) {

            const target = pair[0];
            const closest = pair[1];
            const distance = Distance(target, closest);

            // AddDetail(`score: ${ZeroPadding( distance.toFixed(1), 6 )}, (${target.ToFormatString()}) - (${closest.ToFormatString()})`);
            AddDetail(`distance: ${distance.toFixed(1)}, (${target.ToFormatString()}) - (${closest.ToFormatString()})`);

        }


    }


    AddSummary( `# 最終結果` );
    AddSummary( `最終スコア: ${totalScore.toFixed(2)}` );

}
