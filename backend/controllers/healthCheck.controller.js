import { ApiResponse } from "../utils/ApiResponse.js"

const healthCheck = async(req,res)=>{
    try {
        res.status(200).json(ApiResponse(200,"Everything is Working Fine"))
    } catch (error) {
        console.log("Things not working properly | Error: ",error)
    }

}
export {healthCheck}