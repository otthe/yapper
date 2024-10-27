/*
  Include this file on top of your popup.html
*/

const LOG_SERVER_URL = 'http://localhost:3000/log';

function getLogSource() {
  const stack = new Error().stack;
  const stackLines = stack.split('\n');
  const callerLine = stackLines[3];
  const match = callerLine.match(/at (.+):(\d+):\d+/);
  return match ? `${match[1]}:${match[2]}` : 'unknown source';
}

function logToServer(type, message, source) {
  // const source = getLogSource(); !! moved this to overwriting to get the original line
  fetch(LOG_SERVER_URL, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({type,message, source})
  }).catch(error => console.warn('failed to log to server', error));
}

//overwrite console methods
['log', 'warn', 'error', 'info'].forEach((method) => {
  const original = console[method];
  console[method] = (...args) => {
     const message = args.map(arg => (typeof arg === 'object' ? JSON.stringify(arg) : arg)).join(' ');
     const source = getLogSource(); //we call this here so we get the original line instead of yapper line
     logToServer(method, message, source);
     original.apply(console, args);
  };
});