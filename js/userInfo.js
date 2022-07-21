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
                        $("#alarm-box").append(`<i id="alarm-btn" onclick="openOrderModal()" class="fa-solid fa-bell"></i>`)
                  }
            }
      })
}
initUserInfo()

function userPage() {
      let name = $("#loginName").text()
      if (name == "게스트님 환영합니다") {
            alert("로그인이 필요한 서비스 입니다.")
            window.location.href ='/login.html'
      } else {
      window.location.href = `/user.html?userId=${userId}`
      }
}

function openOrderModal() {
      console.log("click")
      $(".modal").fadeIn()
}

function closeOrderModal() {
      $(".modal").fadeOut()
}