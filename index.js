jQuery(function(){

    return function($){
        var handlr = $.when();

        $.ajaxSetup({
            dataType: 'json',
            method: 'GET',
            timeout: 30000,
            success: function(){ },
            error: function(xhr, e) { }
        });

        $('#send').submit(function(e) {
            var $this = $(this);

            e.preventDefault();

            // XXX Trying better ajax handling
            handlr.done(function(action){
                return function(){
                    $.ajax({
                        url: action
                    }).done(function(r) {
                        console.log(r);
                    });
                };
            }(this.action));

            console.log("request sent to " + this.action);
        });
    };
}(jQuery));
