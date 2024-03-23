<!-- https://codepen.io/nabilkaz/pen/xvKzXZ -->
<script>
	import Dialog, { Content } from "@smui/dialog";
	import IconButton, { Icon } from "@smui/icon-button";
  import { mdiClose } from '@mdi/js';

  export let startDate = '01 Jan 1970';
  export let transportation = '✈️';
  export let carrier = '';
  export let destination = 'New York';
  export let desTravelCode = 'JFK';
  export let linkRec = '';

  let open = false;

</script>

<button on:click={() => (open = true)}>
  <article>
    <div class="top">
      <p class='start'>Start of Travel:</p>
      <h2>{startDate}</h2>
    </div>
    <div class="block">
      <div class="punch-hole"></div>
    </div>

    <div class="middle">
      <p>To:</p> 
      <div class="IATA">{desTravelCode}</div>
      <h2><div class="destination">{destination}</div></h2>
    </div>

    <div class="bottom">
        <!-- make larger with a circle around it -->
      <div>
        <p>{transportation}</p>
      </div>
      <div class="carrier">
        <!-- uniform three letter -->
        <p>{carrier}</p>
      </div>
    </div>
      
  
  </article>
</button>
<Dialog bind:open sheet aria-describedby="sheet-content">
  <Content id="sheet-content">
      <IconButton action="close" class="material-icons">
          <Icon tag="svg" viewBox="0 0 24 24">
              <path fill="currentColor" d={mdiClose} />
          </Icon>
      </IconButton>
      <div>
        <h1>{destination}</h1>
        {#if linkRec}
          <p><a href={linkRec} target="_blank">Teon's Nomadic Note: {destination}</a></p>
        {/if}
      </div>
  </Content>
</Dialog>


<style>
    @import url('https://fonts.googleapis.com/css?family=Squada+One&display=swap');

    /* .block {
      display: flex;
      justify-content: center;
      align-items: center;
    } */

    article {
    width: 150px;
    height: 300px;
    margin: 1rem auto;
    /* display: flex; */
    display: block;
    justify-content: space-between;
    flex-flow: column;
    background-color: #DBD2B2;
    clip-path: polygon(15% 0, 85% 0, 100% 10%, 100% 100%, 0 100%, 0 10%);
    padding: 1rem 20px;
    }

    p {
      color: #343E6F;
    }
    .top p {
    text-transform: uppercase;
    font-size: .5rem;
    text-align: center;
    align-self: center;
    font-family: 'Open Sans', sans-serif;
    color: #343E6F;
    /* margin-top: 20px; */
    margin-bottom: 1rem;
    }

    .middle p {
      text-align: left;
      color: #343E6F;
      font-family: 'Open Sans', sans-serif;
      font-size: .75rem;
    }

    .punch-hole {
    height: 40px;
    width: 40px;
    background-color: #906B39;
    border-radius: 100px;
    display: flex;
    box-shadow: 2px 2px 2px rgba(0,0,0, .85);
    margin: auto;
    }

    .punch-hole:before {
    content: "";
    width: 20px;
    height: 20px;
    background-color: #062B60;
    border-radius: 100px;
    display: inline-block;
    margin: auto;
    box-shadow: 2px 2px 4px rgba(255, 255, 255, .5);
    }


    h2 {
    margin-top: 0px;
    font-family: 'Squada One', cursive;
    text-transform: uppercase;
    letter-spacing: 2px;
    color: #343E6F;
    width: 100%;
    font-size: 1rem;
    text-align: center;
    }

    .IATA {
    margin-top: -10px;
    font-family: 'Squada One', cursive;
    text-transform: uppercase;
    letter-spacing: -1px;
    color: #343E6F;
    width: 100%;
    font-size: 2.5rem;
    text-align: center;
    }

    .carrier {
      font-family: 'Squada One', cursive;
    }

    button {
      background-color: rgba(0,0,0,0);
      border: 0; 
    }

    button:hover {
      box-shadow: 0 12px 16px 0 rgba(0,0,0,0.24), 0 17px 50px 0 rgba(0,0,0,0.19);
    }

</style>