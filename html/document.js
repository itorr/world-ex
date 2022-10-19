const htmlEl = document.documentElement;
const { body, head } = document;
const createElement = 名 => document.createElement(名);
const createImage = _=> new Image();
const addEvent = (元素,事件,cb) => 元素[`on${事件}`] = cb;// 元素.addEventListener(事件,cb);
const getRect = 元素 => 元素.getBoundingClientRect();
const setLevelTitleEl = 设置等级.children[0];

const closeAll = _=>{
    setLevelStyle.display = '';
};
const data = {};
const getLevelEls = _=>[...国家.children];
const getLevels = _=>getLevelEls().map(el=>+el.getAttribute('level')||0);
const localStorageLevelsKey = 'world-ex-levels';
const saveLevels = _=>{
    localStorage.setItem(localStorageLevelsKey,getLevels().join(''));
};
const gelLevelsAndSet = _=>{
    const levelsString = localStorage.getItem(localStorageLevelsKey);
    if(String(levelsString).length !== getLevelEls().length) return;
    const levels = levelsString.split('');
    getLevelEls().forEach((元素,i)=>{
        元素.setAttribute('level',levels[i])
    })
};
const svgEl = body.querySelector('svg');
const setLevelStyle = 设置等级.style;
const minMargin = 6;
addEvent(国家,'click', e=>{
    e.stopPropagation();

    const { target } = e;
    const targetRect = getRect(target);
    const { id } = target;
    data.target = target;
    data.id = id;

    setLevelTitleEl.innerHTML = id;
    setLevelStyle.display = 'block';
    const setLevelElRect = getRect(设置等级);
    const targetBBox = target.getBBox();
    const svgElBBox = svgEl.getBBox();
    const svgRect = getRect(svgEl);
    
    console.log(e)
    console.log(target)
    console.log(setLevelElRect)
    console.log(svgRect)

    let 左 = Math.round(body.scrollLeft + targetRect.left + targetRect.width/2 - setLevelElRect.width/2);
    // 左 = Math.min(
    //     左,
    //     body.offsetWidth + body.scrollWidth - setLevelElRect.width - minMargin
    // );
    // 左 = Math.max(
    //     左,
    //     minMargin
    // );

    let 上 = Math.round(body.scrollTop + targetRect.top + targetRect.height/2 - setLevelElRect.height/2);
    // 上 = Math.min(
    //     上,
    //     body.offsetHeight + body.scrollHeight - setLevelElRect.height - minMargin
    // );
    // 上 = Math.max(
    //     上,
    //     minMargin
    // );
    上 = body.scrollTop;

    const scalc = svgRect.width / 2050;

    // console.log(scalc)

    左 = targetBBox.x * scalc + svgElBBox.x;
    上 = targetBBox.y * scalc + svgElBBox.y;
    // console.log(svgEl,targetBBox,svgElBBox)

    左 = e.pageX + - setLevelElRect.width/2 + body.scrollLeft;
    上 = e.pageY + - setLevelElRect.height/2 + body.scrollTop + 4;
    

    setLevelStyle.left = 左 + 'px';
    setLevelStyle.top = 上 + 'px';
});
addEvent(document,'click',closeAll);
const 计分 = _=>{
    const 分 = getLevels().reduce((all, a) => {
        return +all + a;
      }, 0);
    分数.innerHTML = `分数: ${分}`;
}
addEvent(设置等级,'click',e=>{
    e.stopPropagation();
    const 等级 = e.target.getAttribute('data-level');
    if(!等级) return false;
    data.target.setAttribute('level',等级);
    计分();
    closeAll();
    saveLevels();
})

gelLevelsAndSet();
计分();

const readFileToURL = (blob,cb)=>{
    const reader = new FileReader();
    reader.onload = e => cb(e.target.result);
    reader.readAsDataURL(blob);
};
const 获取字体dataurl = (url,cb)=>{
    fetch(url).then(r => r.blob()).then(blob => readFileToURL(blob,cb));
};
const 获取字体样式 = (fontName,cb)=>{
    获取字体dataurl(`${fontName}.woff?v=a`,url => cb(`@font-face {
        font-family: ${fontName};
        src: url(${url});
    };`));
};
获取字体样式('slice',styleText=>{
    svgEl.querySelector('style').innerHTML = styleText;
    const 样式元素 = createElement('style');
    样式元素.innerHTML = styleText;
    head.appendChild(样式元素);
    setTimeout(_=>htmlEl.removeAttribute('data-loading'),2e3);
});

const width = 2050;
const height = 1220;
const zoom = 1;

const canvas = createElement('canvas');

canvas.width = width * zoom;
canvas.height = width * zoom;

const ctx = canvas.getContext('2d');

const fromXMLCreateImageSrc = document文本=>{
    const blob = new Blob([document文本], {type: 'image/svg+xml'});
    return URL.createObjectURL(blob);
};
const isSNS = /weibo|qq/i.test(navigator.userAgent);
// alert(navigator.userAgent)
const 下载文件 = (链接,文件名,元素 = createElement('a'))=>{
    if(!isSNS){
        元素.download = 文件名;
    }
    元素.href = 链接;
    元素.click();
};
const urlToImageEl = (url,cb)=>{
    const 图 = createImage();
    addEvent(图,'load',_=>setTimeout(_=>cb(图),500));
    图.src = url;
};
const 日志 = _=>(createImage()).src = `https://lab.magiconch.com/api/china-ex/log?levels=${getLevels().join('')}`;

const outputImageStyle = 输出图像.style;
const saveImage = _=>{
    htmlEl.setAttribute('data-running','true');

    const xmlText = `<?xml version="1.0" encoding="utf-8"?><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}px" height="${height}px">${svgEl.innerHTML}</svg>`;
    const dataURL = fromXMLCreateImageSrc(xmlText);
    urlToImageEl(dataURL,图=>{
        ctx.fillStyle = '#BAE4FF';
        ctx.fillRect(
            0,0,
            width * zoom,width * zoom
        );
        ctx.drawImage(
            图,
            0,0,
            width,height,
            0, (width - height) * zoom / 2,
            width * zoom, height * zoom
        );
        canvas.toBlob(blob=>{
            const url = URL.createObjectURL(blob);
            输出图像.querySelector('img').src = url;
            outputImageStyle.display = '';

            setTimeout(_=>{
                下载文件(url,`[神奇海螺][全球制霸]${+new Date()}.png`);
                htmlEl.removeAttribute('data-running');
            },50)
            

        },'image/png');
    });
    日志();
};

addEvent(保存,'click',saveImage);

addEvent(输出图像.querySelector('a'),'click',_=>{
    outputImageStyle.display = 'none'
});