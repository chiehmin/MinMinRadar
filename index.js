$(function() {
  $("#result").text("jfdisofjoia");
  $.get("https://www.pokeradar.io/api/v1/submissions?minLatitude=24.499020811600275&maxLatitude=24.82537857544687&minLongitude=120.61477661132811&maxLongitude=121.69967651367188&pokemonId=0", function(data, status) {
    alert(data.data.length);
    let pokemons = data.data;
    for(let i = 0; i < pokemons.length; i++) {
      alert(pokemons[i].trainerName + ": " + pokemons[i].pokemonId);
    }
  });
});


