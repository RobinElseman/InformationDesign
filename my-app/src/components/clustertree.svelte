<script>
    // Import everything needed for this component
    import * as d3 from "d3"
    import { onMount } from 'svelte'
    import { fetchData } from "../lib/new"
    import Loading from "../components/loading.svelte"

    // Declare variables
    let data = []
    let isLoading = true
    const width = 1000
    const height = 60000

    // Funtion that scrolls to target
    const handleClick = (event, id) => {
        event.preventDefault()
        const targetElement = document.getElementById(id)
        targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        })
    }

    // Function that fetches data and builds cluster tree
    onMount(() => {
        fetchData()
            .then((fetchedData) => {
                data = fetchedData
                isLoading = false
                console.log(data)

                // Create SVG canvas
                const canvas = d3.select("#tree-container").append("svg")
                    .attr("width", width)
                    .attr("height", height)
                    .append("g")
                    .attr("transform", "translate(50, 50)")

                // Create D3 tree
                const tree = d3.tree()
                    .size([height - 300, width - 375])

                // Create hierarchy from data and declare the tree layout
                const root = d3.hierarchy(data)
                const treeData = tree(root)
                
                // Declare nodes and links
                const nodes = treeData.descendants()
                const links = treeData.links()

                // Create stepped link generator
                const linkGenerator = (d) => {
                    return `M${d.source.y},${d.source.x} ` +
                        `L${d.source.y},${d.target.x} ` +
                        `L${d.target.y},${d.target.x}`
                }

                // Draw the links
                canvas.selectAll(".link")
                    .data(links)
                    .enter()
                    .append("path")
                    .attr("class", "link")
                    .attr("d", linkGenerator)
                    .style("fill", "none")
                    .style("stroke", "#ccc")
                    .style("stroke-width", 1)

                // Draw the nodes
                canvas.selectAll(".node")
                    .data(nodes)
                    .enter()
                    .append("circle")
                    .attr("class", "node")
                    .attr("cx", d => d.y)
                    .attr("cy", d => d.x)
                    .attr("r", 2)
                    .style("fill", "#ccc")

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
                    .style("fill", "#333")
            })
            .catch((error) => {
                isLoading = false
                console.error("Error:", error)
            })
    })
</script>

<main>
    <div class="visInfo">
        <span class="breadcrumbs"><a href="/">Home</a> / <a href="/clustertree">Clustertree</a></span>
        <h1>Clustertree</h1>
        <p>This is a clustertree, navigate by scrolling or with the buttons.</p>
    </div>

    <!-- Loading state message -->
    {#if isLoading}
        <Loading />
    {/if}

    <!-- Tree container -->
    <div id="tree-container" class="{isLoading ? 'hidden' : ''}"></div>
    <div class="underbar">
        <a id="topscroll" href="#top">To top</a>
        <div class="buttons">
            {#each data.children as classification}
                {#each classification.children as classes}
                    <a href="#{classes.name}" on:click={(event) => handleClick(event, classes.name)}>{classes.name}</a>
                {/each}
            {/each}
        </div>
    </div>
</main>

<style>
    .underbar {
        display: flex;
        justify-content: flex-start;
        gap: 8px;
        align-items: center;
        position: fixed;
        bottom: 0;
        padding: 10px;
        width: 100%;
    }
    .underbar > a {
        text-decoration: none;
        color: orangered;
        border: 1px solid orangered;
        padding: 4px 10px;
        border-radius: 2px;
        display: block;
        width: fit-content;
        transition: ease-in-out 0.1s;     
    }
    .underbar > a:hover {
        color: white;
        border: 1px solid orangered;
        background-color: orangered;
    }
    .buttons {
        display: flex;
        gap: 8px;
    }
    .buttons a {
        text-decoration: none;
        color: black;
        background-color: rgb(235, 235, 235);
        padding: 6px 12px;
        border-radius: 2px;
        display: block;
        width: fit-content;
        transition: ease-in-out 0.1s;
    }
    .buttons a:hover {
        background-color: rgb(215, 215, 215);
    }
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
    .hidden {
        display: none;
    }
    .visInfo {
      margin: 64px;
    }
    .breadcrumbs {
      font-weight: 200;
      opacity: 0.25;
      transition: ease-in-out 0.1s;
    }
    .breadcrumbs:hover {
      opacity: 1;
    }
    .breadcrumbs a {
      text-decoration: none;
      color: black;
    }
    .breadcrumbs a:hover {
      text-decoration: underline orangered;
    }
</style>
