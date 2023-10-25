<!-- https://codepen.io/nabilkaz/pen/xvKzXZ -->
<script>
    export let startDate = '01 Jan 1970';
    // export let airlineLogoURL = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/25555/turk.png';
    export let transportation = '✈️';
    export let carrier = '  ';
    export let destination = 'New York';
    export let desTravelCode = 'JFK';

</script>


<article>
  <div class="top">
    <p>Start of Travel:</p>
    <h2>{startDate}</h2>
    <div class="row">
      <div class="block">
        <!-- make larger with a circle around it -->
        <p>{transportation}</p>
      </div>
      <div class="block">
        <div class="punch-hole">
        </div>
      </div>
      <div class="block">
        <!-- uniform three letter -->
        <p>{carrier}</p>
      </div>
    </div>
    </div>
  <!-- <div class="main"> -->
    <!-- <h3>Baggage tag</h3> -->
    <!-- <div class="row center"> -->
      <!-- <div class="box marks">AA</div> -->
      <!-- <div class="box"></div> -->
    <!-- </div> -->
    <div class="row">
      <!-- <h3>To:</h3> -->
      <div class="IATA">{desTravelCode}</div>
      <h2>{destination}</h2>
    </div>
    <!-- <div class="row">
      <div class="box"><h3>Flight no</h3></div>
      <div class="box center"><span class="numbers">N<sup>o</sup> {flightNo}</span></div>
    </div>
    <div class="row">
      <div class="box"><h3>From</h3></div>
      <div class="box">
          <h4>{origin}</h4>
          <p>{originIATA}</p>
      </div>
    </div>
  </div> -->
</article>


<style>
    @import url('https://fonts.googleapis.com/css?family=Squada+One&display=swap');

    *, *:after, *:before {
    box-sizing: inherit;
    }

    /* body {
    width: 720px; 
    margin: 0 auto;
    font-family: sans-serif;
    font-size: 16px;
    background-color: #062B60;
    } */

    .block {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    article {
    width: 150px;
    height: 200px;
    margin: 1rem auto;
    display: flex;
    flex-flow: column;
    background-color: #DBD2B2;
    clip-path: polygon(15% 0, 85% 0, 100% 10%, 100% 100%, 0 100%, 0 10%);
    padding: 1rem 20px;
    }

    .row {
    display: flex;
    align-items: center;
    position: relative;
    justify-content: center;
    margin-top: -10px;
    }

    .top {
    /* margin-bottom: 2rem; */
    /* margin-top: 1rem; */
    }

    .top .row .block {
    flex-grow: 1;
    }

    .block img {
    display: block;
    margin: auto;
    }

    .top .block p {
    color: #E02F2C;
    font-size: 1rem;
    font-family: 'Open Sans Condensed', sans-serif;
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

    .top .punch-hole {
    height: 20px;
    width: 20px;
    background-color: #906B39;
    border-radius: 100px;
    display: flex;
    box-shadow: 2px 2px 2px rgba(0,0,0, .85);
    margin: auto;
    }

    .top .punch-hole:before {
    content: "";
    width: 10px;
    height: 10px;
    background-color: #062B60;
    border-radius: 100px;
    display: inline-block;
    margin: auto;
    box-shadow: 2px 2px 4px rgba(255, 255, 255, .5);
    }

    .row:nth-of-type(2) {
    display:flex;
    flex-direction: column;
    justify-content: center;
    }


    h2 {
    margin-top: -10px;
    font-family: 'Squada One', cursive;
    text-transform: uppercase;
    letter-spacing: 2px;
    color: #343E6F;
    width: 100%;
    font-size: 1rem;
    text-align: center;
    }

    .IATA {
    margin-top: -20px;
    font-family: 'Squada One', cursive;
    text-transform: uppercase;
    letter-spacing: -1px;
    color: #343E6F;
    width: 100%;
    font-size: 3rem;
    text-align: center;
    }

</style>