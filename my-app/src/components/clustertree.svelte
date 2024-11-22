<script>
    import * as d3 from "d3";
    import { onMount } from 'svelte';
    import { fetchArrabiata } from "../lib/index";
    import Loading from "../components/loading.svelte";

    let data = [];
    let isLoading = true; // Loading state
    const width = 1000;
    const height = 60000;

    onMount(() => {
        fetchArrabiata()
            .then((fetchedData) => {
                data = fetchedData; // Zet data reactief
                isLoading = false; // Disable loading state
                console.log(data);

                const canvas = d3.select("#tree-container").append("svg")
                    .attr("width", width)
                    .attr("height", height)
                    .append("g")
                    .attr("transform", "translate(50, 50)");

                const tree = d3.tree()
                    .size([height - 300, width - 375]);

                const root = d3.hierarchy(data);
                const treeData = tree(root);

                const nodes = treeData.descendants();
                const links = treeData.links();

                // Create stepped link generator
                const linkGenerator = (d) => {
                    return `M${d.source.y},${d.source.x} ` +
                        `L${d.source.y},${d.target.x} ` + // Vertical line from source to target
                        `L${d.target.y},${d.target.x}`;  // Horizontal line to target
                };

                // Draw the links
                canvas.selectAll(".link")
                    .data(links)
                    .enter()
                    .append("path")
                    .attr("class", "link")
                    .attr("d", linkGenerator)
                    .style("fill", "none")
                    .style("stroke", "#ccc")
                    .style("stroke-width", 1);

                // Draw the nodes
                canvas.selectAll(".node")
                    .data(nodes)
                    .enter()
                    .append("circle")
                    .attr("class", "node")
                    .attr("cx", d => d.y)
                    .attr("cy", d => d.x)
                    .attr("r", 2)
                    .style("fill", "#ccc");

                // Draw the labels
                canvas.selectAll(".label")
                    .data(nodes)
                    .enter()
                    .append("text")
                    .attr("class", "label")
                    .attr("x", d => d.y + 10)
                    .attr("y", d => d.x)
                    .text(d => d.data.name)
                    .attr("id", d => d.data.name)
                    .style("font-size", "12px")
                    .style("fill", "#333");
            })
            .catch((error) => {
                isLoading = false; // Disable loading state in case of error
                console.error("Error:", error);
            });
    });
</script>

<main>
    <h1>Cluster Tree</h1>
    <p>Look around and discover all families and viruses.</p>
    <a href="/">back home</a>

    <!-- Loading state message -->
    {#if isLoading}
        <Loading />
    {/if}

    <!-- Tree container -->
    <div id="tree-container" class="{isLoading ? 'hidden' : ''}"></div>
</main>

<style>
    .link {
        stroke: #ccc;
        stroke-width: 2;
    }

    .node {
        fill: steelblue;
        stroke: #fff;
        stroke-width: 1.5px;
    }

    .label {
        font-size: 12px;
        fill: #333;
    }

    /* Hide the tree container until data is loaded */
    .hidden {
        display: none;
    }
</style>
