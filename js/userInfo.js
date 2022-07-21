let userId;

function initUserInfo() {
      $.ajax({
            type: "GET",
            url: `${domain}/`,
            data: {},
            dataType: "json",
            beforeSend: function(xhr) {
                  xhr.setRequestHeader("token", token);
            },
            success: function (response) {
                  userId = response["id"]
                  $("#loginName").text(`${response["nickname"]}님 환영합니다.`)
                  if(response["orders"]){
                        console.log(response["orders"])
                        $("#alarm-box").append(`<i class="fa-solid fa-bell"></i>`)
                  }
            }
      })
}
initUserInfo()

function userPage() {
      window.location.href = `/user.html?userId=${userId}`
}