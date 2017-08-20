const config = {
  app_id: 867, 
  app_name: 'struggle',
  redirect_uri: 'https://strugglecasino.github.io/',
  mp_browser_uri: 'https://www.moneypot.com',
  mp_api_uri: 'https://api.moneypot.com',
  chat_uri: '//socket.moneypot.com',
  debug: isRunningLocally(),
  force_https_redirect: !isRunningLocally(),
  house_edge: 0.01,
  chat_buffer_size: 150,
  bet_buffer_size: 25
};

(function() {
  var errString;

  if (config.house_edge <= 0.0) {
    errString = 'House edge must be > 0.0 (0%)';
  } else if (config.house_edge >= 100.0) {
    errString = 'House edge must be < 1.0 (100%)';
  }

  if (errString) {
    alert(errString);
    throw new Error(errString);
  }

  // Sanity check: Print house edge
  console.log('House Edge:', (config.house_edge * 100).toString() + '%');
})();

if (config.force_http_redirect && window.location.protocol !== "https:") {
  window.location.href = "https:" + window.location.href.substring(window.location.protocol.length);
}

function isRunningLocally() {
  return /^localhost/.test(window.location.host);
}


export default config;