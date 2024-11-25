<script>
  import * as d3 from "d3";
  import { onMount } from "svelte";
  import { fetchArrabiata } from "../lib/index";
  import Loading from "../components/loading.svelte";
  import Checkboxes from "../components/checkboxes.svelte";

  let data = [];
  let isLoading = true;
  const width = 800;
  const height = 500;

  let selectedOrders = [];
  let selectedFamilies = [];

  function handleUpdateOrders(event) {
      selectedOrders = event.detail;
  }

  function handleUpdateFamilies(event) {
      selectedFamilies = event.detail;
  }

  $: if (selectedOrders.length || selectedFamilies.length) {
      fetchData();
  }

  async function fetchData() {
      isLoading = true;
      try {
          const fetchedData = await fetchArrabiata(selectedOrders, selectedFamilies);
          data = fetchedData;
          isLoading = false;
          updateTree();
      } catch (error) {
          isLoading = false;
          console.error("Error:", error);
      }
  }

  function updateTree() {
      const svg = d3.select("#tree-svg");
      svg.selectAll("*").remove(); // Clear previous content

      const root = d3.hierarchy(data);
      const nodes = root.descendants();
      const links = root.links();

      nodes[0].x = width / 2;
      nodes[0].y = height / 2;

      const simulation = d3
          .forceSimulation(nodes)
          .force("link", d3.forceLink(links).id((d) => d.id).distance(10).strength(1))
          .force("charge", d3.forceManyBody().strength(-50))
          .force("center", d3.forceCenter(width / 2, height / 2));

      const container = svg.append("g");

      const link = container
          .append("g")
          .attr("stroke", "#999")
          .attr("stroke-opacity", 0.6)
          .selectAll("line")
          .data(links)
          .join("line");

      const node = container
          .append("g")
          .selectAll("circle")
          .data(nodes)
          .join("circle")
          .attr("r", 5)
          .attr("fill", "orangered")
          .call(drag(simulation));

      node.append("title").text((d) => d.data.name);

      simulation.on("tick", () => {
          link
              .attr("x1", (d) => d.source.x)
              .attr("y1", (d) => d.source.y)
              .attr("x2", (d) => d.target.x)
              .attr("y2", (d) => d.target.y);

          node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
      });

      const zoom = d3.zoom().on("zoom", (event) => {
          container.attr("transform", event.transform);
      });

      svg.call(zoom);
  }

  function drag(simulation) {
      function dragstarted(event, d) {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
      }

      function dragged(event, d) {
          d.fx = event.x;
          d.fy = event.y;
      }

      function dragended(event, d) {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
      }

      return d3.drag().on("start", dragstarted).on("drag", dragged).on("end", dragended);
  }

  onMount(() => {
      // Create the initial empty SVG
      d3.select("#tree-container")
          .append("svg")
          .attr("id", "tree-svg")
          .attr("width", width)
          .attr("height", height);
  });
</script>

<main>
  <div class="sidebar">
      <div class="visInfo">
          <span class="breadcrumbs"><a href="/">Home</a> / <a href="">Force Simulation</a></span>
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
  .sidebar {
      width: max-content;
  }
  #tree-container {
      background-color: aqua;
      position: sticky;
      right: 0;
      top: 0;
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
