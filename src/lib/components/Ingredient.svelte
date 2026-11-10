<script>
    /**
     * @typedef {Object} Props
     * @property {any} name
     * @property {boolean} [used]
     */

    /** @type {Props} */
    let { name, used = $bindable(true) } = $props();

</script>

<label class="inline-flex cursor-pointer items-center gap-2 font-bold">
    <input type="checkbox" class="checkbox checkbox-xs" bind:checked={used}>
    <span class:used={used}>{name}</span> 
</label>

<style>
    .used {
    text-decoration: line-through;
    color: gray;
    }
</style>
