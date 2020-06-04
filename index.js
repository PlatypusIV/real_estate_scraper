const r = require("./downloader/rest");

const Rest = new r.Rest();

Rest.GET("https://kinnisvara24.delfi.ee/kinnisvaraotsing","text").then(res=>{
    console.log(res);
});