( (requestHelper) => { 
    const HTTPRequest = require("request");
    const axios = require("axios");

  
    requestHelper.makeRestApiCallRequest = async (url, method, body, headers) => {

        const options = {
            url: url,
            method: method, 
            form: body,
            headers: headers
          } 

          return new Promise((resolve, reject) => {
            HTTPRequest(options, (error, response, body) => {
              if (error) return reject(error);
              return resolve(response);
            });
          });
    };

    requestHelper.makeRestApiCallAxios = async (url, method, body, headers) => {
      try{
        const options = {
          url: url,
          method: method,
          data: body,
          headers : headers
        } 

        const resp = await axios(options);
        console.log(resp);
        // return new Promise ( (resolve, reject) => {
        //   axios(options, (error, response, body) => {
        //     if (error) return reject (error)
        //     return resolve (response)
        //   })
        // })
        return resp;
    }catch(error){
      throw error;
    }
  }

})(module.exports);