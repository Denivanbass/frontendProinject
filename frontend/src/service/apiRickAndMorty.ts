import axios from "axios"


const apiRickAndMorty = axios.create({
    baseURL: 'https://rickandmortyapi.com/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

export default apiRickAndMorty;