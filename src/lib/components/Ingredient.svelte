<script>
    export let name;
    export let used = true;

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
