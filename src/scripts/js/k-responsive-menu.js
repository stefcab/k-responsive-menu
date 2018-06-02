/*
 * Project: k-responsiv-menu is a lightweight jQuery plugin to create responsive multi - level navigation menus with multi device support
 *  Author: Bao Nguyen
 *  License: MIT
 *  Website: http://baonguyenyam.github.io
 *  Version: 1.0.0
 */

;
(function ($, window, document, undefined) {
    var kA = 'kResponsiveMenu'

    function kaGlobal(element, options, type) {
        this.element = element
        this._name = kA
        this._defaults = $.fn.kResponsiveMenu.defaults
        this.options = $.extend({}, this._defaults, options)
        this.init()
    }

    $.extend(kaGlobal.prototype, {

        init: function () {
            this.bindEvents()
            this.onComplete()
        },
        destroy: function () {
            this.unbindEvents()
            this.element.removeData()
        },

        bindEvents: function () {
            var plugin = this
            this.element = $(this.element)

            if (this.element.attr('k-responsive-menu')) {
                // Khai báo bởi Attr
                var $e = this.element,
                    $o = $e.attr('k-menu-resize') ? $e.attr('k-menu-resize') : this.options.resizeWidth,
                    $d = $e.attr('k-menu-type') ? $e.attr('k-menu-type').toLocaleLowerCase() : this.options.menuType.toLocaleLowerCase(),
                    $i = $e.attr('k-menu-icon') ? $e.attr('k-menu-icon').toLocaleLowerCase() : this.options.menuIcon.toLocaleLowerCase(),
                    $sl = $e.attr('k-menu-speed') ? $e.attr('k-menu-speed').toLocaleLowerCase() : this.options.animationSpeed.toLocaleLowerCase();
            } else {
                // Khai báo bởi JS
                var $e = this.element,
                    $o = this.options.resizeWidth,
                    $d = this.options.menuType,
                    $i = this.options.menuIcon,
                    $sl = this.options.animationSpeed
            }
            // Add Class Default
            $e.addClass('k-responsive-menu')
            $e.addClass('k-menu-'+ $d)

            // DO MENU 
            var nguyenApp = {
                resizeTimer: null,
                doMenuType: function() {
                    // Loại menu
                    // Accordion   => return 1
                    // Vertical    => return 2
                    // Horizontal  => return 3
                    return "accordion" === $d ? 1 : "vertical" === $d ? 2 : 3
                },
                doMenuSpeed: function() {
                    // Tốc độ chuyển đổi
                    // Number       => Return number 
                    // Slow, Fast   => Return string
                    return "number" == typeof $sl ? parseInt($sl) : "string" == typeof $sl ? $sl : void 0
                },
                doChangeMenu: function() {
                    // Kích thước sẽ thay đổi menu
                    // Number                         => Return number 
                    // 'xs', 'sm', 'md', 'lg', 'xl'   => Return number
                    if ("number" == typeof $o) return parseInt($o);
                    if ("string" == typeof $o) {
                        var o;
                        return o = "xs" === $o ? 0 : "sm" === $o ? 576 : "md" === $o ? 768 : "lg" === $o ? 992 : "xl" === $o ? 1200 : 0, parseInt(o)
                    }
                }, 
                menuBar: function () {
                    var __speed = this.doMenuSpeed()
                    $i && 0 < $i.length && $(".k-menu-toggle").html($i);
                    $('.k-menu-toggle').click(function () {
                        var getFather = $(this).attr('k-toggle-for')
                        $(getFather).slideToggle(__speed)
                    })
                },
                doResponsiveMenu: function() {
                    var getchange = 0,
                    __type = this.doMenuType(),
                    __change = this.doChangeMenu();
                    getchange != __change && (getchange = __change);
                    // Add or Remove Class on Screen
                    if ($(window).innerWidth() >= getchange) {
                        if (__type == 3) {
                            this.makeHorizontalPC()
                        }
                    } else {
                        if (__type == 3) {
                            this.makeHorizontalMobile()
                        }
                    }
                },
                makeHorizontalPC: function () {
                    $e.removeClass('k-active').removeAttr('style')
                    $('.k-menu-bar').hide()
                },
                makeHorizontalMobile: function () {
                    $e.addClass('k-active')
                    $('.k-menu-bar').show()
                }
            }

            nguyenApp.menuBar()
            nguyenApp.doResponsiveMenu()

            plugin.element.on('click' + '.' + plugin._name, function () {
                plugin.onClick.call(plugin)
            })
            plugin.element.on('mouseover' + '.' + plugin._name, function () {
                plugin.onHover.call(plugin)
            })
            plugin.element.on('mouseleave' + '.' + plugin._name, function () {
                plugin.unHover.call(plugin)
            })
            $(window).resize(function () {
                nguyenApp.doResponsiveMenu()
                plugin.onResize.call(plugin)
                clearTimeout(nguyenApp.resizeTimer);
                nguyenApp.resizeTimer = setTimeout(function() {
                    plugin.onResizeEnd.call(plugin)
                }, 200);
            })
        },

        unbindEvents: function () {
            this.element.off('.' + this._name)
        },

        onResize: function () {
            var onResize = this.options.onResize
            if (typeof onResize === 'function') {
                onResize.call(this.element)
            }
        },

        onResizeEnd: function () {
            var onResizeEnd = this.options.onResizeEnd
            if (typeof onResizeEnd === 'function') {
                onResizeEnd.call(this.element)
            }
        },

        onClick: function () {
            var onClick = this.options.onClick

            if (typeof onClick === 'function') {
                onClick.call(this.element)
            }
        },

        onHover: function () {
            var onHover = this.options.onHover

            if (typeof onHover === 'function') {
                onHover.call(this.element)
            }
        },

        unHover: function () {
            var unHover = this.options.unHover

            if (typeof unHover === 'function') {
                unHover.call(this.element)
            }
        },

        onBegin: function () {
            var onBegin = this.options.onBegin

            if (typeof onBegin === 'function') {
                onBegin.call(this.element)
            }
        },

        onComplete: function () {
            var onComplete = this.options.onComplete

            if (typeof onComplete === 'function') {
                onComplete.call(this.element)
            }
        },

        onChange: function () {
            var onChange = this.options.onChange

            if (typeof onChange === 'function') {
                onChange.call(this.element)
            }
        }

    })

    // Click Toggle
    $.fn.clickToggle = function (a, b) {
        function cb() {
            [b, a][this._tog ^= 1].call(this)
        }
        return this.on('click', cb)
    }
    // Build MENU 

    $.fn.kResponsiveMenu = function (options) {
        this.each(function () {
            if (!$.data(this, 'kResponsiveMenu_' + kA)) {
                $.data(this, 'kResponsiveMenu_' + kA, new kaGlobal(this, options, 'initial'))
            }
        })
        return this
    }



    $.fn.kResponsiveMenu.defaults = {
        animationSpeed: 'fast', // slow, fast, 200
        resizeWidth: 768,
        menuType: 'horizontal', // horizontal, vertical, accordion
        menuIcon: null,
        onResize: null,
        onComplete: null,
        onChange: null,
        onClick: null,
        onBegin: null,
        onHover: null
    }
})(jQuery, window, document)


// ;
// (function ($) {
//     $.fn.kResponsiveMenu = function (options) {

//         //plugin's default options
//         var defaults = {
//             resizeWidth: '768',
//             animationSpeed: 'fast',
//             accoridonExpAll: false
//         };

//         //Variables
//         var options = $.extend(defaults, options),
//             opt = options,
//             $resizeWidth = opt.resizeWidth,
//             $animationSpeed = opt.animationSpeed,
//             $expandAll = opt.accoridonExpAll,
//             $kMenu = $(this),
//             $menuStyle = $(this).attr('k-menu-style');

//         // Initilizing        
//         $kMenu.find('ul').addClass("sub-menu");
//         $kMenu.find('ul').siblings('a').append('<span class="arrow "></span>');
//         if ($menuStyle == 'accordion') {
//             $(this).addClass('collapse');
//         }

//         // Window resize on menu breakpoint 
//         if ($(window).innerWidth() <= $resizeWidth) {
//             menuCollapse();
//         }
//         $(window).resize(function () {
//             menuCollapse();
//         });

//         // Menu Toggle
//         function menuCollapse() {
//             var w = $(window).innerWidth();
//             if (w <= $resizeWidth) {
//                 $kMenu.find('li.menu-active').removeClass('menu-active');
//                 $kMenu.find('ul.slide').removeClass('slide').removeAttr('style');
//                 $kMenu.addClass('collapse hide-menu');
//                 $kMenu.attr('k-menu-style', '');
//                 $('.k-menu-toggle').show();
//             } else {
//                 $kMenu.attr('k-menu-style', $menuStyle);
//                 $kMenu.removeClass('collapse hide-menu').removeAttr('style');
//                 $('.k-menu-toggle').hide();
//                 if ($kMenu.attr('k-menu-style') == 'accordion') {
//                     $kMenu.addClass('collapse');
//                     return;
//                 }
//                 $kMenu.find('li.menu-active').removeClass('menu-active');
//                 $kMenu.find('ul.slide').removeClass('slide').removeAttr('style');
//             }
//         }

//         //ToggleBtn Click
//         $('[k-data-menu]').click(function () {
//             var getMenu = $(this).attr('k-data-menu')
//             $(getMenu).slideToggle().toggleClass('hide-menu');
//         });


//         // Main function 
//         return this.each(function () {
//             // Function for Horizontal menu on mouseenter
//             $kMenu.on('mouseover', '> li a', function () {
//                 if ($kMenu.hasClass('collapse') === true) {
//                     return false;
//                 }
//                 $(this).off('click', '> li a');
//                 $(this).parent('li').siblings().children('.sub-menu').stop(true, true).slideUp($animationSpeed).removeClass('slide').removeAttr('style').stop();
//                 $(this).parent().addClass('menu-active').children('.sub-menu').slideDown($animationSpeed).addClass('slide');
//                 return;
//             });
//             $kMenu.on('mouseleave', 'li', function () {
//                 if ($kMenu.hasClass('collapse') === true) {
//                     return false;
//                 }
//                 $(this).off('click', '> li a');
//                 $(this).removeClass('menu-active');
//                 $(this).children('ul.sub-menu').stop(true, true).slideUp($animationSpeed).removeClass('slide').removeAttr('style');
//                 return;
//             });
//             //End of Horizontal menu function

//             // Function for Vertical/Responsive Menu on mouse click
//             $kMenu.on('click', '> li a', function () {
//                 if ($kMenu.hasClass('collapse') === false) {
//                     //return false;
//                 }
//                 $(this).off('mouseover', '> li a');
//                 if ($(this).parent().hasClass('menu-active')) {
//                     $(this).parent().children('.sub-menu').slideUp().removeClass('slide');
//                     $(this).parent().removeClass('menu-active');
//                 } else {
//                     if ($expandAll == true) {
//                         $(this).parent().addClass('menu-active').children('.sub-menu').slideDown($animationSpeed).addClass('slide');
//                         return;
//                     }
//                     $(this).parent().siblings().removeClass('menu-active');
//                     $(this).parent('li').siblings().children('.sub-menu').slideUp().removeClass('slide');
//                     $(this).parent().addClass('menu-active').children('.sub-menu').slideDown($animationSpeed).addClass('slide');
//                 }
//             });
//             //End of responsive menu function

//         });
//         //End of Main function
//     }
// })(jQuery);;