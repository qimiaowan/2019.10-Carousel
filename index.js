(function(){

  function carousel(elem,config) {

    //图片集合
    const configInfo = JSON.parse(JSON.stringify(config));

    const list = Array.from(configInfo.list),
          time = configInfo.timeOut,
          ition = configInfo.trans,
          el = $(elem);

    let num = 1,
        timer = null,
        offMove = true,
        previous = 0;

  // 初始化配置
    const ConfigMove = {
      num,
      timer,
      list,
      time,
      ition,
      offMove,
      previous
    };

    router(el,ConfigMove).then(function(){
      initMove(ConfigMove);
      addevent(ConfigMove);
    })
  }

  // 事件集
  function addevent(config) {
    const changeConfig = config;

    let $nav = changeConfig.nav,
      $wrap = $('#wrap');

    $wrap.addEventListener('mouseover', overFun.bind($wrap,changeConfig), false);
    $wrap.addEventListener('mouseout', outFun.bind($wrap, changeConfig), false);

    $wrap.addEventListener('mousedown', startFun.bind($wrap,changeConfig), false);
    $wrap.addEventListener('mousemove', moveFun.bind($wrap,changeConfig), false);
    $wrap.addEventListener('mouseup', endFun.bind($wrap,changeConfig), false);

    $nav.addEventListener('click', function (e) {
      let ev = e || window.event,
          tar = ev.target || ev.srcElement,
          oLi = tar.nodeName.toLowerCase();
      if (oLi !== 'li') {
        return;
      }
      navFun(changeConfig, tar);
    }, false);
  }

  function startFun(changeConfig, e) {
    let now = Date.now();
    e.preventDefault();
    const config = changeConfig,
          startPointX = e.clientX;

      if (now - config.previous > config.ition) {
        config.offMove = true;
        config.previous = now;
      }

    config.touch = [ startPointX ];
  }

  function moveFun(changeConfig, e) {
    const config = changeConfig,
          movePointX = e.clientX;

    config.touch && config.touch.push(movePointX);
  }

  function endFun(changeConfig) {

    const config = changeConfig,
      touch = config.touch,
      startX = touch[0],
      endX = touch[touch.length - 1];

      if(!config.offMove){return }
    if (touch.length < 2) {
      return;
    }

    if (Math.abs(endX - startX) > 30) {
      config.offMove = false;
      if (endX>startX) {
        // console.log("左边");
        config.num--;
        bannerAnimat(config)
      } else if (endX < startX) {
        // console.log("you",config.num)
        config.num++;
        bannerAnimat(config)
      }
    }

  }

  function overFun(config) {
    clearInterval(config.timer);
  }

  function outFun(config) {
    move(config);
  }

  function navFun(config,tar) {
    const oConfig = config,
      num = Number(tar.dataset.num);

    oConfig.offMove = false;
    oConfig.num = num;
    autoPlay(oConfig)
  }


  // 入口
  function initMove(ConfigMove){
    let images = $('#images'),
      nav = $("#nav"),
      imagesChild = images.children,
      navChild = nav.children,
      width = parseFloat(getComputedStyle(imagesChild[0], null)['width']);

    const nodeElemts = { images,nav,imagesChild,navChild,width },
          config = Object.assign(ConfigMove, nodeElemts);

    config.images.style.width = `${config.imagesChild.length * config.width}px` ;
    config.images.style.left = `-${config.width}px`;
    config.navChild[0].classList.add('active');

    move(config);
  }

  // 运动
  function move(config){
      let intervalTime = config.time;
      // 自动播放
      config.timer = setInterval(autoPlay.bind(null,config),intervalTime);
  }

  function autoPlay (config) {
    config.num++;
    bannerAnimat(config);
  }

  // 执行动画
  function bannerAnimat(config) {

    let image = config.images,
        imagesChild = config.imagesChild,
        len = imagesChild.length - 2,
        width = config.width,
        t = config.ition;

        image.style.left = (-1) * width * config.num + 'px';
      image.style.transition = 'left ' + t/1000 + 's';
      broadcastMeTool(config);

      setTimeout(() => {
        if (config.num > len) {
          backNext(config,1)
              // image.style.transitionProperty = 'none';
              // config.num = 1;
              // image.style.left = (-1) * width * config.num + 'px';
        } else if (config.num <= 0) {
          backNext(config,len)
              // image.style.transitionProperty = 'none';
              // config.num = len;
              // image.style.left = (-1) * width * config.num + 'px';
          }

      },t)

  }

  function backNext(config, num) {
    let image = config.images,
        width = config.width;

    image.style.transitionProperty = 'none';
    config.num = num;
    image.style.left = (-1) * width * config.num + 'px';
  }

  // 小黑点显示
  function broadcastMeTool(config) {
    let $navChild = config.navChild,
      len = config.imagesChild.length - 2,
      num = config.num - 1;

    if (num >= len) {
      num = 0;
    } else if (num <= -1) {
      num = len-1;
    }

    for (let i = 0; i < $navChild.length; i++){
      if ($navChild[i].classList.contains('active')) {
        $navChild[i].classList.remove('active')
      }
    }
    $navChild[num].classList.add('active');
  }




    // 所有节点渲染到主页面
    function router(el,ConfigMove) {


        return new Promise((resolve,reject)=>{

            const config = ConfigMove;
                  domElement = el,
                  listArr = cloneNode(config.list),
                  images = document.createElement("ul"),
                  nav = document.createElement("ol");

            images.id = "images";
            nav.id = "nav";

            images.appendChild(render(listArr,true));
            nav.appendChild(render(listArr));

            domElement.appendChild(images);
            domElement.appendChild(nav);

            resolve();
        })
    }

    // 子节点创建
    function render(list,imageMake){
        let elements = document.createDocumentFragment(),
            len = imageMake?list.length:list.length-2;
        for(let i = 0;i<len;i++){
            let li = document.createElement("li");
            if(imageMake){
                if(i==0){
                    li.setAttribute('data-num',len-3);
                }else if(i==len-1){
                    li.setAttribute('data-num',0);
                }else{
                li.setAttribute('data-num',i-1);
                }
                let img = document.createElement("img"),
                    print = list[i];
                img.src = print;
                li.appendChild(img);
            }else{
                li.setAttribute('data-num',i);
            }
            elements.appendChild(li);
        }
        return elements;
  }

  // 克隆第一，最后节点
  function cloneNode(list) {
    let oneImage = list[0];
    list.unshift(list[list.length-1]);
    list.push(oneImage);
    return list;
  }

    function $(dom){
        return document.querySelector(dom);
    }

    window.carousel = carousel;
})();