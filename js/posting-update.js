//도메인과 토큰
const domain = "https://www.hongseos.shop"
const token = $.cookie("mytoken")

//파라미터 닮을 배열
const paramArray = [];
let id = 0;
//비교할 유저 아이디
let connet_id;
let write_id;

//각 input 값 변수 지정
const inputInfo = [{
    type : 'input',
    objs : {
        title : document.querySelector('#posting-title'),
        date : document.querySelector('#calendar'),
        price : document.querySelector('#price'),
        content : document.querySelector('#content'),
        address :document.querySelector('#local_address'),
        file : document.querySelector('#img'),
        file_name : document.querySelector('#file-js-example .file-name'),
        file_preview : document.querySelector('#image_preview #img_pre')
    }
}]
const objs = inputInfo[0].objs

//파라미터 값 가져오기
function parameter(){
    const url = window.location.search;
    const urlParams = new URLSearchParams(url);
    for(param of urlParams){
        paramArray.push(param)
    }
    id = paramArray[0][1]
}
//회원 글 채우기
function post() {
    console.log(id)
    $.ajax({
        type: "GET",
        url: `${domain}/post/update/${id}`,
        data: {},
        dataType : "json",
        beforeSend: function(xhr) {
                xhr.setRequestHeader("token", token);
        },
        success: function (post) {
            objs.title.value = post['title']
            objs.date.value = post['date']
            objs.price.value = post['price']
            objs.address.value = post['address']
            objs.content.value = post['content']
            objs.file_name.textContent = post['postImgs'][0].imgUrl
            objs.file_preview.src = post['postImgs'][0].imgUrl

            write_id =  post['writerNickname']
            user_check()
        },
        error:() => {
            alert('잘못된 접근입니다.')
            window.history.back()
        }
    });
}


//포스팅 업데이트
function posting_update() {
    //form 데이터 넣기
    let form_data = new FormData()
    if (objs.file.files[0] == undefined) {
        form_data.append("title", objs.title.value)
        form_data.append("date", objs.date.value)
        form_data.append("price", objs.price.value)
        form_data.append("content", objs.content.value)
        form_data.append("address", objs.address.value)
    }
    else {
        form_data.append("title", objs.title.value)
        form_data.append("file", objs.file.files[0])
        form_data.append("date", objs.date.value)
        form_data.append("price", objs.price.value)
        form_data.append("content", objs.content.value)
        form_data.append("address", objs.address.value)
    }
    //동작 조건 만들기
    if (objs.title.value == "") {
        alert("제목,물품명을 입력해주세요")
        return;
    }  
    if (objs.date.value == "") {
        alert("대여 기간을 입력해주세요")
        return;
    }  
    if (objs.price.value == "") {
        alert("가격을 입력해주세요")
        return;
    }  
    if ( objs.file_name.textContent == "") {
        alert("제품 사진을 첨부해주세요")
        return;
    }  
    if (objs.content.value == "") {
        alert("내용을 적어주세요")
        return;
    }  
    if (objs.address.value == "") {
        alert("주소를 입력해주세요")
    } else {
    //포스팅 업데이트 aJax 콜
    $.ajax({
        type: "POST",
        url: `${domain}/post/update/${id}`,
        data: form_data,
        cache: false,
        contentType: false,
        processData: false,
        contentType : false,
        beforeSend: function(xhr) {
            xhr.setRequestHeader("token", token);
        },
        enctype: "multipart/form-data",
        success: function (response) {
            alert('변경 완료되었습니다.')
            window.location.replace(`/post.html?id=${id}`)
        }
    })
}
}
function token_check() {
    if(!token) {
        alert('로그인이 필요합니다')
        window.history.back()
    }
}

function user_check() {
    connet_id = document.querySelector('.logo-container #loginName-0').textContent
    console.log(connet_id,write_id)
    if(connet_id != write_id) {
        alert('올바르지 않은 접근입니다.')
        window.history.back()
    }
}

window.addEventListener('load',() => {
    token_check()
    parameter()
    post()
})
