$(document).ready(function () {
    // delete line
    $(".delete-line").on("click", function (e) {
        $target = $(e.target);
        const id = $target.attr("data-id");
        console.log($target.attr("data-id"));

        axios
            .delete("/lines/" + id)
            .then(function (response) {
                window.location.href = "/lines";
            })
            .catch(function (error) {
                console.log("something is wrong");
            });
    });

    // delete category
    $(".delete-category").on("click", function (e) {
        $target = $(e.target);
        const id = $target.attr("data-id");
        console.log($target.attr("data-id"));

        axios
            .delete("/categories/" + id)
            .then(function (response) {
                window.location.href = "/categories";
            })
            .catch(function (error) {
                console.log("something is wrong");
            });
    });

    // delete comic
    $(".delete-comic").on("click", function (e) {
        $target = $(e.target);
        const id = $target.attr("data-id");
        console.log($target.attr("data-id"));

        axios
            .delete("/comics/" + id)
            .then(function (response) {
                window.location.href = "/comics";
            })
            .catch(function (error) {
                console.log("something is wrong");
            });
    });

    // comics shop
    $(".search-botton").on("click", function () {
        var search = $(".search").val();
        console.log(search);

        axios
            .get("/shop?search=" + search)
            .then(function (response) {})
            .catch(function (error) {
                console.log("something is wrong");
            });
    });
});
