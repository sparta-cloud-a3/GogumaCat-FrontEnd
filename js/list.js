const domain = "https://www.hongseos.shop"
const token = $.cookie("mytoken")

$(document).ready(function () {
    var splitLink = document.location.href.split("?")
    if(splitLink[1]) { //검색어 있음
        var queryLink = splitLink[1].split("=")
        searchListing(queryLink[1])
    } else {
        listing("latest");
    }
    
});

function listing(orderType) {
    $.ajax({
        type: "GET",
        url: `${domain}/post/all?orderType=${orderType}`,
        data: {},
        dataType : "json",
        beforeSend: function(xhr) {
                xhr.setRequestHeader("token", token);
        },
        success: function (response) {
            $("#post-card-box").empty();
            let posts = response["data"]
            for (let i = 0; i < response["count"]; i++) {
                makePost(posts[i]);
            }
        }
    });
}

function searchListing(query) {
    $.ajax({
        type: "GET",
        url: `${domain}/post/search?query=${query}`,
        data: {},
        dataType : "json",
        beforeSend: function(xhr) {
            xhr.setRequestHeader("token", token);
        },
        success: function (response) {
            $("#post-card-box").empty();
            let posts = response["data"]
            //검색어 보여주는 칸
            $("#search-query-box").append(
                `<h3 class="menu-container"><span style="color: red;">"${decodeURI(query)}"</span>의 검색 결과 입니다.</h3>`
            )
            for (let i = 0; i < response["count"]; i++) {
                makePost(posts[i]);
            }
        },
        error : function () {
            alert("fail")
        }
    })
}

function makePost(post) {
    let tempHtml =  `<article class="card">
                        <a href="/post.html?id=${post["postId"]}" class="crad-link">
                            <div class="card-img">
                                <img src='${post["postImgs"][0]["imgUrl"]}' alt="title">
                            </div>
                            <div class="card-desc">
                                <p class="card-title">${post["title"]}</p>
                                <p class="card-price">${post["price"]}원</p>
                                <p class="card-address">${post["address"]}</p>
                                <p class="card-like">관심 ${post["likeCount"]}</p>
                            </div>
                        </a>
                    </article>`
    $("#post-card-box").append(tempHtml)
}

function click_sort_btn(order_type) {
    
    listing(order_type)

    if (order_type == "latest") {
        $('#latest-tag').addClass("is-dark")
        $('#like-tag').removeClass("is-dark")
        $('#address-tag').removeClass("is-dark")
    } else {
        $('#like-tag').addClass("is-dark")
        $('#latest-tag').removeClass("is-dark")
        $('#address-tag').removeClass("is-dark")
    }
}

function search() {
    let query = $("#search-text").val();

    if (query == "") {
        alert("검색어를 입력하세요");
        return;
    }
    console.log(query)
    window.location.replace(`/list.html?query=${query}`)
}

function initUserInfo() {
    
}

// function get_gu(si) {
//     $("#gu-box").addClass("is-hidden")
//     $("#dong-box").addClass("is-hidden")
//     $("#juso-search-btn").addClass("is-hidden")
//     $.ajax({
//         type: "GET",
//         url: `/get_gu?si=${si}`,
//         data: {},
//         success: function (response) {
//             if (response["gu"] == "세종특별자치시") {
//                 get_dong("세종특별자치시")
//                 return
//             }
//             $("#gu-select").empty();
//             let gu = response["gu"];
//             let temp_html = "<option>동네를 선택하세요</option>"
//             for (let i = 0; i < gu.length; i++) {
//                 temp_html += `<option value="${gu[i]}">${gu[i]}</option>`
//             }
//             $("#gu-select").append(temp_html)
//             $("#gu-box").removeClass("is-hidden")
//         }
//     });
// }

// function get_dong(gu) {
//     $.ajax({
//         type: "GET",
//         url: `/get_dong?gu=${gu}`,
//         data: {},
//         success: function (response) {
//             $("#dong-select").empty();
//             let dong = response["dong"];
//             let temp_html = "<option>동을 선택하세요</option>"
//             for (let i = 0; i < dong.length; i++) {
//                 temp_html += `<option value="${dong[i]}">${dong[i]}</option>`
//             }
//             $("#dong-select").append(temp_html)
//             $("#dong-box").removeClass("is-hidden")
//         }
//     });
// }

// function search_by_address(new_order, new_page) {
//     order = new_order
//     page = new_page
//     let si = $("#si-select").val()
//     let gu = $("#gu-select").val()
//     let dong = $("#dong-select").val()
//     $.ajax({
//         type: "GET",
//         url: `/search/address?si=${si}&gu=${gu}&dong=${dong}&order=${order}&page=${page}`,
//         data: {},
//         success: function (response) {
//             $("#card-box").empty();
//             let posts = response["posts"];
//             pagination(parseInt(response["last_page_num"]), page, "address")
//             for (let i = 0; i < posts.length; i++) {
//                 makePost(posts[i], i);
//             }
//         }
//     });
// }
