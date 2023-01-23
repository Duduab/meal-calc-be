const { default: axios } = require('axios');
const urls = require('./constants');
const resizebase64  = require('resize-base64');
const sharp = require('sharp');
const Products = require('../Models/Products');
const { findOneAndUpdate } = require('../Models/Products');

const UpdateProduct = async(startRows,intervalTime=0)=>{
    const MAX_ROWS = 600;
    let endRows = 600;
    try {
        let apiUrl ='https://fe.gs1-hq.mk101.signature-it.com/external/app_query/select_query.json'
    let body ={
        "query": `modification_timestamp > DATE_SUB(NOW(), INTERVAL ${intervalTime} DAY)`,
        "get_chunks": { "start":startRows, "rows":MAX_ROWS }
        }
    const config = {
            headers: {
              'Content-Type': 'application/json',
              'authorization': 'Basic VG9wYXo6Zk82QDE3WDQ='
            }
          };
   
    let apiRes = await axios.post(apiUrl,body,config)
    console.log(startRows,apiRes.data[0].length);
    let products = apiRes.data[0]
         // console.log(products[0]);
    products = await getImagesAndDetails(products,true)
    
    if (apiRes.data[0].length==0) {
        return
    }
     await UpdateProduct(startRows+600)
        
    } catch (error) {
        console.log(error);
        await fetchAllProduct(startRows+600)

    }
    

}
 const fetchAllProduct = async(startRows=0)=>{
    const MAX_ROWS = 600;
    let endRows = 600;
    try {
        let apiUrl ='https://fe.gs1-hq.mk101.signature-it.com/external/app_query/select_query.json'
    let body ={
        "query": "modification_timestamp > DATE_SUB(NOW(), INTERVAL 14000 DAY)",
        "get_chunks": { "start":startRows, "rows":MAX_ROWS }
        }
    const config = {
            headers: {
              'Content-Type': 'application/json',
              'authorization': 'Basic VG9wYXo6Zk82QDE3WDQ='
            }
          };
   
    let apiRes = await axios.post(apiUrl,body,config)
    console.log(startRows,apiRes.data[0].length);
    let products = apiRes.data[0]
         // console.log(products[0]);
    products = await getImagesAndDetails(products,false)
    
    if (apiRes.data[0].length==0) {
        return
    }
     await fetchAllProduct(startRows+600)
        
    } catch (error) {
        console.log(error);
        await fetchAllProduct(startRows+600)

    }
    

}
const getImagesAndDetails=async(products,forUpdate=false)=>{
    for (let index = 0; 0 < products.length; index++) {
        const element = products[index];
        const productCode = element.product_code
        const p =await Products.count()
        console.log("Product that saved so Far: ", p);
        let productToSave=products
        let image = ''
        let imageTries=0
        let moreDetails ={}
        if (productCode) {
            try {
                try {
                    const res =await axios.get(urls.IMAGE_URL+productCode)
                    try {
                        const imageBuffer = Buffer.from(res.data,"base64");
                        await sharp(imageBuffer).resize(150,150).toFile('d.png')
                        const fs = require('fs').promises;
                        const contents = await fs.readFile('d.png', {encoding: 'base64'});
                        await fs.unlink('d.png')
                        image =contents          
                    } catch (error) {
                        console.log(error);
                        image =''
                    }
                           
                    }
                 catch (error) {
                    console.log("RRRR");
                console.log(error);
                    if (error?.response?.status === 503 || error?.response?.status ===500)
                    {
                        image =''
                    }
                    else{
                        index = index-1;
                        continue
                    }
                }
               try {
                const moreDetailsRes = await axios.get(urls.MORE_DETAILS+productCode)
                moreDetails = moreDetailsRes?.data[0]?.product_info?.Nutritional_Values?.table?.rows
               } catch (error) {
                console.log("ERRRR");
                console.log(error);
                if (error?.response?.status === 503 || error?.response?.status ===500||!moreDetails)
                {
                    moreDetails =''
                }
                else{
                    index = index-1;
                    continue
                }
               }
                productToSave ={
                    ...element,
                    moreDetails:moreDetails,
                    imgBase64:image           
                }
               console.log(element.id);
                const filter = { "id":productCode };
                console.log("FILTER",filter);
                
                try {
                    console.log(products.length);
                    let pr = new Products({...productToSave})
                    if(!forUpdate){
                        await pr.save()
                    }
                   let x = await Products.findOneAndUpdate(filter,{...productToSave}, {
                    new: true
                  }, function(error, result) {
                        if (error) {
                            console.log("ERROR",index);
                        }
                        else{
                            console.log("Successfuly saved: ", index+1);
                        }
                        // do something with the document
                    }).clone();
                    
                } catch (error) {
                    if(error?.code === 11000){
                        console.log(error);
                        console.log("dup key");
                    }
                    else{
                        console.log("ERROR2",error.code);
                        console.log(error);
                        index = index -1
                        continue
                    }
                
                }
                
            } catch (error) {
                console.log(error.status);
                if(error?.code === 11000){
                    console.log(error);
                    console.log("dup key");
                    continue;
                }
                else{
                    if (error?.response?.status == 503 || error?.response?.status ===500)
                    {
                        console.log("Error 503", element.id,productCode);
                        continue;
                    }else{
                        console.log("ERROR3",index);
                        console.log(error);
                        index = index -1
                    }
                }
               
               

            }

        
        }
        
        
    }

}
module.exports =UpdateProduct
module.exports = fetchAllProduct