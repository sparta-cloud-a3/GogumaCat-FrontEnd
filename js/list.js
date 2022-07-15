let domain = "http://hongseos.shop"
let token = $.cookie("mytoken")

$(document).ready(function () {
    listing("latest");
});

function listing(orderType) {
    $.ajax({
        type: "GET",
        url: `${domain}/all?orderType=${orderType}`,
        data: {},
        dataType : "json",
        beforeSend: function(xhr) {
                xhr.setRequestHeader("token", token);
        },
        success: function (response) {
            $("#post-card-box").empty();
            let posts = response["data"]
            for (let i = 0; i < response["count"]; i++) {
                makeCard(posts[i]);
            }
        }
    });
}

function make_post(post) {
    let tempHtml =  `<article class="card">
                        <a href="${post["postId"]}" class="crad-link">
                            <div class="card-img">
                                <img src="${post[postImgs][0]["imgUrl"]}" alt="title">
                            </div>
                            <div class="card-desc">
                                <p class="card-title">${post["title"]}</p>
                                <p class="card-price">${post["price"]}</p>
                                <p class="card-address">${post["address"]}</p>
                                <p class="card-likeCount">${post["likeCount"]}</p>
                            </div>
                        </a>
                    </article>`

    $("#post-card-box").append(tempHtml)
}

function searching(new_order, new_page) {
    order = new_order
    page = new_page
    let query = $('#search-box').val();
    if (query == "") {
        query = $("#query-text-box").val().split[" "][0];
    }
    if (query == "") {
        alert("검색어를 입력하세요");
        return;
    } else {
        $.ajax({
            type: "GET",
            url: `/search?query=${query}&order=${order}&page=${page}`,
            data: {},
            success: function (response) {
                $("#card-box").empty();
                let posts = response;

                for (let i = 0; i < posts.length; i++) {
                    make_post(posts[i], i);
                }

                $("#query-text-box").empty()
                $("#query-text-box").append(`"${query}" 검색내역 입니다.`)
                $("#query-text-box").removeClass("is-hidden")
            }
        })
    }
}

function click_sort_btn(order_type) {
    if ($("#query-text-box").hasClass("is-hidden") && $("#juso-search-btn").hasClass("is-hidden")) {
        listing(order_type)
    } else if ($("#query-text-box").hasClass("is-hidden")) {
        search_by_address(order_type)
    } else {
        searching(order_type)
        }

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
//                 make_post(posts[i], i);
//             }
//         }
//     });
// }
