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

                        console.log("calling callback ...");
                        callback(null, settings);

                        console.log("resolving next ...");
                        $this.resolveNext(queue);
                    });
                } else {

                    dfd = $.Deferred().done(function() {

                        $.ajax(
                            data,
                            function(r) {

                                console.log("calling callback ...");
                                callback(r);

                                console.log("resolving next ...");
                                $this.resolveNext(queue);
                            },
                            settings);
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

