var isRunning = false;
var radarId;
var wantedLocations = [0, 1, 2];
var wanted = [3, 6, 9, 131, 143, 149];
var db = {};
localStorage["areas"] = localStorage["areas"] || JSON.stringify({tp: true, hc: true, kh: true});
localStorage["pokemons"] = localStorage["pokemons"] || JSON.stringify({3: true, 6: true, 9: true, 131: true, 143: true, 149: true});

reloadLocations();
reloadWanted();

var queryUrls = [
  {loc: "臺北", url: 'https://pkgo.tw/api/pokemons/25.204206,121.603187/24.977332,121.354207'},  
  {loc: "新竹", url: 'https://pkgo.tw/api/pokemons/24.856668,121.022073/24.792551,120.896563'},
  {loc: "高雄", url: 'https://pkgo.tw/api/pokemons/22.690925,120.347358/22.498783,120.265457'},
  {loc: "附近", url: ''}
]

function reloadLocations() {
  let areas = JSON.parse(localStorage["areas"]);
  wantedLocations = [];
  if(areas.tp) wantedLocations.push(0);
  if(areas.hc) wantedLocations.push(1);
  if(areas.kh) wantedLocations.push(2);
}

function reloadWanted() {
  let notifyPokemons = JSON.parse(localStorage["pokemons"]);
  wanted = [];
  for(var key in notifyPokemons) {
    if(notifyPokemons[key]) {
      wanted.push(parseInt(key));
    }
  }
}

function showPokemonNotification(pkId, radarId, lat, lng) {
  let pokemon = pokemons[pkId - 1];
  chrome.notifications.create(radarId, {
    type: 'basic',
    iconUrl: pokemon.img_src,
    title: `發現 ${pokemon.name_cht} !!!`,
    message: `地點: ${db[radarId].loc}, 消失時間: ${formateDate(db[radarId].vanish_at)}`
  }, function(notificationId) {});
}

chrome.notifications.onClicked.addListener(function(notificationId) {
  chrome.notifications.clear(notificationId);
  let lat = db[notificationId].lat;
  let lng = db[notificationId].lng;
  chrome.tabs.create({ url: `http://maps.google.com/maps?q=loc:${lat},${lng}` });
});

function radarFunc() {
  console.log("searching...");

  // bottom left = 21.940976, 119.778371
  // upper right = 25.232740, 122.112966
  
  queryUrls.forEach(function(url, index) {
    if(wantedLocations.indexOf(index) == -1) return;
    $.get(url.url, function(data, status) {
      let appeared = data["pokemons"];
      console.log(`Found ${appeared.length} pokemons in ${url.loc}`);
      /*
      id = id + 1
      {"id":13,"lat":25.063594,"lng":121.539745,"vanish_at":1472640695000}
      */
      appeared.forEach(function(ele, index) {
        let radarId = (ele["id"] + ele["lat"] + ele["lng"] + ele["vanish_at"]).toString();
        let pokeId = ele["id"];
        let lat = ele["lat"];
        let lng = ele["lng"];

        if(db[radarId] || wanted.indexOf(pokeId) == -1) return;

        db[radarId] = {
          pkId: pokeId,
          lat: lat,
          lng: lng,
          loc: url.loc,
          vanish_at: ele["vanish_at"]
        };
        showPokemonNotification(pokeId, radarId, lat, lng);
      });
    });
  });
  
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if(request.request == "isRunning") {
    console.log("check isRunning");
    sendResponse({"isRunning": isRunning});
  } 
  else if(request.request == "start") {
    console.log("Starting MinMinRadar...");
    isRunning = true;
    radarId = setInterval(radarFunc, 10000);
  }
  else if(request.request == "stop") {
    console.log("Stopping MinMinRadar...");
    isRunning = false;
    clearInterval(radarId);
    db = {};
  }
  else if(request.request == "getPokemons") {
    sendResponse(db);
  }
  else if(request.request == "reloadSettings") {
    reloadLocations();
    reloadWanted();
  }
});