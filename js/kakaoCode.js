window.onload = function(){
    code();
};
function code(){
    let doamin = "https://www.hongseos.shop"
    let code = new URL(window.location.href).searchParams.get('code')
    console.log(code);

    $.ajax({
        type:"GET",
        url:`${doamin}/user/kakao/callback?code=${code}`,
        success: function (response) {
            $.cookie('mytoken', response, {path: '/'});
            window.location.replace("/")
        }
    })
}