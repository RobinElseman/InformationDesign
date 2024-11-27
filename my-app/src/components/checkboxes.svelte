<script>
    // Import everything needed for this component
    import { onMount } from 'svelte'
    import { fetchButtons } from "../lib/checkboxes"
    import Loading from "../components/loading.svelte"
    import { createEventDispatcher } from 'svelte'

    // Declare variables
    const dispatch = createEventDispatcher()
    let data = []
    let orders = []
    let familiesForSelectedOrders = []
    let selectedOrders = []
    let selectedFamilies = []
    let errorMessage = null

    // Event listener for fetching and sorting data
    onMount(() => {
        fetchButtons()
            .then((fetchedData) => {
                data = fetchedData
                const allOrders = data.resultSet.map(item => item.item.defaultClassification.order)
                orders = [...new Set(allOrders)].sort()
            })
            .catch((error) => {
                console.error("Error:", error)
                errorMessage = "Failed to load data. Please try again."
            })
    })

    // Function that manages what orders are filtered
    function handleCheckboxChangeOrders(event) {
        const { checked, value } = event.target
        const orderValue = value

        if (checked) {
            selectedOrders = [...selectedOrders, orderValue]
        } else {
            selectedOrders = selectedOrders.filter(item => item !== orderValue)
        }
        dispatch('updateOrders', selectedOrders);
        findMatchingFamilies();
    }

    // Function that removes families of unselected orders
    function removeFamiliesOfUnselectedOrder(order) {
        const familiesToRemove = data.resultSet
            .filter(item => item.item.defaultClassification.order === order)
            .map(item => item.item.defaultClassification.family)
        selectedFamilies = selectedFamilies.filter(family => !familiesToRemove.includes(family))
        dispatch('updateFamilies', selectedFamilies)
    }

    // Functino that finds families of selected orders
    function findMatchingFamilies() {
        const filteredItems = data.resultSet.filter(item =>
            selectedOrders.includes(item.item.defaultClassification.order)
        )
        const families = filteredItems.map(item => item.item.defaultClassification.family)
        familiesForSelectedOrders = [...new Set(families)].sort()
        selectedFamilies = selectedFamilies.filter(family => familiesForSelectedOrders.includes(family))
        dispatch('updateFamilies', selectedFamilies)
    }

    // Function that manages what families are filtered
    function handleCheckboxChangeFamily(event) {
        const { checked, value } = event.target
        const familyValue = value
        if (checked) {
            selectedFamilies = [...selectedFamilies, familyValue]
        } else {
            selectedFamilies = selectedFamilies.filter(item => item !== familyValue)
        }
        dispatch('updateFamilies', selectedFamilies)
    }
</script>

<main>
    <div class="categoryWrapper">
        <section>
            <!-- This displays the amount of selected orders from all orders, if orders have loaded. -->
            <h3>Orders {#if orders.length > 0}<span>{selectedOrders.length}/{orders.length}</span>{/if}</h3>
            <!-- If orders have loaded, there is a checkbox generated for each one, which triggers a function. -->
            {#if orders.length > 0}
                {#each orders as order, index}
                    <div class="checkboxWrapper">
                        <input 
                        type="checkbox" 
                        id="order-{index}" 
                        value="{order}" 
                        on:change={handleCheckboxChangeOrders}>
                        <label for="order-{index}">{order}</label>
                    </div>
                {/each}
            <!-- If the orders array is empty, a loading animation will be shown. -->
            {:else}
                <Loading />
            {/if}
        </section>
        <section>
            <!-- This displays the amount of selected families from all families, if an order has been chosen. -->
            <h3>Families {#if familiesForSelectedOrders.length > 0}<span>{selectedFamilies.length}/{familiesForSelectedOrders.length}</span>{/if}</h3>
            <!-- If there is an active family, there is a checkbox generated for each one, which triggers a function. -->
            {#if familiesForSelectedOrders.length > 0}
                {#each familiesForSelectedOrders as family, index}
                    <div class="checkboxWrapper">
                        <input 
                            type="checkbox" 
                            id="family-{index}" 
                            value="{family}" 
                            checked={selectedFamilies.includes(family)}
                            on:change={handleCheckboxChangeFamily}>
                        <label for="family-{index}">{family}</label>
                    </div>
                {/each}
            <!-- If there are no families selected, this is communicated to the user. -->
            {:else}
                <p class="noSelection">Select at least 1 order to select a family</p>
            {/if}
        </section>
    </div>
</main>
<style>
    * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
    }
    h3 {
        margin-bottom: .5em;
    }
    .noSelection {
        font-weight: 200;
        color: rgb(181, 181, 181);
    }
    .categoryWrapper {
        display: flex;
        flex-direction: column;
        gap: 64px;
        margin-left: 64px;
        margin-bottom: 64px;
    }
    span {
        opacity: .1;
    }
    .checkboxWrapper {
        display: flex;
        gap: .3em;
        margin-bottom: .5em;
    }
    input[type="checkbox"] {
        accent-color: orangered;
        display: block;
    }
    input[type="checkbox"]:checked + label {
        color: orangered;
        font-weight: 600;
    }
    label {
        display: block;
        width: fit-content;
        transition: ease-in-out .1s;
    }
    label:hover {
        font-weight: 600;
    }
</style>
