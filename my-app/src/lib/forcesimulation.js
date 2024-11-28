// Fetch and format the data from the Naturalis API
export async function fetchAllData(selectedOrders, selectedFamilies) {
    const url = `https://api.biodiversitydata.nl/v2/taxon/query?defaultClassification.kingdom=Viruses&_size=10000`

    try {
        const response = await fetch(url, {
            method: "GET",
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`)
        }

        const data = await response.json()
        console.log(data)

        const tree = {
            name: "Viruses",
            children: [],
        }

        // Iterate over resultSet to build the tree
        data.resultSet.forEach((item) => {
            const classifications = [
                { key: "kingdom", name: item.item.defaultClassification.kingdom },
                { key: "order", name: item.item.defaultClassification.order },
                { key: "family", name: item.item.defaultClassification.family },
                { key: "genus", name: item.item.defaultClassification.genus },
                { key: "specificEpithet", name: item.item.defaultClassification.specificEpithet },
            ]

        let currentLevel = tree;

        // Setup up tree structure based of selected classifications
        classifications.forEach((classification) => {
            if (
                (classification.key === "order" && selectedOrders.includes(classification.name)) || 
                (classification.key === "family" && selectedFamilies.includes(classification.name))
            ) {

            let node = currentLevel.children.find((child) => child.name === classification.name)

            if (!node) {
                node = { name: classification.name, children: [] }
                currentLevel.children.push(node)
            }

            currentLevel = node

        }
        
        // Create nodes under the right order
        if (classification.key === "family" && selectedFamilies.includes(classification.name)) {
            const genusNode = currentLevel.children.find((child) => child.name === item.item.defaultClassification.genus)

            if (!genusNode) {
                const newGenusNode = {
                    name: item.item.defaultClassification.genus,
                    children: [],
                }
                currentLevel.children.push(newGenusNode)
                currentLevel = newGenusNode
            } else {
                currentLevel = genusNode
            }

            const epithetNode = currentLevel.children.find((child) => child.name === item.item.defaultClassification.specificEpithet)
                if (!epithetNode) {
                    currentLevel.children.push({
                        name: item.item.defaultClassification.specificEpithet,
                        children: [],
                    })
                }
            }
        })

        // Push into the tree structure
        if (item.item.systemClassification && item.item.systemClassification.name) {
            currentLevel.children.push({
                name: item.item.systemClassification.name,
                rank: item.item.systemClassification.rank,
                size: 1
            })
        }
    })

    return tree

    } catch (error) {
        console.error("Fetch error:", error)
        throw error
    }
}
