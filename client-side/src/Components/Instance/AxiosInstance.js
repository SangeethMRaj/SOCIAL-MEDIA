import axios from "axios";

const instance = axios.create({
    baseURL:'https://xplre.online/api'
})
axios.interceptors.request.use(
    function(config){
        return config;
    },
    function (error){
        return Promise.reject(error)
    }
)

const images='https://xplre.online/images'

export default{
    get:instance.get,
    post:instance.post,
    delete:instance.delete,
    images
}