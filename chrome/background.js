var isRunning = false;
var radarId;
var wanted = [3, 6, 9, 131, 143, 149];
var db = {};

var queryUrls = [
  {loc: "北投", url: 'https://pkgo.tw/api/pokemons/25.13910546417688,121.58112317690734/25.091465633354726,121.41632825503234'},  
  {loc: "南寮", url: 'https://pkgo.tw/api/pokemons/24.860776604958343,121.04742795596007/24.813028834259338,120.88263303408507'},
  {loc: "旗津", url: 'https://pkgo.tw/api/pokemons/22.633934067084056,120.42069226870422/22.585363496621607,120.25589734682922'}  
]

function showPokemonNotification(pkId, radarId, lat, lng) {
  let pokemon = pokemons[pkId - 1];
  chrome.notifications.create(radarId, {
    type: 'basic',
    iconUrl: 'icon.png',
    title: 'Find ' + pokemon.name + ' !!!',
    message: 'Location: ' + lat + ", " + lng
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
          lat: lat,
          lng: lng
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
  if(request.request == "start") {
    console.log("Starting MinMinRadar...");
    isRunning = true;
    radarId = setInterval(radarFunc, 10000);
  }
  else if(request.request == "stop") {
    console.log("Stopping MinMinRadar...");
    isRunning = false;
    clearInterval(radarId);
  }
});