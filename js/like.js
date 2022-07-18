function toggle_like(postId) {
    if ($("#heart").hasClass("fa-solid")) {
        $.ajax({
            type: "POST",
            url: `${domain}/update_like?postId=${postId}&action=unlike`,
            data: {},
            dataType : "json",
            beforeSend: function(xhr) {
                xhr.setRequestHeader("token", token);
            },
            success: function (response) {
                $("#heart").addClass("fa-regular").removeClass("fa-solid")
                $("#heart_a").removeClass("jello-horizontal")
            }
        })
    } else {
        $.ajax({
            type: "POST",
            url: `${domain}/update_like?postId=${postId}&action=like`,
            data: {},
            dataType : "json",
            beforeSend: function(xhr) {
                xhr.setRequestHeader("token", token);
            },
            success: function (response) {
                console.log("like")
                $("#heart").addClass("fa-solid").removeClass("fa-regular")
                $("#heart_a").addClass("jello-horizontal")
            }
        })
    }
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

function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function (event) {
    if (!event.target.matches('.dropbtn')) {

        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}
