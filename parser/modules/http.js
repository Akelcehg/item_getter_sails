var File = require('./file.js');
var driver = require('node-phantom-simple');

// Constructor
function Http(link) {
    //async(function*() {
        this.link = link;
        this.page_actions = [];
    //})();
}

Http.prototype.getPageContent2 = function(cb) {
    var self = this;

    driver.create({ path: require('phantomjs').path }, function(err, browser) {

        return browser.createPage(function(err, page) {

            page.set('settings.loadImages', 'false', function() {

                return page.open(self.link, function(err, status) {

                    if (status === 'fail') {
                        cb(status, null);
                        browser.exit();
                    } else {
                        page.includeJs("http://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js", function(err) {
                            if (err) console.log(err);
                            page.evaluate(function(err) {
                                if (err) console.log(err);
                                $("ul.list-unstyled.phones-view span").click();
                            });

                            setTimeout(function() {

                                page.evaluate(function() {
                                    window.scrollTo(0, document.body.scrollHeight);
                                });

                                setTimeout(function() {
                                    /*page.evaluate(function() {
                                     window.scrollTo(0, document.body.scrollHeight);
                                 });*/

                                 page.set('viewportSize', { width: 1024, height: 768 });
                                 page.render('capture.png');

                                 page.get('content', function(err, html) {
                                    page.evaluate(function() {
                                        window.scrollTo(0, document.body.scrollHeight);
                                    });
                                        ///setTimeout(function() {

                                            cb(err, html);
                                            browser.exit();
                                        //}, 10000);
                                    });

                             }, 10000);
                            }, 10000);

                        });
                    }
                });
            });

        });
    });
};

Http.prototype.getPageContent = function(cb) {
    var self = this;
    var resourceWait = 3000,
    maxRenderWait = 5000,
    url = self.link,
    count = 0,
    forcedRenderTimeout,
    renderTimeout;        

    driver.create({ path: require('phantomjs').path }, function(err, phantom) {
        if (err) console.log(err);
        return phantom.createPage(function(err, page) {

            if (err) console.log(err);

            page.set('viewportSize', { width: 1024, height: 9000 });

            function returnPageData() {
                setTimeout(function() {
                    page.render('capture.png');
                    page.get('content', function(err, html) {
                        phantom.exit();
                        cb(null, html);
                    });
                }, 2000);

            }

            function doRender() {
                page.render('capture.png');
                console.log("RENDERING PAGE " + count);
            }

            page.onResourceRequested = function(req) {
                count += 1;
                clearTimeout(renderTimeout);

            };

            page.onResourceReceived = function(res) {
                if (!res.stage || res.stage === 'end') {
                    count -= 1;                    
                    if (count === 0) {                        
                        renderTimeout = setTimeout(doRender, resourceWait);
                    }
                }
            };

            page.open(url, function(err, status) {

                if (status !== "success") {
                    console.log('Unable to load url');
                    phantom.exit();
                    cb('Http Fail', null);
                } else {
                    forcedRenderTimeout = setTimeout(function() {
                        returnPageData();
                        doRender();
                    }, maxRenderWait);
                }
            });
        });
    });
}

module.exports = Http;
