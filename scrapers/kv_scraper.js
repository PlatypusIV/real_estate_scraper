// const cheerio = require("cheerio");
const Base_Scraper = require("./Base_Scraper");


//object-type-apartment object-item
module.exports = class kv_scraper extends Base_Scraper{
    constructor(){
        super();
    }

    get_page_count=(first_page_html)=>{
        let pageCount = 0;
        try {
            const $ =this.cheerio.load(first_page_html);
            pageCount = $("ul.list.jump-pagination-list").find("a.count").text();
            console.log(pageCount);
        } catch (error) {
            console.log(error);
        }
        return pageCount;
    }

    get_apartment_links_and_base_data=(input_html)=>{
        const apartments = [];
        try {
            const $ = this.cheerio.load(input_html);
            $('tr.object-type-apartment.object-item').each((i,e)=>{
                const apartment = {};
               apartment.address = $(e).find("a.object-title-a.text-truncate").text().trim();
               apartment.link = $(e).find("a.object-title-a.text-truncate").attr("href");
               apartment.rooms = $(e).find("td.object-rooms.text-center").text();
               apartment.squareMeters = $(e).find("td.object-m2.text-center").text().trim();
               apartment.price = $(e).find("p.object-price-value").text().trim();
               apartment.priceSquareMeters = $(e).find("span.object-m2-price").text().trim();
               apartments.push(apartment);
            })

        } catch (error) {
            console.log(error);
        }
        return apartments;
    }

    scrape_apartment_sale =(input_html)=>{
        try {
            
        } catch (error) {
            console.log(error);
        }
    }

    scrape_apartment_rent=()=>{
        try {
            
        } catch (error) {
            console.log(error);
        }
    }



}

