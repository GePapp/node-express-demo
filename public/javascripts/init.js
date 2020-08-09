(function ($) {
    $(function () {
        $(".sidenav").sidenav();
        $(".parallax").parallax();
        $("select").formSelect();
        //  triger sidenav
        $(".dropdown-trigger").dropdown();
        // collapsible (dropdown) insidenav
        $(".collapsible").collapsible();

        if ($("textarea#description").length) {
            CKEDITOR.replace("description");
        }
    }); // end of document ready
})(jQuery); // end of jQuery name space
