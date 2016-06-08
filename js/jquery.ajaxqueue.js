/**
 *
 */
(function($) {
    'use strict';

    var AjaxQueue = (function(settings) {

        var DEFAULT_QUEUE_NAME = "default";

        var named = { };
        var defaults = { };

        var settings = $.extend({ }, defaults, settings);

        this.sendWithQueue = function(queueName, settings) {

            settings = $.extend({}, defaults, settings);

            console.info(queueName, settings);
        };
        
        this.sendWithDefaultQueue = function(settings) {

            this.sendWithQueue(DEFAULT_QUEUE_NAME, settings);
        };

        this.clearAll = function() {

            named = { };
        };

        this.clear = function(queueName) {

            named[queueName] = [];
        };
    });

    var self = new AjaxQueue({ url: "" });

    $.ajaxq = function(action, queueName, settings) {

        // console.log(self);

        var defaults = {
            url: "",
            success : function() {

                if ($.isFunction(settings.success)) {

                    settings.success();
                }
            },
            error : function() {

                self.clear();
            }};

        switch (arguments.length) {
            case 2:
                return self.sendWithQueue(arguments[0], arguments[1]);
            case 1:
                return self.sendWithDefaultQueue(arguments[0]);
            case 0:
                throw 'no args supplied';
        }

        switch (action) {
            case "clear":
                self.clear(queueName);
            case "abort":
                self.abort(queueName);
            default:
                throw 'action not defined!';
        }

    };

}(jQuery));

