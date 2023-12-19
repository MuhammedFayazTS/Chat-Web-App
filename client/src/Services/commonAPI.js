import axios from "axios";

export const CommonAPI = async (httpRequest,url,reqBody,reqHeader)=>{
    const reqConfig = {
        method:httpRequest,
        url,
        data:reqBody,
        headers:reqHeader?reqHeader:{"Content-Type":"application/json"}
    }

    return await axios(reqConfig).then((result)=>{
        return result
    })
    .catch((err)=>{
        return err
    })
}