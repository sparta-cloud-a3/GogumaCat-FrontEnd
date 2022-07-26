const domain = "https://www.hongseos.shop"
const token = $.cookie("mytoken")
//파라미터 값 변수
const paramArray = [];
let profile_nickname ;
let id = 0;
let check_dup_result;

const elementInfo = [{
    type : 'button',
    objs : {
        profileUpdate : document.querySelector('.profile-container #profile-update'),
        deleteUser : document.querySelector('.profile-container #user-delete'),
        passwordUpdate : document.querySelector('.profile-container #update-password'),
        latestPost : document.querySelector('.list-container #latest-tag'),
        likePost : document.querySelector('.list-container #like-tag')
    }
},{
    //모달
    type : 'modal',
    objs : {
        updateModal : document.querySelector('#modal-profile'),
        updatePw : document.querySelector('#modal-profile .modal-password'),
        updateWindow : document.querySelector('#modal-profile .modal-window'),
        deleteModal : document.querySelector('#modal-delete'),
        deletePw : document.querySelector('#modal-delete .modal-password'),
        deleteWindow : document.querySelector('#modal-delete .modal-delete-check'),
        passwordModal : document.querySelector('#modal-updatePw'),
        passwordPw : document.querySelector('#modal-updatePw .modal-password'),
        passwordWindow : document.querySelector('#modal-updatePw .modal-window'),
        closeBtn : document.querySelector('.close-btn')
    }
},{//프로필
    type : 'text,image',
    objs : {
        nickname : document.querySelector('.profile-container #name'),
        introduce : document.querySelector('.profile-container #introduce'),
        profileImage : document.querySelector('.profile-container #profile-image')
    }
},{//프로필 업데이트(modal)
    type : 'input',
    objs : {
        nameUpdate : document.querySelector('.modal-window #input-nickname'),
        password : document.querySelector('.modal-window #input-password'),
        password2 : document.querySelector('.modal-window #input-password2'),
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
// 이미지 업로드 및 업로드한 이미지 미리보기
function img_up() {
    $('#img').on('change', function () {
        ext = $(this).val().split('.').pop().toLowerCase(); //확장자
        //배열에 추출한 확장자가 존재하는지 체크
        if ($.inArray(ext, ['png', 'jpg', 'jpeg']) == -1) {
            alert("jpg,jpeg,png 이미지만 사용 가능합니다.")
            const fileName = document.querySelector('#file-js-example .file-name');
            fileName.textContent = "";//스팬 값 초기화
            $(".modal-window #image_preview").css('display','none')
        } else {
            file = updateProfile.file.files[0]
            blobURL = window.URL.createObjectURL(file);
            $('#image_preview #img_pre').attr('src', blobURL);
            $('.modal-window #image_preview').slideDown(); //업로드한 이미지 미리보기
            $(this).slideUp(); //파일 양식 감춤
            $(".modal-window #image_preview").css('display','block')
        }
    });
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
    } else if (element.id === objs.passwordUpdate.id){
        modalInfo.passwordModal.style.display = 'flex'
    }
}
//modal 끄기(바깥쪽 클릭시)
function modal_off(element) {
    if(element.id === 'profile-off-0' || element.id === 'profile-off-1') {
        modalInfo.updateModal.style.display = 'none'
    } else if(element.id === 'del-off-0' || element.id === 'del-off-1') {
        modalInfo.deleteModal.style.display = 'none'
    } else if(element.id === 'updatePw-off-0' || element.id === 'updatePw-off-1'){
        modalInfo.passwordModal.style.display = 'none'
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
    if(modalInfo.passwordModal.style.display === 'flex' && e.key === 'Escape'){
        modalInfo.passwordModal.style.display ='none'
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
    profile.nickname.textContent = data['nickname']
    if(data['profileInfo'] === null) {
        profile.introduce.textContent = '아직 소개글이 없습니다.'
        profile.introduce.style.color = '#aaaaaa'
    } else{
        profile.introduce.textContent = data['profileInfo']
    }
    if(data['profilePic'] === null) {
        profile.profileImage.src = '/image/gogumacat-profile.png'
    } else {
        profile.profileImage.src = data['profilePic']
    }
}
//프로필 업데이트 modal에 데이터 넣기
function update_make(data) {
    updateProfile.nameUpdate.value = data['nickname']
    updateProfile.addressUpdate.value = data['address']
    updateProfile.introduce.value = data['profileInfo']
    if(data['profilePic'] != null){
    updateProfile.filePreview.src = data['profilePic']
    updateProfile.imgfileName.textContent = data['profilePic']
    } else {
        updateProfile.filePreview.src = '/image/gogumacat-profile.png'
        updateProfile.imgfileName.textContent = 'default'
    }
}

//카카오 초기 비밀번호 알려주기
function kakao_pw_check(){
    alert("카카오 로그인 시 초기 비밀번호는 카카오 이메일의 \"@\"앞 부분 입니다!\nEx) 이메일 : goguma@naver.com -> 비밀번호 : goguma")
}

//프로필 수정, 회원 탈퇴시 비밀번호 확인
function check_pw(value){
    let pw_input = value.childNodes[1].childNodes[1]
    let pw = pw_input.value
    let checkHelp = value.childNodes[3]
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
                if(result) {
                    if(pw_input.id === 'input-check-pw'){
                        modalInfo.updatePw.style.display = 'none'
                        modalInfo.updateWindow.style.display = 'block'
                    } else if(pw_input.id === 'delete-check-pw') {
                        modalInfo.deletePw.style.display = 'none'
                        modalInfo.deleteWindow.style.display = 'block'
                    } else if(pw_input.id === 'update-check-pw'){
                        modalInfo.passwordPw.style.display = 'none'
                        modalInfo.passwordWindow.style.display = 'block'
                    }
                } else {
                    updatePw = ""
                    checkHelp.textContent = '비밀번호가 틀렸습니다.'
                }
            }
        });
    }
}

//비밀번호 형식확인
function is_password(asValue) {
    var regExp = /^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z!@#$%^&*]{8,20}$/;
    return regExp.test(asValue);
}
//닉네임 중복 확인
function check_dup_nick() {
    
    let nickname = updateProfile.nameUpdate.value

    if (nickname == "") {
        updateProfile.nameUpdate.placeholder = '닉네임을 입력해주세요'
        updateProfile.nameUpdate.focus()
        return;
    }
    if (nickname.length > 5) {
        updateProfile.nameUpdate.value = ""
        updateProfile.nameUpdate.placeholder = '5글자 이하만 가능합니다'
        updateProfile.nameUpdate.focus()
        return;
    }
    $.ajax({
        type: "POST",
        url: `${domain}/user/sign_up/check_dup_nick`,
        data: JSON.stringify ({
            'nickname': nickname
        }),
        contentType: 'application/json',
        beforeSend: function(xhr) {
                xhr.setRequestHeader("token", token);
        },
        success: function (data) {
            if (data >= 1) {
                alert('이미 존재하는 닉네임입니다')
                check_dup_result = 0;
            } else {
                alert('사용할 수 있는 닉네임입니다')
                check_dup_result = 1;
            }
            return check_dup_result;
        }

    });
}
//주소 검색
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
//닉네임 변경될 시 검사
function nickname_reset() {
    check_dup_result = 0
}
// 프로필 정보 업데이트 전 체크사항
function update_check() {
    
    const old_nickname = profile.nickname.textContent
    const nickname = updateProfile.nameUpdate.value
    const address = updateProfile.addressUpdate.value
    const profilePic = updateProfile.file.files[0]
    const profileInfo = updateProfile.introduce.value

    if(nickname == "") {
        updateProfile.nameUpdate.placeholder = '닉네임을 입력해주세요'
        updateProfile.nameUpdate.focus()
        return;
    }  
    if(nickname != old_nickname) {
        if(check_dup_result == 0){
            alert('닉네임 중복확인이 필요합니다')
            return;
        }
    }
    if(address == "") {
        updateProfile.addressUpdate.placeholder = '주소를 입력해주세요'
        updateProfile.addressUpdate.focus()
        return;
    }
    if(profileInfo =="") {
        updateProfile.introduce.placeholder = '짧은 소개라도 입력해주세요'
        updateProfile.introduce.focus()
        return
    }
    console.log('실행중',check_dup_result)
    let form_data = new FormData()
    if (profilePic == undefined) {
        form_data.append("nickname", nickname)
        form_data.append("address", address)
        form_data.append("profileInfo", profileInfo)
    }
    else {
        form_data.append("nickname", nickname)
        form_data.append("address", address)
        form_data.append("profileInfo", profileInfo)
        form_data.append("profilePic", profilePic)
        }
        update(form_data)
    }

//비밀번호 수정 전 체크
function password_check() {
    const password = updateProfile.password.value
    const password2 = updateProfile.password2.value

    if(password == "") {
        updateProfile.password.placeholder = '비밀번호를 입력해주세요'
        updateProfile.password.focus()
        return;
    }
    if(!is_password(password)) {
        updateProfile.password.value = ""
        updateProfile.password.placeholder = '비밀번호의 형식을 확인해주세요'
        updateProfile.password.focus()
        return;
    } 
    if(password2 == "") {
        updateProfile.password2.placeholder = '비밀번호를 입력해주세요'
        updateProfile.password2.focus()
        return;
    }
    if(password2 != password) {
        updateProfile.password2.value = ""
        updateProfile.password2.placeholder = '비밀번호가 일치하지 않습니다'
        updateProfile.password2.focus()
        return;
    }
    let data = {
        'password' : password2
    }
    
    update_password(data)
}
//업데이트 하기
function update(form_data) {
    $.ajax({
        type: "PUT",
        url: `${domain}/update_profile/${id}`,
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
            alert('프로필 변경 완료되었습니다.')
            window.location.replace(`/user.html?userId=${id}`)
        }
    })
}
//비밀번호 업데이트 하기
function update_password(data){
    $.ajax({
        type: "PUT",
        url: `${domain}/update_pw/${id}`,
        data: JSON.stringify(data),
        contentType: 'application/json',
        beforeSend: function(xhr) {
            xhr.setRequestHeader("token", token);
        },
        success: function (response) {
            alert('비밀번호 변경이 완료되었습니다.')
            window.location.replace(`/user.html?userId=${id}`)
        }
    })
}
//회원 탈퇴
function userdelete() {
    $.ajax({
        type: "DELETE",
        url: `${domain}/delete/${id}`,
        data: {},
        beforeSend: function(xhr) {
            xhr.setRequestHeader("token", token);
        },
        success: function (response){
            alert("이용해 주셔서 감사합니다.")
            $.removeCookie('mytoken',{path:'/'})
            window.location.href = "/login.html"
        }
    })
}

//로그아웃
function sign_out() {
    alert('다음에 또 뵙겠습니다. ^^')
    $.removeCookie('mytoken',{path:'/'})
    window.location.href = "/index.html"
}

//로드시 시작 함수
window.addEventListener('load',() => {
    parameter()
    get_write_posts(id)
    user_profile()
    fileupload()
})