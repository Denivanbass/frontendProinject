import axios from 'axios'



const api = axios.create( { 
    // baseURL: 'http://localhost:3333',
      baseURL: 'https://mediumorchid-antelope-605245.hostingersite.com/',
    headers: {
        'Content-Type': 'application/json'
    }
 } );

 export default api;