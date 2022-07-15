
$(document).ready(function () {
    map('[[${post.address}]]');
    var floatPosition = parseInt($(".sideBanner").css('top'))

    $(window).scroll(function () {

        // 현재 스크롤 위치
        var currentTop = $(window).scrollTop();
        var bannerTop = currentTop + floatPosition + "px";

        //이동 애니메이션
        $(".sideBanner").stop().animate({
            "top": bannerTop
        }, 500);

    }).scroll();

    $(".sideBanner").click(function () {
        document.getElementById("frame").style.visibility = "hidden"
        window.location.href = "/chat/room/enter/[[${post.postId}]]"
    });
})

function show() {
    $("#post-box").empty()
    
}

function makeBody(post) {
    let tempHtml = `<div class="post-img-container">
                        <div class="post-img">
                            <img id="postImage" src="/image/backgrond.png">
                        </div>
                    </div>
                    <div class="post-title-container">
                        <div class="post-title">
                            <p id="postTitle">고구마 고양이 빌려드립니다.</p>
                            <p id="postAddress">서울시 서울구 서울동</p>
                            <p id="postPrice">20000원</p>
                            <div class="fix-dropdown">
                                <ul class="dropdown">
                                    <i class="fa-solid fa-ellipsis-vertical fa-2x dropbtn"></i>
                                    <li class="post-fix"><a href="#">수정하기</a></li>
                                    <li class="post-delete"><a href="#">삭제하기</a></li>
                                </ul>
                            </div>
                            <div class="post-like">
                                <a class="heart-icon" id="heart_a" aria-label="like" th:onclick="|javascript:toggle_like('${post.postId}')|">
                                <span class="icon is-small">
                                    <i id="heart" class="fa-solid fa-heart fa-3x" aria-hidden="true"></i>
                                    <i id="heart" class="fa-regular fa-heart fa-3x" aria-hidden="true"></i>
                                </span>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div class="profile-container">
                        <div class="profile">
                            <img id="profileImage" src="/image/section3-1.jpg">
                            <p id="profileName">다섯글자만</p>
                            <p id="postDate">작성일자 22.07.13</p>
                        </div>
                    </div>
                    <div class="post-content-container">
                        <div class="post-content">
                            <p id="postContent">고구마인데 고양이이고 고양이인데 고구마레요
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim, qui, reiciendis at iusto fuga optio necessitatibus, tenetur ratione voluptatem sed velit aliquid laboriosam. Et nobis culpa illum alias sint. Repellendus molestias, nulla ipsum rem ratione ducimus rerum, accusamus, corrupti accusantium doloribus aliquam eaque pariatur odio repellat numquam incidunt perspiciatis neque voluptatem quidem assumenda. Nulla saepe dolorum tempora illo aperiam qui vel officiis eum expedita? Odio saepe dignissimos sed totam hic sit, numquam repudiandae, velit, ea ipsum sunt aliquid voluptates provident qui! Amet porro unde perspiciatis hic quas in sint tempora fugiat eum doloremque ratione voluptatum reprehenderit eaque cumque, soluta corporis?
                            </p>
                        </div>
                        <div class="map-container">
                            <div class="map" id="mapping">
                                <!-- 지도를 표시할 div 입니다 -->
                                <div id="map" class="local"></div>
                                <!-- 로드뷰를 표시할 div 입니다 -->
                                <div id="roadview" class="road"></div>
                                <button id="map_btn" class="button is-dark"  onclick="roadview()">
                                    로드뷰 보기
                                </button>
                            </div>
                        </div>
                    </div>`
    $("#post-box").append(tempHtml)
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
            url: `/post/delete/${postId}`,
            data: {},
            success: function (response) {
                alert('삭제에 성공하였습니다.');
                window.location.replace("/")
            }
        })
    }
}
