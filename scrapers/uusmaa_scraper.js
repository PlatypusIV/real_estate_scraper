const Base_Scraper = require("./Base_Scraper");

module.exports = class uusmaa_scraper extends Base_Scraper {
    constructor() {
        super();
    }


    get_apartments_sale = (firstPageUrl) => {
        try {

            return new Promise((resolve, reject) => {
                const options = { args: [`--widnow-size=${1920},${1080}`] }
                this.puppeteer.launch(options).then(browser => {
                    browser.newPage().then(page => {
                        page.goto(firstPageUrl).then(() => {
                            page.click("li#menu-item-42").then(() => {

                                page.$$eval("div .col",el=>{
                                    const htmlArray = [];
                                    el.map(e=>htmlArray.push(e.innerHTML));
                                    return htmlArray;
                                }).then(data=>{
                                    browser.close();
                                    resolve(data);
                                });

                            //     page.screenshot({ "path": "screenshotBig.png" }).then(() => {
                            //             browser.close();
                            //             resolve();
                            //     })
                            // })

                            // page.click("a.next.page-numbers").then(() => {
                            //     page.content().then(data => {
                            //         browser.close();
                            //         resolve(data); 
                            //     })
                            // })
                        })
                    })
                });
            })
        } catch (error) {
            console.log(error);
        }
    }


}