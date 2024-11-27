// Fetch and export data from Naturalis API
export async function fetchButtons() {
    const url = `https://api.biodiversitydata.nl/v2/taxon/query?defaultClassification.kingdom=Viruses&_size=3186`;

    try {
        const response = await fetch(url, {
            method: "GET",
        });
        
        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json()
        console.log(data);

        return data;

    } catch (error) {
        console.error("Fetch error:", error);
        throw error;
    }
}