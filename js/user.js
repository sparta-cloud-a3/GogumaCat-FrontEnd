const domain = "https://www.hongseos.shop"
const token = $.cookie("mytoken")
//파라미터 값 변수
const paramArray = [];
let id = 0;

const elementInfo = [{
    type : 'button',
    objs : {
        profileUpdate : document.querySelector('.profile-container #profile-update'),
        deleteUser : document.querySelector('.profile-container #user-delete'),
        latestPost : document.querySelector('.list-container #latest-tag'),
        likePost : document.querySelector('.list-container #like-tag')
    }
},{
    type : 'modal',
    objs : {
        updateModal : document.querySelector('#modal-profile'),
        deleteModal : document.querySelector('#modal-delete')
    }
}]
const objs = elementInfo[0].objs
const modalInfo = elementInfo[1].objs
//로그아웃
function sign_out() {
    alert('다음에 또 뵙겠습니다. ^^')
    $.removeCookie('mytoken',{path:'/'})
    window.location.href = "/user/logout"
}

//파라미터 값 가져오기
function parameter(){
    const url = window.location.search;
    const urlParams = new URLSearchParams(url);
    for(param of urlParams){
        paramArray.push(param)
    }
    id = paramArray[0][1]
}

//파일 업로드시 제목 띄우기
function fileupload() {
    const fileInput = document.querySelector('#img-file-box input[type=file]');
    fileInput.onchange = () => {
        if (fileInput.files.length > 0) {
            const fileName = document.querySelector('#img-file-box .file-name');
            fileName.textContent = fileInput.files[0].name;
        }
    }
}
//내가 작성한 게시물 가져오기
function get_write_posts(user_id) {
    $.ajax({
        type: "GET",
        url: `${domain}/get_write_posts/${user_id}`,
        data: {},
        dataType : "json",
        beforeSend: function(xhr) {
                xhr.setRequestHeader("token", token);
        },
        success: function (response) {
            $("#post-card-box").empty();
            for (let i = 0; i < response.length; i++) {
                makePost(response[i]);
            }
        }
    });
}
//내가 좋아요한 게시물 가져오기
function get_like_posts(user_id) {
    $.ajax({
        type: "GET",
        url: `${domain}/get_like_posts/${user_id}`,
        data: {},
        dataType : "json",
        beforeSend: function(xhr) {
                xhr.setRequestHeader("token", token);
        },
        success: function (response) {
            $("#post-card-box").empty();
            for (let i = 0; i < response.length; i++) {
                makePost(response[i]);
            }
        }
    });
}
//포스트 생성 함수
function makePost(post) {
    let tempHtml =  `<article class="card">
                        <a href="/post.html?id=${post["postId"]}" class="crad-link">
                            <div class="card-img">
                                <img src='${post["postImgs"][0]["imgUrl"]}' alt="title">
                            </div>
                            <div class="card-desc">
                                <p class="card-title">${post["title"]}</p>
                                <p class="card-price">${post["price"]}원</p>
                                <p class="card-address">${post["address"]}</p>
                                <p class="card-like">관심 ${post["likeCount"]}</p>
                            </div>
                        </a>
                    </article>`
    $("#post-card-box").append(tempHtml)
}

function is_password(asValue) {
    var regExp = /^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z!@#$%^&*]{8,20}$/;
    return regExp.test(asValue);
}

function check_dup_nick() {
    let nickname = $("#input-nickname").val()

    if (nickname == "") {
        $("#help-nickname").text("닉네임을 입력해주세요.").removeClass("is-safe").addClass("is-danger")
        $("#input-nickname").focus()
        return;
    }
    $("#help-nickname").addClass("is-loading")
    $.ajax({
        type: "POST",
        url: "/user/sign_up/check_dup_nick",
        data: {
            'nickname': nickname
        },
        success: function (data) {
            if (data >= 1) {
                $("#help-nickname").text("이미 존재하는 닉네임입니다.").removeClass("is-safe").addClass("is-danger")
                $("#input-nickname").focus()
            } else {
                $("#help-nickname").text("사용할 수 있는 닉네임입니다.").removeClass("is-danger").addClass("is-success")
            }
            $("#help-nickname").removeClass("is-loading")
        }
    });
}
//최신순, 관심글 버튼 색상 변경
function click_sort_btn(order_type) {
    if (order_type == "latest") {
        objs.latestPost.classList.add("is-dark")
        objs.likePost.classList.remove("is-dark")
        // $('#address-tag').removeClass("is-dark")
    } else {
        objs.likePost.classList.add("is-dark")
        objs.latestPost.classList.remove("is-dark")
        // $('#address-tag').removeClass("is-dark")
    }
}


function juso() {
    new daum.Postcode({
        oncomplete: function (data) {
            var roadAddr = data.roadAddress; // 도로명 주소 변수
            var extraRoadAddr = ''; // 참고 항목 변수

            if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
                extraRoadAddr += data.bname;
            }
            if (data.buildingName !== '' && data.apartment === 'Y') {
                extraRoadAddr += (extraRoadAddr !== '' ? ', ' + data.buildingName : data.buildingName);
            }
            if (extraRoadAddr !== '') {
                extraRoadAddr = ' (' + extraRoadAddr + ')';
            }

            newjuso = data.jibunAddress.split(' ').slice(0, -1).join(' ')
            document.getElementById("input-address").value = newjuso // 지번주소
        }
    }).open();
}

//카카오 초기 비밀번호 알려주기
function kakao_pw_check(){
    alert("카카오 로그인 시 초기 비밀번호는 카카오 이메일의 \"@\"앞 부분 입니다!\nEx) 이메일 : goguma@naver.com -> 비밀번호 : goguma")
}

window.addEventListener('load',() => {
    parameter()
    get_write_posts(id)
})
//관심순, 최신순 클릭 반응
objs.likePost.addEventListener('click', ()=>{
    get_like_posts(id)
})
objs.latestPost.addEventListener('click',()=>{
    get_write_posts(id)
})
//modal 반응
//modal 켜기
function modal_on(element) {
    if(element.id === objs.profileUpdate.id) {
        modalInfo.updateModal.style.display = 'flex'
    } else if(element.id === objs.deleteUser.id) {
        modalInfo.deleteModal.style.display = 'flex'
    }
}
//modal 끄기(바깥쪽 클릭시)
function modal_off(element) {
    console.log(element)
    if(element.classList.contains('modal-overlay-0')) {
        modalInfo.updateModal.style.display = 'none'
    } else if(element.classList.contains('modal-overlay-1')){
        modalInfo.deleteModal.style.display = 'none'
    }
}
//modal 끄기(esc 누를시)
window.addEventListener("keyup", e => {
    if(modalInfo.updateModal.style.display === 'flex' && e.key === 'Escape') {
        modalInfo.updateModal.style.display = 'none'
        return;
    }
    if(modalInfo.deleteModal.style.display ==='flex' && e.key === 'Escape') {
        modalInfo.deleteModal.style.display = 'none'
        return;
    }
})