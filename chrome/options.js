function initMap() {
  var mapDiv = document.getElementById('map');
  navigator.geolocation.getCurrentPosition(function(position) {
    var myLatLng = {lat: position.coords.latitude, lng: position.coords.longitude};
    var map = new google.maps.Map(mapDiv, {
      center: myLatLng,
      zoom: 15
    });
    var marker = new google.maps.Marker({
      position: myLatLng,
      map: map,
      title: '目前位置'
    });
  });
}

$(function() {
  // areas settings
  let areas = JSON.parse(localStorage["areas"]);
  $("#opt_tp").prop("checked", areas.tp);
  $("#opt_hc").prop("checked", areas.hc);
  $("#opt_kh").prop("checked", areas.kh);

  // pokemons settings
  let container = $("#pokemons-selection");
  let notifyPokemons = JSON.parse(localStorage["pokemons"]);
  content = '';
  for(let i = 0; i < pokemons.length; i++) {
    let pokemon = pokemons[i];
    if(i % 10 == 0) {
      content += '<div class="row">';
    }
    content += 
    `
    <div class="col-md-1">
      <label class="checkbox text-center">
        <img src="${pokemon.img_src}"></img> <br />
        <input type="checkbox" id="id-${i + 1}">${pokemon.name_cht}</input>
      </label>
    </div>
    `;
    if(i % 10 == 9 ) {
      content += '</div>';
    }
  }
  container.append(content);
  for(var key in notifyPokemons) {
    $(`#id-${key}`).prop("checked", notifyPokemons[key]);
  }



  $("#btnSave").click(function() {
    // area settings
    areas.tp = $("#opt_tp").prop("checked");
    areas.hc = $("#opt_hc").prop("checked");
    areas.kh = $("#opt_kh").prop("checked");
    areas.nearby = $("#opt_nearby").prop("checked");
    localStorage["areas"] = JSON.stringify(areas);

    // pokemons settings
    for(let i = 1; i <= pokemons.length; i++) {
      let isChecked = $(`#id-${i}`).prop("checked");
      if(isChecked) notifyPokemons[i] = true;
      else notifyPokemons[i] = false;
    }
    localStorage["pokemons"] = JSON.stringify(notifyPokemons);
    
    chrome.runtime.sendMessage({request: "reloadSettings"});
    alert("儲存完成");
  });
});