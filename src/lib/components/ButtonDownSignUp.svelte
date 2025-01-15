<script>
  export let category;
  let formCategories = {
    'life': '{👨🏾 life edition}',
    'travel': '{🎒 travel edition}',
    'tech': '{👨🏾‍💻 tech edition}'
  }
</script>

<form
  action="https://buttondown.com/api/emails/embed-subscribe/teon"
  method="post"
  target="popupwindow"
  onsubmit="window.open('https://buttondown.com/teon', 'popupwindow')"
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
    <!-- TODO: add binding to have tags default on on categoy page -->
    {#each Object.entries(formCategories) as [formCategory, label]}
      {#if category == formCategory}
        <input type="checkbox" id="{formCategory}" name="tag" value={formCategory} checked>
      {:else}
        <input type="checkbox" id="{formCategory}" name="tag" value={formCategory}>
      {/if}
      <label for={formCategory}>{label}</label><br>
    {/each}
  </p>
  <p>
    <a href="https://buttondown.com/refer/teon" target="_blank">Powered by Buttondown.</a>
  </p>
</form>

<style>
  form {
    background-color: white;
    padding: 25px;
  }
</style>