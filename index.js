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

            handlr.then(function(){
                $.ajax({
                    url: this.action
                }).done(function(r) {
                    console.log(r);
                });
            });

            console.log("request sent to " + this.action);
        });
    };
}(jQuery));
