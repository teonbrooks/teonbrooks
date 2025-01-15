<script>
    /**
     * @typedef {Object} Props
     * @property {any} name
     * @property {boolean} [used]
     */

    /** @type {Props} */
    let { name, used = $bindable(true) } = $props();

</script>

<label>
    <input type="checkbox" bind:checked={used}>
    <span class:used={used}>{name}</span> 
</label>

<style>
    .used {
    text-decoration: line-through;
    color: gray;
    }
</style>
