import axios from "axios";

const instance = axios.create({
    baseURL:'http://localhost:4000/api'
})
axios.interceptors.request.use(
    function(config){
        return config;
    },
    function (error){
        return Promise.reject(error)
    }
)

const images='http://localhost:4000/images'

export default{
    get:instance.get,
    post:instance.post,
    delete:instance.delete,
    images
}