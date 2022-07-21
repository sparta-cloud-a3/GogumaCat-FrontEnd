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
            }
      })
}
initUserInfo()

function userPage() {
      window.location.href = `/user.html?userId=${userId}`
}