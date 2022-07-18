//도메인과 토큰
// const domain = "http://hongseos.shop"
// const token = $.cookie("mytoken")

//파라미터 닮을 배열
const paramArray = [];

//각 input 값 변수 지정
const inputInfo = [{
    type : 'input',
    objs : {
        title : $('#posting-title').val(),
        date : $('#calendar').val(),
        price : $('#price').val(),
        content : $('#content').val(),
        address : $('#local_address').val(),
        file : $('#img')[0].files[0]
    }
}]

//파라미터 값 가져오기
function parameter(){
    const url = window.location.search;
    const urlParams = new URLSearchParams(url);
    for(param of urlParams){
        paramArray.push(param)
    }
}
//회원 글 채우기
function post() {
    $.ajax({
        type: "GET",
        url: `${domain}/post/${id}`,
        data: {},
        dataType : "json",
        beforeSend: function(xhr) {
                xhr.setRequestHeader("token", token);
        },
        success: function (response) {
            console.log(response)
        }
    });
}


//포스팅 업데이트
function posting_update() {
    const id = paramArray[0][1]
    const objs = inputInfo.objs
    //form 데이터 넣기
    let form_data = new FormData()
    form_data.append("title", objs.title)
    form_data.append("file", objs.file)
    form_data.append("date", objs.date)
    form_data.append("price", objs.price)
    form_data.append("content", objs.content)
    form_data.append("address", objs.address)
    //동작 조건 만들기
    if (title == "") {
        alert("제목,물품명을 입력해주세요")
        return;
    }  
    if (date == "") {
        alert("대여 기간을 입력해주세요")
        return;
    }  
    if (price == "") {
        alert("가격을 입력해주세요")
        return;
    }  
    if (file == undefined) {
        alert("제품 사진을 첨부해주세요")
        return;
    }  
    if (content == "") {
        alert("내용을 적어주세요")
        return;
    }  
    if (address == "") {
        alert("주소를 입력해주세요")
    } else {
    //포스팅 업데이트 aJax 콜
       $.ajax({
        type: "POST",
        url: `"${domain}/post/update/${id}"`,
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
            window.location.replace(`/post/id=${id}`)
        }
    })
}
}

window.addEventListener('load',() => {
    parameter()
    post()
})