
/*
  Include this file on top of your popup.html / whatever
  also make sure that the logger server is running, or you will get spammed with errors
*/

const LOG_SERVER_URL = 'http://localhost:3000/log';
const CLEAR_SERVER_URL = 'http://localhost:3000/clear';

//extracts correct line number from stack trace
function getLogSource() {
  const stack = new Error().stack;
  const stackLines = stack.split('\n');
  const callerLine = stackLines[3];
  const match = callerLine.match(/at (.+):(\d+):\d+/);
  return match ? `${match[1]}:${match[2]}` : 'unknown source';
}

function logToServer(type, message, source) {
  fetch(LOG_SERVER_URL, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({type,message, source})
  }).catch(error => console.warn('failed to log to server', error));
}

async function clearServerLogs() {
  try {
    const response = await fetch(CLEAR_SERVER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    // const data = await response.json();
    // console.log(data.status);
  } catch (error) {
    console.error('Failed to clear console:', error);
  }
}

clearServerLogs();

//overwrite console methods
['log', 'warn', 'error', 'info', 'table'].forEach((method) => {
  const original = console[method];
  console[method] = (...args) => {
    const message = args.map(arg => (typeof arg === 'object' ? JSON.stringify(arg) : arg)).join(' ');
    const source = getLogSource(); //capture original calling line
    logToServer(method, message, source);
    original.apply(console, args); //also output to browser
  };
});