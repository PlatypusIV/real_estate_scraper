const fetch = require("node-fetch");

class Rest {
    constructor(){
        this.userAgents = ["Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36","Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36","Mozilla/5.0 CK={} (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko"];
    }

    set_user_agent=()=>{
        
    }

    GET=(url,type="json")=>{
        return new Promise((resolve,reject)=>{
            if(type==="json"){
                fetch(url,{headers:{"user-agent":this.userAgents[0]}}).then(data=>{
                    resolve(data.json());
                });
            }else{
                fetch(url,{headers:{"user-agent":this.userAgents[0]}}).then(data=>{
                    resolve(data.text());
                });
            }
        });
    }

    POST=(url,requestObject,type="json")=>{

    }

    PATCH=(url,requestObject,type="json")=>{

    }
}

module.exports={
    Rest
}