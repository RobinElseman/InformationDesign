<script>
  import ForceSimulation from "../../components/forcesimulation.svelte";
  import Header from "../../components/header.svelte";
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
    <ForceSimulation />
  </main>

<style>
  * {
    font-family: "Inter", sans-serif;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  header {
    position: sticky;
    top: 0;
    z-index: 99999;
  }
</style>
