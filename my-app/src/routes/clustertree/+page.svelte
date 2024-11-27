<script>
  // Import all needed components
  import ClusterTree from "../../components/clustertree.svelte";
  import Header from "../../components/header.svelte";
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
  <ClusterTree />
</main> 
  
<style>
  * {
    font-family: "Inter", sans-serif;
  }
</style>
  