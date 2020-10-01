const dbError=(res, err) =>{
    if(err){
        return res.json({
            data : null,
            message : "Error in executing db query",
            error : err
        });    
    }
    
};

const invalidPayloadError = (res, err) => {
    if(err){
        return res.json({
        data : null,
        message : "Invalid Payload",
        error : err
        });
    }
    
        
};

const sendResponse =(res, data) => {
    return  res.json({
        success: true,
        data : data,
        error :null
    });    

};



module.exports = {
    dbError,
    invalidPayloadError,
    sendResponse,
};