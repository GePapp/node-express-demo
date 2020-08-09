$(document).ready(function () {
    // comics shop
    $("#search-botton").on("click", function () {
        var search = $("#search").val();
        // alert(search);

        axios
            .get("/shop?search=" + search)
            .then(function (response) {})
            .catch(function (error) {
                console.log("something is wrong");
            });
    });
});
