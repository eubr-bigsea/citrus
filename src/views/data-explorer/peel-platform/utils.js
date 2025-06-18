import axios from "axios";

export async function fetchPeelUrl() {

    const thornUrl = import.meta.env.VITE_THORN_URL;
    const thornPeelVariable = 'PEEL_HOST'

    try {
        const response = await axios.get(
            `${thornUrl}/configurations?query=&limit=50&ascending=1&page=1&byColumn=0&asc=true&size=50&name=&fields=name,value`
        );
        const peelUrl = response.data.data.find(obj => obj.name === thornPeelVariable)
        console.log(peelUrl.value)
        
        return peelUrl.value;
    } catch (error) {
        console.error('Erro na requisição da url do Peel no thorn:', error);
      }
}
