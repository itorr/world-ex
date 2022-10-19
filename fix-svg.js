const levelsStyleText = `
#国家>*[level="5"]{fill:#FF7E7E;}
#国家>*[level="4"]{fill:#FFB57E;}
#国家>*[level="3"]{fill:#FFE57E;}
#国家>*[level="2"]{fill:#A8FFBE;}
#国家>*[level="1"]{fill:#88AEFF;}
`;

const replaceSVG = text=>{
    text = text.replace(/ transform="matrix\(1 0 0 1 (\d+)(?:\.\d+)? (\d+)(?:\.\d+)?\)" class="(.+)"/g,' x="$1" y="$2" class="$3"')
    text = text.replace(/<!--.+?-->/g,'')
    text = text.replace(/\n+/g,'\n')
    text = text.replace(/ xml:space="preserve"/g,'')
    text = text.replace(/ style="enable-background:new 0 0 \d+ \d+;?"/g,'')
    text = text.replace(/width="\d+px" height="\d+px"/g,'')
    text = text.replace(/ x="0px" y="0px"/g,'')
    text = text.replace(/ id="图层_1"/g,'')
    text = text.replace(/ version="1.1"/g,'')
    text = text.replace(/ xmlns:xlink="http:\/\/www\.w3\.org\/1999\/xlink"/g,'')
    text = text.replace(/<rect y="0" class=".+?" width="2050" height="1220"\/?>/g,'')
    text = text.replace(/'Tensentype-JiaLiDaYuanJF'/g,'slice')
    
    text = text.replace(/<style type="text\/css">/,'<style></style><style>'+levelsStyleText)
    return text;
};


const { readFileSync, writeFileSync } = require('fs');



let xml = readFileSync('world.svg','utf8');

xml = replaceSVG(xml);
writeFileSync('world-fixed.svg',xml);




let html = readFileSync('home.html','utf8');


html = html.replace(/<!--svg-->/,xml);


writeFileSync('html/index.html',html,'utf8');