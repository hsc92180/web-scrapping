const fs = require("node:fs");
const cheerio = require('cheerio');
const xlsx = require("xlsx");

const pageUrl = "https://www.fnp.com/gifts/for-mother-lp?promo=desk_top_icon_pos_0";
const headers = {
    "content-type":"text/html"
}
const axios = require("axios");
const { Cheerio } = require("cheerio");

async function getData() {
    try {
        const response = await axios.get(pageUrl, {headers});
        // console.log(response.data);
        fs.writeFileSync("data.txt", response.data);
    } catch (err) {
        console.log("eror occured", err);
    }
}
getData();

const raedFileData = () => {
   return fs.readFileSync("data.txt", { encoding: "utf-8" });

}
const readedData = raedFileData();
const $ = cheerio.load(readedData);
// console.log(readedData);
const data = $(".jss18").find('.products');
// console.log(data);
let products = [];

data.each((index, prod)=> {
    products.push (
         {
         name : $(prod).find(".product-card_product-title__32LFp").text(),
         rating : $(prod).find(".product-card_rating-sec__34VZH").text(),
            price: $(prod).find("[data-testid='price']").text(),
        }
    )
})
// console.log(products);

const workbook = xlsx.utils.book_new();
const worksheet = xlsx.utils.json_to_sheet(products);
xlsx.utils.book_append_sheet(workbook, worksheet, "Sheet 1");
xlsx.writeFile(workbook, "productData.xlsx");
