function search() {
      let query = $("#search-text").val();

      if (query == "") {
            alert("검색어를 입력하세요");
            return;
      }
      console.log(query)
      window.location.replace(`/list.html?query=${query}`)
}