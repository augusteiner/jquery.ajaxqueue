jQuery(function($) {
    'use strict';

    var instance = new (function($) {

        var Request = function() {
            var DEFAULT_QUEUE_NAME = "default";

            var named = { };

            var dfd = null;
            var defaults = {
                url: ""
            };

            // console.log(named);

            this.resolveNext = function(queue) {

                if (queue.length > 0) {
                    var dfd = queue.shift();

                    // console.log(dfd);

                    dfd.resolve();
                }
            };

            this.send = function(settings, callback, queueName){

                if (queueName == null) {

                    queueName = DEFAULT_QUEUE_NAME;
                }

                named[queueName] = named[queueName] || [];

                var queue = named[queueName];
                var $this = this;
                var dfd = null;

                console.log(queue.length, queueName);

                settings = $.extend({}, defaults, settings);

                if (settings.url == null) {

                    console.log("url is null");

                    // XXX do not send $.ajax()
                    dfd = $.Deferred().done(function() {

                        console.log("calling callback ...");
                        callback(null, settings);

                        console.log("resolving next ...");
                        $this.resolveNext(queue);
                    });
                } else {

                    dfd = $.Deferred().done(function() {

                        console.log("sending $.ajax request ...");

                        $.ajax(settings)
                            .done(function(r) {

                                console.log("calling callback ...");
                                callback(r);

                                console.log("callback called!");

                                console.log("resolving next ...");
                                $this.resolveNext(queue);
                            });
                    });
                }

                queue.push(dfd);

                if (queue.length == 1) {

                    console.log("length == 1, resolving...");
                    setTimeout(
                        function() {

                            $this.resolveNext(queue);

                            console.log("resolved!");
                        }, 1000);
                    
                }
            };
        };

        return Request;
    }($));

    return function() {
        var i = 1;

        $('#send').submit(function(e) {
            e.preventDefault();

            instance.send(
                { data: { current : i }, url: "index.json" },
                function() { console.log('aqui ' + (i++) + ' ...'); });

            instance.send(
                { data: { current : i }, url: "index.json" },
                function() { console.log('aqui ' + (i++) + ' ...'); });
        });
    };
}(jQuery));

