var isRunning = false;

function refreshCtrl() {
  $("#btnCtrl").text(!isRunning ? "Start" : "Stop");
}

function initialUIUpdate() {
  chrome.runtime.sendMessage({request: "isRunning"}, function(rspd) {
    console.log("isRunning rspd" + rspd["isRunning"]);
    isRunning = rspd["isRunning"];
    refreshCtrl();
  });
  chrome.runtime.sendMessage({request: "getPokemons"}, function(db) {
    for(let key in db) {
      let pokemon = db[key];
      let pokeName = pokemons[pokemon.pkId - 1].name_cht;
      $("#result-panel").append(
        `<div>
          <a href="http://maps.google.com/maps?q=loc:${pokemon.lat},${pokemon.lng}", target="_blank">
            ${pokeName} -- 消失時間 ${formateDate(pokemon.vanish_at)}
          </a>
        </div>`
      );
    }
  });
}

$(function() {
  initialUIUpdate();
  $("#btnCtrl").click(function() {
    if(!isRunning) {
      isRunning = true;
      chrome.runtime.sendMessage({request: "start"});
    } else {
      isRunning = false;
      chrome.runtime.sendMessage({request: "stop"});
      $("#result-panel").empty();
    }
    refreshCtrl();
  });
});