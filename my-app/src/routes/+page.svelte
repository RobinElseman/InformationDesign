<script>
  // Import all needed components
  import Header from "../components/header.svelte";
</script>

<!-- Setup page header -->
<svelte:head>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Rubik:ital,wght@0,300..900;1,300..900&display=swap"
    rel="stylesheet"
  />
</svelte:head>
<header>
  <Header />
</header>
<main>
  <div class="virusBanner">
    <div class="overlayBanner"></div>
  </div>
  <div class="visInfo">
    <h1>Welcome to VirusViz!</h1>
    <p>
      Discover customizable and easy-to-understand visualizations of virus classifications. This web app is designed to help you explore how viruses are systematically categorized within the tree of life.
    </p>
    <br>
    <p>
      <strong>How are viruses classified?</strong> <br>
      Similar to other kingdoms of life, viruses are organized using a hierarchical classification system. Here’s the structure:
    </p>
    <ol>
      <li><strong>Kingdom</strong></li>
      <li><strong>Phylum</strong></li>
      <li><strong>Class</strong></li>
      <li><strong>Order</strong></li>
      <li><strong>Family</strong></li>
      <li><strong>Genus</strong></li>
      <li><strong>Species</strong></li>
    </ol>
    <p>
      Ready to explore the fascinating world of virus taxonomy? Dive into our interactive visualizations:
    </p>
    <div class="buttondiv">
      <a class="buttons" href="/clustertree">Clustertree</a>
      <a class="buttons" href="/forcesimulation">Taxonomy Analysis</a>
    </div>
  </div>
</main> 

<style>
  * {
    font-family: "Inter", sans-serif;
  }
  .buttondiv {
    display: flex;
    gap: 8px;
    margin-top: 16px;
  }
  .buttons {
    text-decoration: none;
    color: black;
    background-color: rgb(235, 235, 235);
    padding: 6px 12px;
    border-radius: 2px;
    display: block;
    width: fit-content;
    transition: ease-in-out 0.1s;
  }
  .buttons:hover {
    background-color: rgb(215, 215, 215);
  }
  main {
    display: flex;
    flex-direction: row-reverse;
  }
  .visInfo {
    margin: 64px;
    max-width: 650px;
  }
  .overlayBanner {
    background-color: rgba(255, 68, 0, 0.354);
    height: calc(100vh - 38.5px);
    backdrop-filter: sepia(1);
    flex: auto;
    width: 100%;
  }
  .virusBanner {
    height: calc(100vh - 38.5px);
    width: 100%;
    background-image: url(https://plus.unsplash.com/premium_photo-1674641195838-59ad13f8cc55?q=80&w=2980&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D);
    background-size: cover;
    background-position: center top;
  }
  ol {
    margin: .5em 2em;
  }
</style>
