jQuery(function($) {

    var instance = new (function($) {

        var Request = function() {
            var DEFAULT_QUEUE_NAME = "default";

            var named = { };

            var dfd = $.Deferred();
            var defaults = {
                url: ""
            };

            // console.log(named);

            this.resolveFirst = function(queue) {

                if (queue.length > 0) {
                    var dfd = queue.shift();

                    console.log(dfd);

                    dfd.resolve();
                }
            };

            this.send = function(data, callback, settings, queueName){

                if (queueName == null) {

                    queueName = DEFAULT_QUEUE_NAME;
                }

                named[queueName] = named[queueName] || [];
                var queue = named[queueName];
                var $this = this;
                var dfd = null;

                console.log(queue, queueName);

                settings = $.extend({}, defaults, settings);

                if (settings.url == null) {

                    console.log("url is null");

                    // XXX do not send $.ajax()
                    dfd = $.Deferred().done(function() {

                        callback(null, settings);

                        $this.resolveFirst(queue);
                    });
                } else {

                    dfd = $.Deferred().done(function() {

                        $.ajax(
                            data,
                            function(r) {

                                callback(r);

                                $this.resolveFirst(queue);
                            },
                            settings);
                    });
                }

                queue.push(dfd);

                if (queue.length == 1) {

                    console.log("length == 1, resolving...");
                    setTimeout(
                        function() {

                            $this.resolveFirst(queue);

                            console.log("resolved!");
                        }, 1000);
                    
                }
            };
        };

        return Request;
    }($));

    instance.send({ current: 1 }, function() { console.log('aqui 1...'); }, { url: "index.json" });
    instance.send({ current: 2 }, function() { console.log('aqui 2...'); }, { url: "index.json" });

    return function() {

        $('#send').submit(function(e) {
            var handlr = $.Deferred();

            var $this = $(this);

            e.preventDefault();

            console.log("sending ajax request" + new Date());

            var dfd = $.ajax({
                url: this.action
            }).done(function(r) {

                console.log("received response");

                handlr.resolve();
            }).fail(function(r) {

                handlr.reject();
            });

            while (handlr.state() == "pending");
        });
    };
}(jQuery));

