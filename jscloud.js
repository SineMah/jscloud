/*!
 * jsCloud v1.0
 *
 * License: MIT
 *
 * http://mincedmind.com
 * Copyright 2015 - 2017 mincedmind.com
 */

(function($) {

    $.fn.JSCloud = function(words, options) {

        var settings = $.extend({
            this: this,
            font: {
                max: 45,
                min: 20,
                count: 0,
                scale: 45,
                opacity: 1,
            },
            words: [],
            elements: [],
            consts: {
                e:  2.71828,
                k: 0.05,
                ratio: 1,
                radius: 1,
            },
            t: 0,
            box: {
                center: {
                    x: 0,
                    y: 0,
                },
                height: 0,
                width: 0,
            },

            element: {
                this: false,
                height: 0,
                width: 0,
                x: 0,
                y: 0,
            },
            offset: 10,
            t: 0,
            step: 0,
            count: 0,
        }, options);

        var init = function(words) {

            settings.box.height = parseInt($(settings.this).height());
            settings.box.width = parseInt($(settings.this).width());
            settings.box.center.y = parseInt($(settings.this).height() / 2);
            settings.box.center.x = parseInt($(settings.this).width() / 2);

            settings.count = words.length;
            settings.step = 360 / settings.count;

            setOccur(words);
            renderWords(words);

            cleanWords();
        };

        var setOccur = function(words) {

            if(typeof words !== 'object') {return false};

            words.sort(dynamicSort('occur'));
            words.reverse();

            settings.words = words;

            settings.font.count = words[0].occur;
        }

        var renderWords = function() {

            if(typeof settings.words !== 'object') {return false};

            if($(settings.this).css('position') !== 'absolute' && $(settings.this).css('position') !== 'relative') {$(settings.this).css('position', 'relative')};

            for(var key in settings.words) {
                word = settings.words[key];

                var element = renderWord(word);

                $(settings.this).append(element);

                if(parseInt(key) === 0) {$(element).css('font-style', 'italic');};

                setElementValues(element);

                placeElement();

                compressLayout();

                settings.elements[settings.t] = element;

                settings.t++;
            }
        };

        var renderWord = function(word) {
            element = document.createElement('span');

            if(typeof word.text === 'string') {element.innerHTML = word.text};

            if(typeof word.class === 'string') {element.className = word.class};

            if(typeof word.attr === 'object') {element.setAttribute(element, word.attr)};

            if(typeof word.occur === 'number') {element.setAttribute('occur', word.occur)};

            element.style.cssText = 'position:absolute;font-size:' + setFontSize(word) + 'px;left:' + settings.box.center.x + 'px;top:' + settings.box.center.y + 'px;opacity:' + setOpacity() + ';';

            return element;
        };

        var setAttributes = function(element, attributes) {

            for(var attrName in attributes) {
                attribute = attributes[attrName];

                element.setAttribute(attrName, attribute);
            }

            return element
        };

        var setFontSize = function(word) {
            // var size = parseInt((word.occur / settings.font.count) * settings.font.scale * settings.font.max);

            if(settings.font.scale < settings.font.min) {settings.font.scale = settings.font.min};

            settings.font.scale -= 5;

            return settings.font.scale;
        };

        var setOpacity = function() {
            var opacity = settings.font.opacity - 0.05;
            var min = 0.2;

            if(opacity < min) {opacity = min};

            settings.font.opacity = opacity;

            return opacity;
        };

        var getX = function(t) {
            // return settings.consts.a * Math.pow(settings.consts.e, settings.consts.k * t) * Math.cos(t) + settings.box.center.x + settings.offset;
            return t * settings.consts.radius * Math.cos(t) + settings.box.center.x;
        };

        var getY = function(t) {
            // return settings.consts.a * Math.pow(settings.consts.e, settings.consts.k * t) * Math.sin(t) + settings.box.center.y + settings.offset;
            return t * settings.consts.radius * Math.sin(t) + settings.box.center.y;
        };

        var placeElement = function() {
            var element = settings.element;
            var step = 2;
            var left = 0;
            var top = 0;

            left = getX(settings.t * settings.step);
            top = getY(settings.t * settings.step);

            // extract
            while(isCollision(element.this)) {

                $(element.this).css('left', left);
                $(element.this).css('top', top);

                if(left > settings.box.center.x) {
                    left += settings.offset;
                }else {
                    left -= settings.offset;
                }

                if(top > settings.box.center.y) {
                    top += settings.offset;
                }else {
                    top -= settings.offset;
                }
            }

            settings.element = element;
        };

        var compressLayout = function() {
            var i = 0;
            var element = settings.element;
            var step = 2;
            var left = parseInt($(element.this).css('left'));
            var top = parseInt($(element.this).css('top'));

            if(top < 0 + 10 || top + $(element.this).height() > settings.box.height - 10) {
                do {
                    top = Math.floor((Math.random() * settings.box.height) + 1);

                    $(element.this).css('top', top);

                    i++;

                } while(isCollision(element.this) && i < 100);
            }

            if(left < 0 || left > settings.box.width) {
                do {
                    // PQ Math.floor((Math.random() * settings.box.width - parseInt($((element.this).width()) + 1);
                    left = Math.floor((Math.random() * settings.box.width) + 1);

                    $(element.this).css('left', left);

                    i++;

                } while(isCollision(element.this) && i < 100);
            }
        };

        var cleanWords = function() {
            var e;
            var element;
            var container = {};

            container.height = parseInt(settings.this.height());
            container.width = parseInt(settings.this.width());

            for(var key in settings.elements) {
                element = settings.elements[key];

                e = {};
                e.this = $(element);
                e.height = parseInt($(element).height());
                e.width = parseInt($(element).width());
                e.top = parseInt($(element).css('top'));
                e.left = parseInt($(element).css('left'));

                if(e.height + e.top > container.height || e.width + e.left > container.width) {
                    e.this.hide();
                }
            }
        };

        var isCollision = function(element) {
            var fiend = {};
            var now = {};

            for (var i = 0; i < settings.elements.length; i++) {
                if(element === settings.elements[i]) {continue};

                fiend.height = parseInt($(settings.elements[i]).height());
                fiend.width = parseInt($(settings.elements[i]).width());
                fiend.x = parseInt($(settings.elements[i]).css('left'));
                fiend.y = parseInt($(settings.elements[i]).css('top'));

                now.height = parseInt($(element).height());
                now.width = parseInt($(element).width());
                now.x = parseInt($(element).css('left'));
                now.y = parseInt($(element).css('top'));

                if(overlapping(now, fiend)) {return true};
            }

            return false;
        };

        var overlapping = function(a, b) {
            if (Math.abs(2.0*a.x + a.width - 2.0*b.x - b.width) < a.width + b.width) {
                if (Math.abs(2.0*a.y + a.height - 2.0*b.y - b.height) < a.height + b.height) {
                    return true;
                }
            }

            return false;
        };

        var setElementValues = function(element) {
            settings.element.this = element;
            settings.element.height = parseInt($(element).height());
            settings.element.width = parseInt($(element).width());
            settings.element.x = parseInt($(element).css('left'));
            settings.element.y = parseInt($(element).css('top'));
        };

        var dynamicSort = function(property) {
            var sortOrder = 1;

            if(property[0] === "-") {
                sortOrder = -1;
                property = property.substr(1);
            }

            return function (a,b) {
                var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;

                return result * sortOrder;
            }
        };

        init(words);

        return this;
    };

}(jQuery));