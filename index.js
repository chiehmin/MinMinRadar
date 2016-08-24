$(function() {
  let container = $("#pokemons-selection");
  for(let i = 0; i < pokemons.length; i++) {
    let pokemon = pokemons[i];
    if(i % 4 == 0) {
      container.append('<div class="row">');
    }
    container.append(`<div class="col-sm-3"><label><input type="checkbox" value=""  id="id-${i + 1}">${pokemon}</label></div>`);
    if(i % 4 == 0 ) {
      container.append('</div>');
    }
  }
  $("#id-131").prop("checked", true); // lapras
  $("#id-143").prop("checked", true); // snorlax
  $("#id-149").prop("checked", true); // dragonite
  
  $("#start").click(function() {
    wanted = [];
    for(let i = 1; i <= 151; i++) {
      let isChecked = $(`#id-${i}`).prop("checked");
      if(isChecked) {
        wanted.push(i);
      }
    }
    console.log(wanted);
    founded = new Set();
    setInterval(function() {
      for(let j = 0; j < wanted.length; j++) {
        let pokeId = wanted[j];
        $.get(`https://www.pokeradar.io/api/v1/submissions?minLatitude=20.848545148787238&maxLatitude=26.509904531413927&minLongitude=114.027099609375&maxLongitude=131.385498046875&pokemonId=${pokeId}`, function(data, status) {
          let appeared = data.data;
          
  /*
  {"id":"1472022748-13-24.8065778307838-120.958815121044","created":1472022748,"downvotes":0,"upvotes":1,"latitude":24.8065778307838,"longitude":120.958815121044,"pokemonId":13,"trainerName":"(Poke Radar Prediction)","userId":"13661365","deviceId":"80sxy0vumg2h5hhv8hgc0axt9jr29al7"}
  */
          for(let i = 0; i < appeared.length; i++) {
            let id = appeared[i].id;
            let trainerName = appeared[i].trainerName;
            let pokeId = appeared[i].pokemonId;
            
            if(trainerName == "(Poke Radar Prediction)" && !founded.has(id)) {
              console.log(pokeId);
              let lat = appeared[i].latitude;
              let long = appeared[i].longitude;
              let pokeName = pokemons[pokeId - 1];
              let option = {title: pokeName, body: `Found pokemon at ${lat}, ${long}!!`};
              new Notification(option.title, option);
              $("#result-panel").append(`<div><a href="http://maps.google.com/maps?q=loc:${lat},${long}", target="_blank">${pokeName}</a></div>`);
              founded.add(id);
            }
          }
        });
      }
    }, 10000)
  });


  // $("#test").text(pokemons[0]);
  
});


