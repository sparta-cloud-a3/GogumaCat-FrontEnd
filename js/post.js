let domain = "http://hongseos.shop"
let token = $.cookie("mytoken")

$(document).ready(function () {
    var splitLink = document.location.href.split("?")
    var postId = splitLink[1]
    getDetail(postId)
//     var floatPosition = parseInt($(".sideBanner").css('top'))

//     $(window).scroll(function () {

//         // 현재 스크롤 위치
//         var currentTop = $(window).scrollTop();
//         var bannerTop = currentTop + floatPosition + "px";

//         //이동 애니메이션
//         $(".sideBanner").stop().animate({
//             "top": bannerTop
//         }, 500);

//     }).scroll();

//     $(".sideBanner").click(function () {
//         document.getElementById("frame").style.visibility = "hidden"
//         window.location.href = "/chat/room/enter/[[${post.postId}]]"
//     });
// })
})

function getDetail(postId) { 
    $.ajax({
        type: "GET",
        url: `${domain}/post/${postId}`,
        data: {},
        dataType : "json",
        beforeSend: function(xhr) {
            xhr.setRequestHeader("token", token);
        },
        success: function (response) {
            makeDetail(response)
        }
    });
}

function makeDetail(response) {
    let post = response["post"]
    $("#postTitle").text(post["title"])
    $("#postAddress").text(post["address"])
    $("#postPrice").text(post["price"])
    $("#fix-dropdown").empty()
    if(response["nickname"] == post["writer"]) {
        $("#fix-dropdown").append(
            `<i class="fa-solid fa-ellipsis-vertical fa-2x dropbtn"></i>
            <li class="post-fix"><a href="#">수정하기</a></li>
            <li class="post-delete"><a href="#">삭제하기</a></li>`
        )
    }
    if(response["likeByMe"]) {
        $("#heart").removeClass("fa-regular")
        $("#heart").addClass("fa-solid")
    } else {
        $("#heart").removeClass("fa-solid")
        $("#heart").addClass("fa-regular")
    }
    $("#postContent").text(post["content"])
    map(post["address"])
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
    content += '        <img src="/img/info_image.png" style="object-fit: fill" >';
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
                        alert(' 반경 100미터 이내 로드뷰 정보가 없는 지역입니다.')
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

function deletePost(postId) {
    let result = confirm("정말로 삭제하시겠습니까?");
    if (result) {
        $.ajax({
            type: "DELETE",
            url: `${domain}/post/delete/${postId}`,
            data: {},
            success: function (response) {
                alert('삭제에 성공하였습니다.');
                window.location.replace("/")
            }
        })
    }
}
