<script>
      import Loading from "../components/loading.svelte";
      import Header from "../components/header.svelte";
</script>

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
    <div class="visInfo">
      <h1>Welcome to VirusViz!</h1>
      <p>
        Discover customizable and easy-to-understand visualizations of virus classifications. This web app is designed to help you explore how organisms, including viruses, are systematically categorized within the tree of life.
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
      <a href="/clustertree">clustertree</a>
      <a href="/forcesimulation">forcesimulation</a>
    </div>
  </main> 

<style>
  * {
    font-family: "Inter", sans-serif;
  }
  .visInfo {
    margin: 64px;
    max-width: 650px;
  }
</style>
