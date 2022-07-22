(() => {
    let yOffset = 0; //window.pageYOffset 변수
    let prevScrollHeight = 0; //현재 스크롤 보다 이전에 스크롤 섹션들의 높이 합
    let nowSection = 0; //현재 보고있는 섹션
    let lodingBox = 0; //로딩 박스 채우기
    let whiteMove = 0; //로딩 박스 움직이기
    let canvasMove = 0; //캔버스 애니메이션 
    let logoMove = 0; //로고 애니메이션
    let messageOpacity = 0; //메인메세지 오퍼서티
    let sectionOpacity = 0;//섹션 애니메이션의 오퍼서티값
    let sectionTransform = 30; //섹션 애니메이션의 트렌스폼 값

    const nav_info = [{
        type : 'nav',
        height : document.querySelector('.logo-nav').clientHeight,
        objs : {
            contain : document.querySelector('.logo-container'),
            logoImage : document.querySelector('#logo'),
            mainNav : document.querySelector('.main-nav-list'),
            searchBar : document.querySelector('.search-bar')
        }
    }
]

    const scene_info = [
        {
            //0
            type : 'sticky',
            //height : 4,
            scrollHeight : document.querySelector('#section-0').clientHeight,
            objs: {
                contain : document.querySelector('#section-0'),
                message : document.querySelector('.main-message'),
                messageB : document.querySelector('.main-message a'),
                messageA : document.querySelector('.main-message b'),
                canvas : document.querySelector('.main-canvas'),
                context : document.querySelector('.main-canvas').getContext('2d'),
                image_path : [
                    './image/logo-image.jpg'
                ],
                image : []
            } ,
            values : {
                rect1X : [0, 0 , {start : 0, end : 0}],
                rect2Y : [0, 0 , {start : 0, end : 0}],
                rect3X : [0, 0 , {start : 0, end : 0}],
                rect4Y : [0, 0 , {start : 0, end : 0}],                                
            }
        },{
            //1
            type : 'normal',
            scrollHeight : document.querySelector('#section-1').clientHeight,
            objs : {
                contain : document.querySelector('#section-1'),

                desc : document.querySelector('#section-2 .desc-0'), 
                descImg_0 : document.querySelector('#section-2 .desc-img'),
                descImg_1: document.querySelector('#section-2 .desc-img-2'),
                descA : document.querySelector('#section-2 .desc-0-a')
                
            }
        },{
            //2
            type : 'sticky',
            //height : 3,
            scrollHeight : document.querySelector('#section-2').clientHeight,
            objs : {
                contain : document.querySelector('#section-2'),
                desc : document.querySelector('#section-2 #section2-desc0'), 
                descImg_0 : document.querySelector('#section-2 #section2-desc1'),
                descImg_1: document.querySelector('#section-2 #section2-desc2'),
                descA : document.querySelector('#section-2 #section2-desc3')
            }
        },{
            //3
            type : 'sticky',
            //height : 3,
            scrollHeight : document.querySelector('#section-3').clientHeight,
            objs : {
                contain : document.querySelector('#section-3'),
                descA : document.querySelector('#section-3 #desc-1'), 
                descB : document.querySelector('#section-3 #desc-2'),
                descC : document.querySelector('#section-3 #desc-3'),
                descImg_0 : document.querySelector('#section-3 #desc-1-img'),
                descImg_1 : document.querySelector('#section-3 #desc-2-img'),
                descImg_2 : document.querySelector('#section-3 #desc-3-img')
            }
        },{
            //4
            type : 'normal',
            scrollHeight : document.querySelector('#section-4').clientHeight,
            objs : {
                contain : document.querySelector('#section-4')
            }
        }
    ];


    //canvas 실행이후 메뉴바가 아래로 내려오게 만듬
    function logoY() {
        let logoNav = nav_info[0].objs.contain
        let logoHeight = nav_info[0].height
        if(logoMove < logoHeight){
            logoNav.style.transform = `translateY(${-logoHeight+logoMove}px)`
            
            logoMove +=8;
            
            let logoAni = requestAnimationFrame(logoY)
            if(logoMove > logoHeight) {
                cancelAnimationFrame(logoAni)
                setTimeout(() => {
                    mainMessageOpacity()
                }, 400 )  
                
            }
        }
    }

    //메인 캔버스 그리기
    function canvas() {
        const objs = scene_info[0].objs;
        const values = scene_info[0].values;
        objs.canvas.width = window.innerWidth;
        objs.canvas.height = window.innerHeight + 50

        let imgElem = new Image();
        imgElem.src = objs.image_path[0]
        objs.image.push(imgElem)

        objs.context.fillStyle = 'white'

        //좌우 흰색박스
        const leftWhiteRect = objs.canvas.width * 0.5
        const rightWhiteRect = objs.canvas.width * 0.5
       
        values.rect1X[1] = values.rect1X[0] - leftWhiteRect;
        values.rect3X[0] = leftWhiteRect;
        values.rect3X[1] = objs.canvas.width

        //상하 흰색박스
        const topWhiteRect = objs.canvas.height * 0.5;
        const bottomWhiteRect = objs.canvas.height * 0.5;

        values.rect2Y[1] = values.rect2Y[0] - topWhiteRect;
        values.rect4Y[0] = topWhiteRect ;
        values.rect4Y[1] = objs.canvas.height
        
        //이미지 그리기
        objs.context.drawImage(objs.image[0], 0 , 0, objs.canvas.width,objs.canvas.height)            
            //좌우 흰색박스 그리기
            objs.context.fillRect(
            parseInt(values.rect1X[0]-canvasMove),
            0,
            parseInt(leftWhiteRect),
            objs.canvas.height
            );
        objs.context.fillRect(
            parseInt(values.rect3X[0]+canvasMove),
            0,
            parseInt(rightWhiteRect),
            objs.canvas.height
            );
            
            // 위아래 흰색박스 그리기
            
        objs.context.fillRect(
            0,
            parseInt(values.rect2Y[0]-canvasMove),
            objs.canvas.height,
            parseInt(topWhiteRect),                    
            )     
        objs.context.fillRect(
            0,
            parseInt(values.rect4Y[0]+canvasMove),
            objs.canvas.height,
            parseInt(bottomWhiteRect),                    
            )  
            canvasMove += 30

            let canvasAni = requestAnimationFrame(canvas)

            

            if ( canvasMove > (window.innerWidth+100)) {
                cancelAnimationFrame(canvasAni)    
                logoY()
                            
            }              
    }

    //메인 메세지 띄우기
    function mainMessageOpacity() {
        const mainMs = scene_info[0].objs.message
        if(messageOpacity <= 1) {
            mainMs.style.opacity = messageOpacity        
            messageOpacity += 0.1
            let messageAni = requestAnimationFrame(mainMessageOpacity)
        if(messageOpacity>1) {
            cancelAnimationFrame(messageAni)
            }
        }
    }
    
    
    //새로고침이나 처음 들어왔을 때 세팅되는 섹션 번호
    function setLayout() {
        yOffset = window.pageYOffset
        let totalScroll = 0;
        for( let i=0; i <scene_info.length; i++) {
            totalScroll += scene_info[i].scrollHeight
            if (totalScroll >= yOffset) {
                nowSection = i;
                break;
            }
        }
    }

    //현재 스크롤 하고 있는 위치와 섹션 구하는 함수
    function scroll() {
    yOffset = pageYOffset
    
    prevScrollHeight = 0;
    for (let i = 0; i < nowSection; i++) {
        prevScrollHeight += scene_info[i].scrollHeight
    }
    if ( yOffset > prevScrollHeight + scene_info[nowSection].scrollHeight) {       
        nowSection ++;
    } else if(yOffset < prevScrollHeight) {
        if(nowSection>0) { // 씬이 - 되는 것을 방지           
            nowSection --;
        }
    }
    sectionAni()
    
    }
    //스크롤 중 섹션 들어오면 애니메이션 실행
    function sectionAni() {
        const objs = scene_info[2].objs
        const objs2 = scene_info[3].objs
        let height = yOffset - prevScrollHeight
        let ratio = height / scene_info[nowSection].scrollHeight
        if(height >= scene_info[nowSection].scrollHeight) {
            height=0;
        }
        switch(nowSection) {
            case 1 :
                if(ratio<=1 && ratio>=0.9) {
                    if(objs.desc.classList.contains('play-none')) {
                        objs.desc.className = 'desc-0'
                        objs.descImg_0.className = 'desc-img'
                    }
                }
                break;
            case 2 :
                if(ratio>=0.1 && ratio<=0.5) {
                    if(objs.desc.classList.contains('play-none')) {
                        objs.desc.className = 'desc-0'
                        objs.descImg_0.className = 'desc-img'
                    }
                }
                if(ratio >= 0.45 && ratio <= 0.7) {
                    if(objs.descImg_1.classList.contains('play-none')) {
                        objs.descImg_1.className = 'desc-img-2'
                        objs.descA.className = 'desc-0-a'
                    }
                }
                if(ratio >= 0.9 && ratio <= 1) {
                    if(objs2.descA.classList.contains('play-none')) {
                        objs2.descA.className = 'desc-1'
                        objs2.descImg_0.className = 'desc-1-img'
                    }
                }
                break;
            case 3 :
                if(ratio >= 0.1 && ratio <= 0.7) {
                    if(objs2.descA.classList.contains('play-none')) {
                        objs2.descA.className = 'desc-1'
                        objs2.descImg_0.className = 'desc-1-img'
                    }
                }
                if(ratio >= 0.2 && ratio <=0.8) {
                    if(objs2.descB.classList.contains('play-none')){
                        objs2.descB.className = 'desc-2'
                        objs2.descImg_1.className = 'desc-2-img'
                    }
                }
                if(ratio >= 0.45 && ratio <=0.9) {
                    if(objs2.descC.classList.contains('play-none')){
                        objs2.descC.className = 'desc-3'
                        objs2.descImg_2.className = 'desc-3-img'
                    }
                }
                break;
        }
    }

    // 첫 GOGUMACAT 로딩 함수
    function loding() {
        const box = document.querySelector('#box')
        box.style.width = `${lodingBox}px`
        lodingBox+=28
        // boxWidth++
        let raf = requestAnimationFrame(loding)
        if(lodingBox>800){
            cancelAnimationFrame(raf);
            setTimeout(() => {
                lodingMove()
            }, 350 )           
        }
    }
    // 첫 로딩 함수 이후 하얗게 만드는 로딩
    function lodingMove() {
        const whiteBox = document.querySelector('#white-box')

        whiteBox.style.width = `${whiteMove}px`
        
        whiteMove +=35
        let whiteBoxMove = requestAnimationFrame(lodingMove)
        if(whiteMove > 1500) {
            cancelAnimationFrame(whiteBoxMove)
            document.querySelector('#loding').remove()
            canvas()
        }
    }
    

    
    
    window.addEventListener('load', () => {      
        loding()
        setLayout()
       // canvas() 
    })
    window.addEventListener('resize', () => {
        //nav_info[0].objs.contain.transform = translateY(-nav_info[0].height)
        canvas()
        setLayout()
    })
    window.addEventListener('scroll', () => {
        scroll()
    })
}) ();


//페이지 함수

const domain = "https://www.hongseos.shop"
const token = $.cookie("mytoken")


function listing() {
    $.ajax({
        type: "GET",
        url: `${domain}/post/top4`,
        data: {},
        dataType : "json",
        beforeSend: function(xhr) {
                xhr.setRequestHeader("token", token);
        },
        success: function (response) {
            $("#post-card-box").empty()
            let posts = response["data"]
            for (let i = 0; i<posts.length; i++) {
                makeCard(posts[i])
            }
        }
    })
}

function makeCard(post) {
    let tempHtml =  `<article class="card">
                        <a class="crad-link" href='javascript:void(0);' onclick="token_check(${post})">
                            <div class="card-img">
                                <img src="${post["postImgs"][0]["imgUrl"]}" alt="title">
                            </div>
                            <div class="card-desc">
                                <p class="card-title">${post["title"]}</p>
                                <p class="card-price">${post["price"]}</p>
                                <p class="card-address">${post["address"]}</p>
                                <p class="card-like">관심 ${post["likeCount"]}</p>
                            </div>
                        </a>
                    </article>`
    $("#post-card-box").append(tempHtml)
}
function token_check(data) {
    if(!token) {
        alert('로그인이 필요합니다')
        document.querySelector('#sec')
        window.location.href = '/login.html'
    } else {
        console.log(data)
        window.location.href = `/post.html?id=${data["postId"]}`
    }
}
window.addEventListener('load', listing)
