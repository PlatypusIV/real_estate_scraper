// const cheerio = require("cheerio");


module.exports = class Base_Scraper {
    constructor() {
        this.cheerio = require("cheerio");
        this.puppeteer = require("puppeteer");
    }
}