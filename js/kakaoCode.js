window.onload = function(){
    code();
};
function code(){
    let doamin = "http://www.hongseos.shop"
    let code = new URL(window.location.href).searchParams.get('code')

    $.ajax({
        type:"GET",
        url:`${doamin}/user/kakao/callback?code=${code}`,
        success: function (response) {
            $.cookie('mytoken', response, {path: '/'});
            window.location.replace("/list.html")
        }
    })
}