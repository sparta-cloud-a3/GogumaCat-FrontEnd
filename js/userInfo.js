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
                  $("#loginName").html(`<span id="loginName-0">${response["nickname"]}</span>님 환영합니다`)
                  if(response["orders"]){
                        makeOrderContent(response["orders"])
                  }
            },
            error:() => {
                  $('#loginName').text('로그인하기')
              }
      })
}


function userPage() {
      if (!token) {
            window.location.href ='/login.html'
      } else {
      window.location.href = `/user.html?userId=${userId}`
      }
}

function makeOrderContent(orders) {
      //알림을 볼 수 있는 버튼 생성
      console.log(orders)
      $("#alarm-box").append(`<i id="alarm-btn" class="fa-solid fa-bell" onclick="openModal()"></i>`)
      let tempHtml=""
      for(let i =0; i < orders.length; i++) {
            tempHtml += `<p style="margin: 20px;">
                              <text onclick="location.href='/post.html?id=${orders[i]["post"]["postId"]}'">${orders[i]["post"]["sellerNickname"]}님과 거래 약속이 잡혔습니다!</text>
                              <button onclick="checkOrder(${orders[i]["orderId"]})" style="float: right;">확인</button>
                        </p> 
                        <hr>`
      }
      $("#order-content").append(tempHtml)
}

function checkOrder(orderId) {
      let result = confirm("거래 알림을 확인하셨습니까?");
      if(result) {
            $.ajax({
                  type: "POST",
                  url: `${domain}/order/check/${orderId}`,
                  data: {},
                  beforeSend: function(xhr) {
                        xhr.setRequestHeader("token", token);
                  },
                  success: function (response) {
                        window.location.href = "/list.html"
                  }
            })
      }
}

function openModal() {
      document.getElementById("modal").style.display = "flex"
}

function closeModal() {
      document.getElementById("modal").style.display = "none"
}
window.addEventListener('load' , initUserInfo)