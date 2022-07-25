//도메인과 토큰
const domain = "https://www.hongseos.shop"
const token = $.cookie("mytoken")

    
    //포스팅하기
    function posting() {
        //토큰과 도메인
        //input값 가져오기
        let title = $('#posting-title').val()
        let date = $('#calendar').val()
        let price = $('#price').val()
        let content = $('#content').val()
        let address = $('#local_address').val()
        let file = $('#img')[0].files[0]
        //form 데이터 넣기
        let form_data = new FormData()
        form_data.append("title", title)
        form_data.append("file", file)
        form_data.append("date", date)
        form_data.append("price", price)
        form_data.append("content", content)
        form_data.append("address", address)
        //동작 조건 만들기
        if (title == "") {
            alert("제목,물품명을 입력해주세요")
            return;
        }  
        if (date == "") {
            alert("대여 기간을 입력해주세요")
            return;
        }  
        if (price == "") {
            alert("가격을 입력해주세요")
            return;
        }  
        if (file == undefined) {
            alert("제품 사진을 첨부해주세요")
            return;
        }  
        if (content == "") {
            alert("내용을 적어주세요")
            return;
        }  
        if (address == "") {
            alert("주소를 입력해주세요")
        } else {
            //포스팅 aJax 콜
            $.ajax({
                type: "POST",
                url: `${domain}/post/create`,
                data: form_data,
                cache: false,
                processData: false,
                contentType : false,
                enctype: "multipart/form-data",
                beforeSend: function(xhr) {
                xhr.setRequestHeader("token", token);
                },
                success: function (response) {
                    alert("등록되었습니다")
                    console.log(response)
                    window.location.href = '/list.html'
                },
                error: function (xhr, status, error){
                    alert("내용을 다시 확인해 주세요")
                }
            })
        }
    }
    function token_check() {
        if(!token) {
            alert('로그인이 필요합니다')
            window.history.back()
        }
    }

window.addEventListener('load' , ()=>{
    token_check()
})

