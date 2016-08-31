$(function() {
  let container = $("#pokemons-selection");
  notifyPokemons = JSON.parse(localStorage["pokemons"]);
  content = '';
  for(let i = 0; i < pokemons.length; i++) {
    let pokemon = pokemons[i];
    if(i % 10 == 0) {
      content += '<div class="row">';
    }
    content += 
    `<div class="col-md-1">
      <img src="${pokemon.img_src}"></img>
      <label><input type="checkbox" id="id-${i + 1}">${pokemon.name_cht}</label>
    </div>`;
    if(i % 10 == 9 ) {
      content += '</div>';
    }
  }
  container.append(content);
  for(var key in notifyPokemons) {
    $(`#id-${key}`).prop("checked", notifyPokemons[key]);
  }

  $("#btnSave").click(function() {
    for(let i = 1; i <= pokemons.length; i++) {
      let isChecked = $(`#id-${i}`).prop("checked");
      if(isChecked) notifyPokemons[i] = true;
      else notifyPokemons[i] = false;
    }
    localStorage["pokemons"] = JSON.stringify(notifyPokemons);
    chrome.runtime.sendMessage({request: "reloadWanted"});
    alert("儲存完成");
  });
});