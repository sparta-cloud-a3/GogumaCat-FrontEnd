const domain = "https://www.hongseos.shop"
const token = $.cookie("mytoken")
//파라미터 값 변수
const paramArray = [];
let profile_nickname ;
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
        updatePw : document.querySelector('#modal-profile .modal-password'),
        updateWindow : document.querySelector('#modal-profile .modal-window'),
        deleteModal : document.querySelector('#modal-delete'),
        deletePw : document.querySelector('#modal-delete .modal-password'),
        deleteWindow : document.querySelector('#modal-delete .modal-delete-check')
    }
},{//프로필
    type : 'text,image',
    objs : {
        nickmame : document.querySelector('.profile-container #name'),
        introduce : document.querySelector('.profile-container #introduce'),
        profileImage : document.querySelector('.profile-container #profile-image')
    }
},{//프로필 업데이트(modal)
    type : 'input',
    objs : {
        nameUpdate : document.querySelector('.modal-window #input-nickname'),
        addressUpdate : document.querySelector('.modal-window #input-address'),
        file : document.querySelector('#img-file-box #img'),
        imgfileName : document.querySelector('#img-file-box .file-name'),
        filePreview : document.querySelector('#image_preview #img_pre'),
        introduce : document.querySelector('.modal-window #profile-introduce')
    }
}]
const objs = elementInfo[0].objs
const modalInfo = elementInfo[1].objs
const profile = elementInfo[2].objs
const updateProfile = elementInfo[3].objs
//로그아웃
function sign_out() {
    alert('다음에 또 뵙겠습니다. ^^')
    $.removeCookie('mytoken',{path:'/'})
    window.location.href = "/"
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
//로드시 시작 함수(맨 마지막으로 옮길 예정)
window.addEventListener('load',() => {
    parameter()
    get_write_posts(id)
    user_profile()
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
modalInfo.updateModal.addEventListener('click', e => {
    const eTarget = e.target
    if(eTarget.classList.contains("modal-overlay-0")) {
        modalInfo.updateModal.style.display ='none'
    }
})
modalInfo.deleteModal.addEventListener('click' , e => {
    const eTarget = e.target
    if(eTarget.classList.contains("modal-overlay-1")){
        modalInfo.deleteModal.style.display = 'none'
    }
})
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

//프로필 데이터 가져오기
function user_profile() {
    $.ajax({
        type: "GET",
        url: `${domain}/profileinfo/${id}`,
        data: {},
        dataType: "json",
        beforeSend: function(xhr) {
              xhr.setRequestHeader("token", token);
        },
        success: function (response) {
            
            profile_make(response)
            update_make(response)
            profile_nickname = response['nickname']
        }
  })
}
//프로필데이터 넣기
function profile_make(data) {
    profile.nickmame.textContent = data['nickname']
    if(data['profileInfo'] === null) {
        profile.introduce.textContent = '아직 소개글이 없습니다.'
        profile.introduce.style.color = '#aaaaaa'
    } else{
        profile.introduce.textContent = data['profileInfo']
    }
    if(data['profilePic'] === null) {
        profile.profileImage.src = '/image/gogumaket.png'
    } else {
        profile.profileImage.src = data['profilePic']
    }
}
//프로필 업데이트 modal에 데이터 넣기
function update_make(data) {
    updateProfile.nameUpdate.value = data['nickname']
    updateProfile.addressUpdate.value = data['address']
    updateProfile.imgfileName.textContent = data['profilePic']
    updateProfile.introduce.value = data['profileInfo']
    if(data['profilePic'] != null){
    updateProfile.filePreview.src = data['profilePic']
    }
}
function check_pw(value){
    let pw_input = value.childNodes[3].childNodes[1]
    let pw = pw_input.value
    console.log(pw)
    let checkHelp = value.childNodes[5]
    if(pw == "") {
        checkHelp.textContent = '비밀번호를 입력해주세요.'
        pw_input.focus()
    } else{
        $.ajax({
            type: "POST",
            url: `${domain}/profileinfo/check`,
            data: JSON.stringify ({
                'password': pw,
                'nickname': `${profile_nickname}`
            }),
            contentType: 'application/json',
            beforeSend: function(xhr) {
                  xhr.setRequestHeader("token", token);
            },
            success: function (result) {
                console.log(result)
                if(result) {
                    if(pw_input.id === 'input-check-pw'){
                        modalInfo.updatePw.style.display = 'none'
                        modalInfo.updateWindow.style.display = 'block'
                    } else if(pw_input.id === 'delete-check-pw') {
                        modalInfo.deletePw.style.display = 'none'
                    modalInfo.deleteWindow.style.display = 'block'
                    }
                } else {
                    updatePw = ""
                    checkHelp.textContent = '비밀번호가 틀렸습니다.'
                }
            }
        });
    }
}

// function delete_pw() {
//     let deletePw = document.querySelector('#modal-delete #input-check-pw').value
//     let checkHelp = document.querySelector('#modal-delete #help-check-password')
//     if(deletePw == "") {
//         checkHelp.textContent = '비밀번호를 입력해주세요.'
//         document.querySelector('#modal-delete #input-check-pw').focus()
//     } else{
//         $.ajax({
//             type: "POST",
//             url: `${domain}/profileinfo/check`,
//             data: JSON.stringify ({
//                 'password': deletePw,
//                 'nickname': `${profile_nickname}`
//             }),
//             contentType: 'application/json',
//             beforeSend: function(xhr) {
//                   xhr.setRequestHeader("token", token);
//             },
//             success: function (result) {
//                 console.log(result)
//                 if(result) {
//                     modalInfo.deletePw.style.display = 'none'
//                     modalInfo.deleteWindow.style.display = 'block'
//                 } else {
//                     updatePw = ""
//                     checkHelp.textContent = '비밀번호가 틀렸습니다.'
//                 }
//             }
//         });
//     }
// }
