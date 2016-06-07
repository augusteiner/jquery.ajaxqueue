jQuery(function () {

    return function ($) {

        var handlr = $.when();

        $.ajaxSetup({
            dataType: 'json',
            method: 'GET',
            timeout: 30000,
            success: function () { },
            error: function (xhr, e) { }
        });

        $('#send').submit(function (e) {

            var $this = $(this);

            e.preventDefault();

            // XXX Trying better ajax handling
            handlr = handlr.done(function (action) {

                return function () {

                    console.log("sending ajax request" + new Date());

                    var dfd = $.ajax({
                        url: action
                    }).done(function (r) {

                        console.log("received response");
                    });

                    while (!dfd.isResolved() ||
                        !dfd.isRejected()) {

                        //
                    }
                };
            }(this.action));
        });
    };
}(jQuery.noConflict()));

