export async function fetchArrabiata(selectedOrders, selectedFamilies) {
    const url = `https://api.biodiversitydata.nl/v2/taxon/query?defaultClassification.kingdom=Viruses&_size=3186`;

    try {
        const response = await fetch(url, {
            method: "GET",
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log(data);

        const tree = {
            name: "Viruses",
            children: [],
        };

        // Iterate over resultSet to build the tree
        data.resultSet.forEach((item) => {
            const classifications = [
                { key: "kingdom", name: item.item.defaultClassification.kingdom },
                { key: "order", name: item.item.defaultClassification.order },
                { key: "family", name: item.item.defaultClassification.family },
                { key: "genus", name: item.item.defaultClassification.genus }, // Genus
                { key: "specificEpithet", name: item.item.defaultClassification.specificEpithet }, // Specific epithet
            ];

            let currentLevel = tree;

            classifications.forEach((classification) => {
                if (
                    (classification.key === "order" && selectedOrders.includes(classification.name)) || 
                    (classification.key === "family" && selectedFamilies.includes(classification.name))
                ) {
                    let node = currentLevel.children.find((child) => child.name === classification.name);

                    if (!node) {
                        node = { name: classification.name, children: [] };
                        currentLevel.children.push(node);
                    }

                    currentLevel = node; // Dive deeper into the classification
                }

                // If the current classification is 'family' and is selected,
                // ensure its associated genus and specificEpithet are included in the tree
                if (classification.key === "family" && selectedFamilies.includes(classification.name)) {
                    const genusNode = currentLevel.children.find((child) => child.name === item.item.defaultClassification.genus);

                    if (!genusNode) {
                        const newGenusNode = {
                            name: item.item.defaultClassification.genus,
                            children: [],
                        };
                        currentLevel.children.push(newGenusNode);
                        currentLevel = newGenusNode; // Move to the genus level
                    } else {
                        currentLevel = genusNode;
                    }

                    const epithetNode = currentLevel.children.find((child) => child.name === item.item.defaultClassification.specificEpithet);

                    if (!epithetNode) {
                        currentLevel.children.push({
                            name: item.item.defaultClassification.specificEpithet,
                            children: [],
                        });
                    }
                }
            });

            // Add systemClassification to the last level
            if (item.item.systemClassification && item.item.systemClassification.name) {
                currentLevel.children.push({
                    name: item.item.systemClassification.name,
                    rank: item.item.systemClassification.rank,
                    size: 1, // Optional: represents the size or count of this item at this level
                });
            }
        });

        return tree; // Return the organized data structure after processing all items

    } catch (error) {
        console.error("Fetch error:", error);
        throw error;
    }
}
