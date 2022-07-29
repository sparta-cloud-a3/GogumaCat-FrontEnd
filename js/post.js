const domain = "http://www.hongseos.shop"
// let domain = "http://localhost:8080"

const token = $.cookie("mytoken")
let write_user;

$(document).ready(function () {
    let splitLink = document.location.href.split("?")
    let idLink = splitLink[1].split("=")
    let postId =idLink[1]
    getDetail(postId)
})

function getDetail(postId) { 
    $.ajax({
        type: "GET",
        url: `${domain}/post/detail/${postId}`,
        data: {},
        dataType : "json",
        beforeSend: function(xhr) {
            xhr.setRequestHeader("token", token);
        },
        success: function (response) {
            write_user = response['post']['writeUserId']
            makeDetail(response)
        },
        error:() => {
            alert('잘못된 접근입니다.')
            window.history.back()
        }
    });
}

function makeDetail(response) {
    let post = response["post"]
    let userNickname
    if(token){
        userNickname = document.querySelector('#loginName #loginName-0').textContent
    }
    //사진
    $("#post-img-box").empty()
    for(var i=0; i<post["postImgs"].length; i++) {
        $("#post-img-box").append(
            `<img id="postImage-${i}" src="${post["postImgs"][i]["imgUrl"]}">`
        )
    }
    //제목
    $("#postTitle").text(post["title"])
    //주소
    $("#postAddress").text(post["address"])
    //가격
    $("#postPrice").text(post["price"]+"원")
    //판매완료
    let sold = post["sold"]
    if(sold == true) {
        $("#postSold").text("대여완료")
        $("#postPrice").empty()
    }
    //수정, 삭제 메뉴
    $("#fix-box").empty()
    $("#chat-box").empty()
    if(token) {
        if(userNickname === post["writerNickname"]) {
            $("#fix-box").append(
                `<ul class="dropdown">
                    <i class="fa-solid fa-ellipsis-vertical fa-2x dropbtn"></i>
                    <li class="post-fix"><a href="/posting-update.html?id=${post["postId"]}">수정하기</a></li>
                    <li class="post-delete" onclick="deletePost(${post["postId"]})">삭제하기</li>
                </ul>`
            )  
            $("#chat-box").append(
                `<button class="chat-btn" onclick="window.location.href ='/room.html?id=${post["postId"]}'">
                    <span class="icon">
                        <i class="fa-solid fa-message-dots"></i>
                    </span>
                    <span>채팅방</span>
                </button>`
            )
        } else {
            $("#chat-box").append(
                `<button class="chat-btn" onclick="window.location.href ='/roomdetail.html?id=${post["postId"]}'">
                    <span class="icon">
                        <i class="fa-solid fa-message-dots"></i>
                    </span>
                    <span>채팅보내기</span>
                </button>`
            )
        }
    }
 
    //작성자 프로필 사진
    if(post["writerProfile"] == undefined) {
        $("#profileImage").attr("src", "/image/profile_image.png")
    } else {
        $("#profileImage").attr("src", post["writerProfile"])
    }
    //작성자 닉네임
    $("#profileName").text(post["writerNickname"])
    //빌려주는 날짜
    $("#postDate").text(post["date"])
    //좋아요
    $("#post-like-box").empty()
    if(response["likeByMe"]) {
        $("#post-like-box").append(
            `<a class="heart-icon" id="heart_a" aria-label="like" onclick="toggle_like('${post["postId"]}')">
            <span class="icon is-small">
                <i id="heart" class="fa-solid fa-heart fa-3x" aria-hidden="true"></i>
            </span>
            </a>`
        )
    } else {
        $("#post-like-box").append(
            `<a class="heart-icon" id="heart_a" aria-label="like" onclick="toggle_like('${post["postId"]}')">
            <span class="icon is-small">
                <i id="heart" class="fa-regular fa-heart fa-3x" aria-hidden="true"></i>
            </span>
            </a>`
        )
    }
    $("#postContent").text(post["content"])
    map(post["address"])
}

//글 작성자 프로필 들어가기
function wirte_profile() {
    if(!token) {
        alert('로그인이 필요한 서비스입니다')
    } else {
        window.location.href = `/user.html?id=${write_user}`
    }
}

//맵 생성하기
function map(address) {
    var local = `${address}`
    var mapContainer = document.getElementById('map'), // 지도를 표시할 div
        mapCenter = new kakao.maps.LatLng(33.5563, 126.7958), // 지도의 중심좌표
        mapOption = {
            center: mapCenter, // 지도의 중심좌표
            level: 3 // 지도의 확대 레벨
        };

    var map = new kakao.maps.Map(mapContainer, mapOption);

    var geocoder = new kakao.maps.services.Geocoder();

    // 커스텀 오버레이에 표시할 내용입니다
    // HTML 문자열 또는 Dom Element 입니다
    var content = '<div class="overlay_info">';
    content += '    <a><strong>여기서 만나요!</strong></a>';
    content += '    <div class="desc">';
    content += '        <img src="/image/info_image.png" style="object-fit: fill" >';
    content += `        <span class="address">${address}</span>`;
    content += '    </div>';
    content += '</div>';

    geocoder.addressSearch(local, function (result, status) {
            if (status === kakao.maps.services.Status.OK) {
                // 커스텀 오버레이가 표시될 위치입니다
                var position = new kakao.maps.LatLng(result[0].y, result[0].x);

                // 커스텀 오버레이를 생성합니다
                var mapCustomOverlay = new kakao.maps.CustomOverlay({
                    position: position,
                    content: content,
                    xAnchor: 0.5, // 커스텀 오버레이의 x축 위치입니다. 1에 가까울수록 왼쪽에 위치합니다. 기본값은 0.5 입니다
                    yAnchor: 1.1 // 커스텀 오버레이의 y축 위치입니다. 1에 가까울수록 위쪽에 위치합니다. 기본값은 0.5 입니다
                });

                // 커스텀 오버레이를 지도에 표시합니다
                mapCustomOverlay.setMap(map);

                map.setCenter(position);

                var rvContainer = document.getElementById('roadview'); //로드뷰를 표시할 div
                var rv = new kakao.maps.Roadview(rvContainer); //로드뷰 객체
                var rvClient = new kakao.maps.RoadviewClient(); //좌표로부터 로드뷰 파노ID를 가져올 로드뷰 helper객체

                //지도의 오버레이좌표와 가까운 로드뷰의 panoId를 추출하여 로드뷰를 띄운다.
                rvClient.getNearestPanoId(position, 100, function (panoId) {
                    if(panoId == null) {
                        document.querySelector('#mapping .roadview-warning').style.visibility = 'visible'
                        document.querySelector('#mapping #map_btn').remove()
                    }else {
                        rv.setPanoId(panoId, position); //panoId와 오버레이좌표를 통해 로드뷰 실행
                    }
                });

                kakao.maps.event.addListener(rv, 'init', function () {

                });
            }
        }
    )
}
function roadview() {
    $('#map').toggleClass('is-hidden')
    $('#roadview').toggleClass('is-hidden')
    if ($('#map').hasClass('is-hidden')) {
        $('#map_btn').text("지도 보기")
    } else {
        $('#map_btn').text("로드뷰 보기")
    }
}


function deletePost(postId) {
    let result = confirm("정말로 삭제하시겠습니까?");
    if (result) {
        $.ajax({
            type: "DELETE",
            url: `${domain}/post/delete/${postId}`,
            data: {},
            beforeSend: function(xhr) {
                xhr.setRequestHeader("token", token);
            },
            success: function (response) {
                console.log(response)
                alert('삭제에 성공하였습니다.');
                window.location.href = '/list.html'
            }
        })
    }
}
