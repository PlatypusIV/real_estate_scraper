const fs = require("fs");

const writeToFile =(path,data)=>{
    try {
        return new Promise((resolve,reject)=>{
            fs.writeFile(path,data,(err)=>{
                if(err)throw err;
                resolve();
            })
        })
    } catch (error) {
        console.log(error);
    }
}

const appendToFile =(path,data)=>{
    try {
        
    } catch (error) {
        console.log()
    }
}

const readFromFile =()=>{

}


module.exports={
    writeToFile,readFromFile,appendToFile
}