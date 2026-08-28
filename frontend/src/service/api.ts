import axios from 'axios'



const api = axios.create( { 
    // baseURL: 'http://localhost:3333',
      baseURL: 'https://blanchedalmond-lark-299301.hostingersite.com/',
    headers: {
        'Content-Type': 'application/json'
    }
 } );

 export default api;