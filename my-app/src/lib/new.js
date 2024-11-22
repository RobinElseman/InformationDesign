export async function fetchPhyla() {
    const url = 'https://api.biodiversitydata.nl/v2/taxon/query?defaultClassification.kingdom=Viruses&_size=3100';

    try {
        const response = await fetch(url, {
            method: "GET",
        });
        
        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);ß
        }
        
        const data = await response.json();
        console.log(data)
    } catch (error) {
        console.error("Fetch error:", error);
        throw error;
    }
}