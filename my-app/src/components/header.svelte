<div class="wrapper">
  <a href="/">
    <h1>VirusViz</h1>
  </a>
  <div>
    <a class="backButton" href="/">Home</a>
    <a class="backButton" href="/clustertree">Clustertree</a>
    <a class="backButton" href="/forcesimulation">Taxonomy Analysis</a>
  </div>
</div>

<style>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  a {
    text-decoration: none;
    color: black;
  }
  .wrapper > a:hover {
    text-decoration: underline;
    text-decoration-color: orangered;
  }
  .wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid rgb(235, 235, 235);
    padding: 12px 32px;
  }
  div div {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .backButton {
    text-decoration: none;
    color: black;
    background-color: rgb(235, 235, 235);
    padding: 6px 12px;
    border-radius: 2px;
    display: block;
    width: fit-content;
    transition: ease-in-out 0.1s;
  }
  .backButton:hover {
    background-color: rgb(215, 215, 215);
  }
</style>
