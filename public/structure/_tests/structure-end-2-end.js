INTEGRATION_TEST = {};

var watch = require('../_node-files/watch'),
    that = this,
    TEST_PORT;

module.exports = {
    before: function(browser, done) {
     INTEGRATION_TEST.run = function(PORT) {
         console.log('Styleguide started. Ready to run Nightwatch tests.');
         TEST_PORT = PORT;
         done();
     };
    },
    "DOMelementsPresent": function (browser) {
        browser
            .url('http://127.0.0.1:' + TEST_PORT)
            .waitForElementVisible('body', 2000)
            .pause(2000)
            .maximizeWindow()
            .assert.elementPresent('.shop-header')
            .assert.elementPresent('.shop-sidebar')
            .assert.elementPresent('.shop-header__welcome')
            .assert.elementPresent('.shop-header__breakpoints')
            .assert.elementPresent('.shop-iframe-wrapper')
            .assert.elementPresent('.shop-sidebar__content')
            .assert.elementPresent('.shop-sidebar__nav')
            .pause(4000)
            .perform(function(client, done) {
                setTimeout(function() {
                    client.end();
                    done();
                    process.exit();
                }, 500);
            });
    }
};