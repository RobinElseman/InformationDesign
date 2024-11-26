export async function fetchArrabiata() {
    const url = `https://api.biodiversitydata.nl/v2/taxon/query?defaultClassification.kingdom=Viruses&_size=10000`;

    try {
        const response = await fetch(url, { method: "GET" });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log(data);

        // Initialize the root tree node
        const tree = {
            name: "Viruses",
            children: [],
        };

        // Iterate over the results to build the tree structure
        data.resultSet.forEach((item) => {
            const classifications = [
                { key: "kingdom", name: item.item.defaultClassification.kingdom },
                { key: "order", name: item.item.defaultClassification.order },
                { key: "family", name: item.item.defaultClassification.family },
                { key: "genus", name: item.item.defaultClassification.genus }, // Genus
                { key: "specificEpithet", name: item.item.defaultClassification.specificEpithet }, // Specific epithet
            ];

            let currentLevel = tree;

            // Process each classification level
            classifications.forEach((classification) => {
                let node = currentLevel.children.find((child) => child.name === classification.name);

                if (!node) {
                    node = { name: classification.name, children: [] };
                    currentLevel.children.push(node);
                }

                currentLevel = node; // Dive deeper into the classification
            });

            // Add systemClassification information
            if (item.item.systemClassification && item.item.systemClassification.name) {
                currentLevel.children.push({
                    name: item.item.systemClassification.name,
                    rank: item.item.systemClassification.rank,
                    size: 1, // Optional size or count for this classification level
                });
            }
        });

        return tree; // Return the final tree structure

    } catch (error) {
        console.error("Fetch error:", error);
        throw error; // Rethrow the error to be handled by the caller
    }
}
