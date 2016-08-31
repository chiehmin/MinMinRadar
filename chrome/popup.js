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
    }
    refreshCtrl();
  });
});