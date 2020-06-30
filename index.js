const r = require("./downloader/rest");
const fs = require("fs");
const kv_scraper = require("./scrapers/kv_scraper");
const uusmaa_scraper = require("./scrapers/uusmaa_scraper");
const { setInterval } = require("timers");
const { Pool, Client } = require("pg");

const auth = require("./auth.json");
const { v4: uuidv4 } = require('uuid');

const url1 = "https://www.kv.ee/?act=search.simple&last_deal_type=20&company_id=&page=1&orderby=ob&page_size=50&deal_type=1&dt_select=1&county=0&search_type=old&parish=&rooms_min=&rooms_max=&price_min=&price_max=&nr_of_people=&area_min=&area_max=&floor_min=&floor_max=&energy_certs=&keyword=";

const Rest = new r.Rest();
const kv = new kv_scraper();
const uusmaa = new uusmaa_scraper();

const kv_apartments = async () => {
    const apartmentsForSale = [];
    const apartmentUrls = [];
    const promiseArray = [];

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
                            apartmentsForSale.push(...kv.get_apartment_links_and_base_data(html));
                        });
                        fs.writeFile("apartmentsForSale.json", JSON.stringify(apartmentsForSale), (err) => { if (err) throw err; });
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

const kv_houses = async () => {

}

const kv_plots = async () => {

}

const kv_businessPlots = () => {

}

const uusmaa_apartments = () => {

}

const write_apartments_sale_to_db = () => {
    try {
        fs.readFile("apartmentsForSale.json", "utf8", (err, data) => {
            console.log(JSON.parse(data));
        });
    } catch (error) {
        console.log(error);
    }
}

const connect_to_db = () => {
    try {
        const testApt = {
            "address": "Harjumaa, Tallinn, Lasnamäe, Lasnamäe 22",
            "linkToPage": "https://www.kv.ee/kliendipaev-2-06-2020-kell-1700-1800-uus-hind-128-3230464.html?nr=9515&search_key=a1931c36058642769dd3c50bdbe3348b",
            "rooms": "3",
            "squareMeters": "69.4 m²",
            "price": "128 000 €",
            "priceSquareMeters": "1 844 €/m²"
        };

        const client = new Client(auth.database_access);

        const insertIntoTableQuery = `INSERT INTO apartments_for_sale VALUES($1,$2,$3,$4,$5,$6,$7)`;

        client.connect();
        const { address, linkToPage, rooms, squareMeters, price, priceSquareMeters } = testApt;
        client.query(insertIntoTableQuery, [uuidv4(), address, linkToPage, rooms, squareMeters, price, priceSquareMeters]).then(res => {
            console.log(res.rows);
            client.end();
        }).catch(e => {
            console.log(e.stack);
            client.end();
        });
    } catch (error) {
        console.log(error);
    }
}

const run = () => {
    try {
        // kv_apartments();
        // write_apartments_sale_to_db();
        // connect_to_db();

        uusmaa.get_apartments_sale("https://uusmaa.ee").then((data) => {
            console.log(data);
            for(let i= 0;i<data.length;i++){
                console.log(data[i]);
            }
            // console.log("gotem");
        });
    } catch (error) {
        console.log(error);
    }
}

run();