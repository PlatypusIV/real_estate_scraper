const r = require("./downloader/rest");
const fs = require("fs");
const kv_scraper = require("./scrapers/kv_scraper");
const rest = require("./downloader/rest");
const { setInterval } = require("timers");
const { parse } = require("path");

const url1 = "https://www.kv.ee/?act=search.simple&last_deal_type=20&company_id=&page=1&orderby=ob&page_size=50&deal_type=1&dt_select=1&county=0&search_type=old&parish=&rooms_min=&rooms_max=&price_min=&price_max=&nr_of_people=&area_min=&area_max=&floor_min=&floor_max=&energy_certs=&keyword=";

const Rest = new r.Rest();
const kv = new kv_scraper();

const kv_apartments = async () => {
    const apartmentsForSale = [];
    const apartmentUrls = [];
    const promiseArray = [];
    const apartmentHtmls = [];

    try {
        //get initial apartments on sale page
        const firstPage = await Rest.GET(url1, "text");

        apartmentsForSale.push(...kv.get_apartment_links_and_base_data(firstPage));
        const pageCount = kv.get_page_count(firstPage);

        //get all the page urls
        for (let i = 0; i < parseInt(pageCount) + 1; i++) {
            apartmentUrls.push(`https://www.kv.ee/?act=search.simple&last_deal_type=20&company_id=&page=${i}&orderby=ob&page_size=50&deal_type=1&dt_select=1&county=0&search_type=old&parish=&rooms_min=&rooms_max=&price_min=&price_max=&nr_of_people=&area_min=&area_max=&floor_min=&floor_max=&energy_certs=&keyword=`);
        }
        let ctr = 0;
        let kvInterval = setInterval(() => {
            for (let i = 0; i < 6; i++) {
                if (ctr === apartmentUrls.length - 1) {
                    promiseArray.push(Rest.GET(apartmentUrls[ctr], "text"));
                    clearInterval(kvInterval);
                    Promise.all(promiseArray).then(htmls => {
                        htmls.forEach(html => {
                            apartmentsForSale.push(kv.get_apartment_links_and_base_data(html));
                        });
                        fs.writeFile("apartmentsForSale.json", JSON.stringify(apartmentsForSale), (err) => { if (err) throw err; })
                    });
                    break;
                } else {
                    promiseArray.push(Rest.GET(apartmentUrls[ctr], "text"));
                    console.log(`Got page nr ${ctr}`);
                }
                ctr++;
            }
        }, 9000);

    } catch (error) {
        console.log(error);
    }

}



const run = () => {
    try {
        kv_apartments();
    } catch (error) {
        console.log(error);
    }
}

run();