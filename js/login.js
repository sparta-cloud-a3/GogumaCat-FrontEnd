let domain = "http://localhost:8080"

function sign_in() {
    let username = $("#input-username").val()
    let password = $("#input-password").val()

    if (username == "") {
        $("#help-id-login").text("아이디를 입력해주세요.")
        $("#input-username").focus()
        return;
    } else {
        $("#help-id-login").text("")
    }

    if (password == "") {
        $("#help-password-login").text("비밀번호를 입력해주세요.")
        $("#input-password").focus()
        return;
    } else {
        $("#help-password-login").text("")
    }

    $.ajax({
        type: "POST",
        url: `${domain}/user/login1`,
        data: JSON.stringify ({
            'username': username,
            'password': password
        }),
        contentType: 'application/json',
        success: function (response) {
            $.cookie('mytoken', response, {path: '/'});
            window.location.replace("/")
        },
        error : function (response){
            alert("ID와 PW를 확인해 주세요.")
            $("#input-username").focus()
            $("#input-username").val("")
            $("#input-password").val("")
        }
    });
}

function kakao_login(){
    alert("원할한 진행을 위해 꼭 카카오 이메일도 동의 부탁드려요 ㅠㅠ")
    window.location.href='https://kauth.kakao.com/oauth/authorize?client_id=1cc8b1fcd1283d896e04d323749f5c38&redirect_uri=http://localhost:8080/user/kakao/callback&response_type=code'
}
