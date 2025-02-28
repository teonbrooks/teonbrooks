<!-- @migration-task Error while migrating Svelte code: Event attribute must be a JavaScript expression, not a string
https://svelte.dev/e/attribute_invalid_event_handler -->
<script>
  import { tagsEmoji } from "$lib/config";
  
  let { tag } = $props();
  let formTags = ['life', 'travel', 'tech'];

  function myFunction() {
    window.open('https://buttondown.com/teon', 'popupwindow')
  }

</script>

<div class="align">
  <form
    action="https://buttondown.com/api/emails/embed-subscribe/teon"
    method="post"
    target="popupwindow"
    onsubmit={myFunction}
    class="embeddable-buttondown-form"
  >
    <p>
      <label for="first_name">First Name</label>
      <input type="text" name="first_name" id="first_name" />
      <label for="last_name">Last Name</label>
      <input type="text" name="last_name" id="last_name" />
    </p>
    <label for="bd-email">Enter your email</label>
    <input type="email" name="email" id="bd-email" />
    <p>
      {#each formTags as formTag}
        {#if tag == formTag}
          <input type="checkbox" id="{formTag}" name="tag" value={formTag} checked>
        {:else}
          <input type="checkbox" id="{formTag}" name="tag" value={formTag}>
        {/if}
        <label for={formTag}>{`{${tagsEmoji[formTag]} ${formTag} edition}`}</label><br>
      {/each}
    </p>
    <p>
      <a href="https://buttondown.com/refer/teon" target="_blank">Powered by Buttondown.</a>
    </p>
  </form>
</div>

<style>
  .align {
    display: flex;
		align-items: center;
		justify-content: center;
  }

  form {
    width: 600px;
    background-color: white;
    padding: 25px;
  }
</style>