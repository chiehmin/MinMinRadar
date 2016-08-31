var isRunning = false;
var radarId;
var wanted = [3, 6, 9, 131, 143, 149];
var db = {};

var queryUrls = [
  {loc: "臺北", url: 'https://pkgo.tw/api/pokemons/25.204206,121.603187/24.977332,121.354207'},  
  {loc: "新竹", url: 'https://pkgo.tw/api/pokemons/24.856668,121.022073/24.792551,120.896563'},
  {loc: "高雄", url: 'https://pkgo.tw/api/pokemons/22.690925,120.347358/22.498783,120.265457'}  
]

function showPokemonNotification(pkId, radarId, lat, lng) {
  let pokemon = pokemons[pkId - 1];
  chrome.notifications.create(radarId, {
    type: 'basic',
    iconUrl: 'icon.png',
    title: `發現 ${pokemon.name_cht} !!!`,
    message: `地點: ${db[radarId].loc}, 消失時間: ${db[radarId].vanish_at}`
  }, function(notificationId) {});
}

chrome.notifications.onClicked.addListener(function(notificationId) {
  chrome.notifications.clear(notificationId);
  let lat = db[notificationId].lat;
  let lng = db[notificationId].lng;
  chrome.tabs.create({ url: `http://maps.google.com/maps?q=loc:${lat},${lng}` });
});

function formateDate(date) {
  return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
}

function radarFunc() {
  console.log("searching...");

  // bottom left = 21.940976, 119.778371
  // upper right = 25.232740, 122.112966
  
  queryUrls.forEach(function(url, index) {
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
          vanish_at: formateDate(new Date(ele["vanish_at"]))
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
  }
  else if(request.request == "getPokemons") {
    sendResponse(db);
  }
});