(function(){
var scheme   = "ws://";
var uri      = scheme + window.document.location.host + "/";
var ws       = new WebSocket(uri);

ws.onmessage = function(message) {
  var data = JSON.parse(message.data);
  $("#chat-text").append("<div>" + data.handle + ": " + data.text + "</div>");
  $("#chat-text").stop().animate({
    scrollTop: $('#chat-text')[0].scrollHeight
  }, 800);
};

$("#input-form").on("submit", function(event) {
  event.preventDefault();
  console.log("hello")
  var handle = $("#handle").val();
  var text   = $("#text").val();
  console.log(handle);
  console.log(text);
  ws.send(JSON.stringify({ handle: handle, text: text }));
  $("#text").value = "";
});

})();
