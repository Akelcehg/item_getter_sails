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
    var resourceWait = 300,
        maxRenderWait = 5000,
        //url = 'https://twitter.com/nodejs',
        //url = 'https://auto.ria.com/search/?category_id=0&marka_id=0&model_id=0&state=0#state[0]=0&s_yers[0]=0&po_yers[0]=0&currency=1&marka_id[0]=0&model_id[0]=0&countpage=10',
        url = self.link,
        count = 0,
        forcedRenderTimeout,
        renderTimeout;

    //var page = require('node-phantom-simple');
    driver.create({ path: require('phantomjs').path }, function(err, phantom) {

        return phantom.createPage(function(err, page) {



            //page.viewportSize = { width: 1280, height: 1024 };
            //page.property('viewportSize', { width: 1024, height: 1024 });

            page.set('viewportSize', { width: 1024, height: 9000 });
            page.set('settings.loadImages', 'false');


            function doRender() {
                //page.set('viewportSize', { width: 1024, height: 768 });
                page.render('capture.png');
                //page.render('twitter.png');
                console.log("RENDERING PAGE");
                setTimeout(function() {

                    page.get('content', function(err, html) {
                        console.log('COUNT ' + count);
                        if (count === 0) {
                            clearTimeout(renderTimeout);
                            phantom.exit();
                            cb(null, html);                             
                        }

                    });
                }, 2000);
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
                        doRender();
                    }, maxRenderWait);

                }

            });
        });
    });
}

module.exports = Http;
