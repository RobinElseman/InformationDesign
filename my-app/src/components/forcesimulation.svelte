<script>
  // Import everything needed for this component
  import * as d3 from "d3"
  import { onMount } from "svelte"
  import { fetchAllData } from "../lib/index"
  import Checkboxes from "../components/checkboxes.svelte"
  import WindowHeight from "../lib/windowheight"
  
  // Declare variables
  let data = []
  let isLoading = true
  const width = 800

  let selectedOrders = []
  let selectedFamilies = []

  // Window height responsiveness
  let windowHeight
  windowHeight = WindowHeight()
  const height = windowHeight

  // Checkbox handlers
  function handleUpdateOrders(event) {
      selectedOrders = event.detail
  }

  function handleUpdateFamilies(event) {
      selectedFamilies = event.detail
  }

  // Fetches data when something is selected
  $: if (selectedOrders.length || selectedFamilies.length) {
      fetchData()
  }

  // Function to fetch data from JS file
  async function fetchData() {
      isLoading = true
      try {
          const fetchedData = await fetchAllData(selectedOrders, selectedFamilies)
          data = fetchedData
          isLoading = false
          updateTree()
      } catch (error) {
          isLoading = false
          console.error("Error:", error)
      }
  }

  // Function to make Force simulation
  function updateTree() {
      const svg = d3.select("#tree-svg")
      svg.selectAll("*").remove() // Clear previous content

      // Tooltip setup
      const tooltip = d3
        .select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("visibility", "hidden")
        .style("background-color", "rgba(255, 69, 0, .8)")
        .style("color", "#fff")
        .style("padding", "8px")
        .style("border-radius", "2px")
        .style("font-size", "12px")
        .style("pointer-events", "none")

      // Generate hierarchy and links
      const root = d3.hierarchy(data)
      const nodes = root.descendants()
      const links = root.links()

      // Location of the root node
      nodes[0].x = width / 2
      nodes[0].y = height / 2

      // Create the force simulation
      const simulation = d3
          .forceSimulation(nodes)
          .force("link", d3.forceLink(links).id((d) => d.id).distance(10).strength(1))
          .force("charge", d3.forceManyBody().strength(-50))
          .force("center", d3.forceCenter(width / 2, height / 2))

      // Generate a g in the svg group
      const container = svg.append("g")

      // Create and style lines for the graph links, binding them to the link data
      const link = container
          .append("g")
          .attr("stroke", "#999")
          .attr("stroke-opacity", 0.6)
          .selectAll("line")
          .data(links)
          .join("line")

      // Create and style nodes, bind data, enable tooltips and make them draggable
      const node = container
          .append("g")
          .selectAll("circle")
          .data(nodes)
          .join("circle")
          .attr("r", 5)
          .attr("fill", "orangered")
          .on("mouseover", (event, d) => {
            tooltip
                .style("visibility", "visible")
                .html(`<strong>${d.data.name}</strong>`)
          })
          .on("mousemove", (event) => {
              tooltip
                  .style("top", `${event.pageY + 10}px`)
                  .style("left", `${event.pageX + 10}px`)
          })
          .on("mouseout", () => {
              tooltip.style("visibility", "hidden")
          })
          .call(drag(simulation))

      // Update link and node positions on each simulation tick
      simulation.on("tick", () => {
          link
              .attr("x1", (d) => d.source.x)
              .attr("y1", (d) => d.source.y)
              .attr("x2", (d) => d.target.x)
              .attr("y2", (d) => d.target.y)

          node.attr("cx", (d) => d.x).attr("cy", (d) => d.y)
      });

      // Enable zoom and pan functionality
      const zoom = d3.zoom().on("zoom", (event) => {
          container.attr("transform", event.transform)
      });

      // Give the svg the zoom functionality
      svg.call(zoom)
  }

  // Define drag behavior for nodes, including interaction with the simulation
  function drag(simulation) {
    // Called when dragging starts; activates the simulation if it's not active.
    function dragstarted(event, d) {
        if (!event.active) simulation.alphaTarget(0.3).restart()
        d.fx = d.x
        d.fy = d.y
    }

    // Called while dragging; updates the node's fixed position
    function dragged(event, d) {
        d.fx = event.x
        d.fy = event.y
    }

    // Called when dragging ends; releases the fixed position and stops simulation if idle
    function dragended(event, d) {
        if (!event.active) simulation.alphaTarget(0)
        d.fx = null
        d.fy = null
    }

    // Return the drag behavior with start, drag, and end-events
    return d3.drag().on("start", dragstarted).on("drag", dragged).on("end", dragended)
  }
  // Create and append an SVG element to the tree container
  onMount(() => {
      d3.select("#tree-container")
          .append("svg")
          .attr("id", "tree-svg")
          .attr("width", width)
          .attr("height", height)
  })
</script>

<main>
  <div class="sidebar">
      <div class="visInfo">
          <span class="breadcrumbs"><a href="/">Home</a> / <a href="/forcesimulation">Taxonomy Analysis</a></span>
          <h1>Taxonomy Analysis</h1>
          <p>Hover above nodes to see the names, you can also drag them around.</p>
      </div>
      <Checkboxes
          on:updateOrders={handleUpdateOrders}
          on:updateFamilies={handleUpdateFamilies}
      />
  </div>
  <div id="tree-container"></div>
</main>

<style>
  main {
    display: flex;
    justify-content: space-between;
  }
  .sidebar {
      width: max-content;
  }
  #tree-container {
      border-left: 1px solid rgb(235, 235, 235);
      position: sticky;
      right: 0;
      top: 63.5px;
      display: block;
      height: 100vh;
      box-shadow: inset 10px 10px 50px rgb(235, 235, 235);
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
