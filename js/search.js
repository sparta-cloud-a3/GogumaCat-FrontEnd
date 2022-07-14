let domain = "http://localhost:8080"
let token = $.cookie("mytoken")
function search() {
      let query = $("#search-text").val();

      if (query == "") {
            alert("검색어를 입력하세요");
            return;
      }

      $.ajax({
            type: "GET",
            url: `${domain}/post/search?query=${query}`,
            data: {},
            dataType : "json",
            beforeSend: function(xhr) {
                  xhr.setRequestHeader("token", $.cookie("mytoken"));
            },
            success: function (response) {
                  console.log("success")
                  console.log(response)
            },
            error : function () {
                  alert("fail")
            }
      })
}