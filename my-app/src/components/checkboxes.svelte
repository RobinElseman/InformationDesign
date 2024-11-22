<script>
    import * as d3 from "d3";
    import { onMount } from 'svelte';
    import { fetchButtons } from "../lib/checkboxes";
    import Loading from "../components/loading.svelte";
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    let data = [];
    let orders = [];
    let familiesForSelectedOrders = [];
    let selectedOrders = [];
    let selectedFamilies = [];
    let errorMessage = null;

    onMount(() => {
        fetchButtons()
            .then((fetchedData) => {
                data = fetchedData;
                const allOrders = data.resultSet.map(item => item.item.defaultClassification.order);
                orders = [...new Set(allOrders)].sort();
            })
            .catch((error) => {
                console.error("Error:", error);
                errorMessage = "Failed to load data. Please try again.";
            });
    });

    function handleCheckboxChangeOrders(event) {
        const { checked, value } = event.target;
        const orderValue = value;

        if (checked) {
            selectedOrders = [...selectedOrders, orderValue];
        } else {
            selectedOrders = selectedOrders.filter(item => item !== orderValue);
        }

        dispatch('updateOrders', selectedOrders);
        findMatchingFamilies();
    }

    function removeFamiliesOfUnselectedOrder(order) {
        const familiesToRemove = data.resultSet
            .filter(item => item.item.defaultClassification.order === order)
            .map(item => item.item.defaultClassification.family);

        selectedFamilies = selectedFamilies.filter(family => !familiesToRemove.includes(family));
        dispatch('updateFamilies', selectedFamilies);
    }

    function findMatchingFamilies() {
        const filteredItems = data.resultSet.filter(item =>
            selectedOrders.includes(item.item.defaultClassification.order)
        );

        const families = filteredItems.map(item => item.item.defaultClassification.family);
        familiesForSelectedOrders = [...new Set(families)].sort();

        selectedFamilies = selectedFamilies.filter(family => familiesForSelectedOrders.includes(family));
        dispatch('updateFamilies', selectedFamilies);
    }

    function handleCheckboxChangeFamily(event) {
        const { checked, value } = event.target;
        const familyValue = value;

        if (checked) {
            selectedFamilies = [...selectedFamilies, familyValue];
        } else {
            selectedFamilies = selectedFamilies.filter(item => item !== familyValue);
        }

        dispatch('updateFamilies', selectedFamilies);
    }
</script>

<main>
    <div class="categoryWrapper">
        <section>
            <h3>Orders {#if orders.length > 0}<span>{selectedOrders.length}/{orders.length}</span>{/if}</h3>
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
            {:else}
                <Loading />
            {/if}
        </section>
        <section>
            <h3>Families {#if familiesForSelectedOrders.length > 0}<span>{selectedFamilies.length}/{familiesForSelectedOrders.length}</span>{/if}</h3>
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
        gap: 64px;
        margin-left: 64px;
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
    label {
        display: block;
        width: fit-content;
    }
</style>
