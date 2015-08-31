/**
 * Script used for the Styleguide structure only
 */

if (typeof window !== 'undefined') {
    global = window;
}

var FRONT_END_TEST = global.FRONT_END_TEST || false;

var StyleguideIndex = {
    init: function() {
        if ($('.shop-iframe-content').length && !FRONT_END_TEST) return false;

        this.$body = $('body');
        this.$breakpointsButton = $('.shop-header__breakpoints.icon');
        this.$breakpointsListItems = $('.shop-header__breakpoints__item');
        this.$breakpointsLinks = $('.shop-header__breakpoints__item__link');
        this.$sidebarContent = $('.shop-sidebar__content');
        this.$sidebarLinks = $('.shop-sidebar__nav__item__link');
        this.$sidebarToggle = $('[class*="shop-sidebar__toggle"]');
        this.$iframe = $('.shop-iframe-wrapper iframe');
        this.$iframeContent = this.isChromeAndFileProtocol() ? null : $('.shop-iframe-wrapper iframe').contents();

        this.sidebarOpenedClass = 'opened';
        this.sidebarActiveLinkClass = 'active';
        this.sidebarLinkWasClickedClass = 'side-menu-clicked';

        if (FRONT_END_TEST) return false;

        this.sidebarSetup();
        this.checkHashOnLoad();
        this.events();
    },

    isChromeAndFileProtocol: function() {
        if (FRONT_END_TEST) return false;
        return (window.location.protocol === 'file:' && navigator.userAgent.toLowerCase().indexOf('chrome') > -1);
    },

    /**
     * All events of the structure
     * should be registered here
     */
    events: function() {
        var _this = this,
            breakpointsVisible = false;

        this.$breakpointsButton.click(function() {
            if (breakpointsVisible) {
                //this.$breakpointsListItems.hide();
                $('.shop-header__breakpoints__item').hide();
                breakpointsVisible = false;
            } else {
                //this.$breakpointsListItems.show();
                $('.shop-header__breakpoints__item').show();
                breakpointsVisible = true;
            }
        });

        this.$breakpointsLinks.click(function() {
            _this.resizeContent($(this));
        });

        this.$sidebarLinks.click(function(e) {
            e.preventDefault();
            // Reenable to make this move the iframe to different sections
            //_this.navigateToAnchor($(this));



            // Set iframe to this page
            var link = $(e.target).data('link');

            if (!link) {
                var p = $(e.target).parent();
                if (p.hasClass('closed')) {
                    p.removeClass('closed');
                } else {
                    p.addClass('closed');
                }
            } else {
                _this.$iframe.attr('src', 'structure/pages/' + link + '.html');

                // Use ! to prevent de default browser behavior of anchor navigation
                window.location.hash = '!' + link;
                _this.setHeaderNavName(link);

                //_this.$iframeContent = this.isChromeAndFileProtocol() ? null : $('.shop-iframe-wrapper iframe').contents();
            }


        });

        this.$sidebarToggle.click(function(e) {
            e.preventDefault();
            _this.$body.toggleClass(_this.sidebarOpenedClass);
        });

        $(window).resize(function() {
            _this.sidebarResizeHandler();
        });
    },

    /**
     * Resize iframe based on
     * the breakpoint choice
     */
    resizeContent: function($elem) {
        var sizeLabel = $elem.data('size-label'),
            size = sizeLabel === 'full' ? $elem.data('size') : parseInt($elem.data('size').replace('px', ''), 10);

        this.$iframe.width(size);
    },

    /**
     * Check URL hash and navigate
     * to the respective module
     */
    checkHashOnLoad: function() {

        // Shutdown this feature in Chrome.
        // Chrome have a know issue with file protocol and iframe comunication.
        // It is not supported so we should not raise errors.
        if (this.isChromeAndFileProtocol()) return false;
        if (window.location.hash === '#' || window.location.hash === '') return false;

        var hashLink = window.location.hash.replace('!', '').replace('#', '');

        this.$iframe.attr('src', 'structure/pages/' + hashLink + '.html');

        this.setHeaderNavName(hashLink);

        // Reenable to facilitate same page modules
        /*var top = this.$iframeContent.find('section' + window.location.hash.replace('!', '')).offset().top,
          $iframeHtmlBody = this.$iframeContent.find('html, body');

        if (this.$iframeContent.find('section' + window.location.hash.replace('!', '')).index() === 0) {
          $(window).load(function() {
            $iframeHtmlBody.animate({scrollTop: 0}, 500);
          });
        } else {
          $iframeHtmlBody.animate({scrollTop: top + 20}, 0);
        }*/
    },

    setHeaderNavName: function(navLink) {
        // Find the nav menu item that matches the link

        //console.log($('.shop-anchor[data-link="' + navLink + '"]').html(), navLink);

        var link = $('.shop-anchor[data-link="' + navLink + '"]');
        var name = link.html(),
            parentName = link.data('parent');

        this.setActiveSidebarLinkOnClick($('.shop-anchor[data-link="' + navLink + '"]'));

        // Set The header title to match the name of the nav item
        if (!parentName) {
            $('.shop-header__welcome .title').html(name);
            $('.shop-header__welcome .subtitle').html('');
        } else {
            $('.shop-header__welcome .title').html(parentName);
            $('.shop-header__welcome .subtitle').html(name);
        }
    },

    /**
     * Navigate to module on
     * sidebar links click
     */
    navigateToAnchor: function($elem) {

        // Shutdown this feature in Chrome.
        // Chrome have a know issue with file protocol and iframe comunication.
        // It is not supported so we should not raise errors.
        if (this.isChromeAndFileProtocol()) return false;

        var top = this.$iframeContent.find('section' + $elem.attr('href')).offset().top + 50;

        // Use ! to prevent de default browser behavior of anchor navigation
        window.location.hash = '!' + $elem.attr('href').replace('#', '');

        this.$iframeContent.find('html, body').animate({
            scrollTop: top
        }, 800);
    },
    sidebarOpen: function() {
        this.$body.addClass('opened');
    },
    sidebarClose: function() {
        this.$body.removeClass('opened');
    },

    /**
     * Leave or close the sidebar
     * if the window is small
     */
    sidebarResizeHandler: function() {
        if ($(window).width() <= 1220) {
            this.sidebarClose();
        } else {
            this.sidebarOpen();
        }
    },
    sidebarSetup: function() {

        // Shutdown this feature in Chrome.
        // Chrome have a know issue with file protocol and iframe comunication.
        // It is not supported so we should not raise errors.
        if (this.isChromeAndFileProtocol()) {
            this.$sidebarContent.remove();
            this.$sidebarToggle.remove();
            return false;
        }

        if ($(window).width() >= 1220) {
            this.sidebarOpen();
        }
    },
    setActiveSidebarLinkOnClick: function($elem) {
        this.$body.addClass(this.sidebarLinkWasClickedClass);
        this.$sidebarLinks.removeClass(this.sidebarActiveLinkClass);
        $elem.addClass(this.sidebarActiveLinkClass);
    }
};

if (!FRONT_END_TEST) {
    $(window).load(function() {
        StyleguideIndex.init();
    });
} else {
    FRONT_END_TEST.StyleguideIndex = StyleguideIndex;
}
