require('dotenv').config();
const callGmailApi = require('./gmailCall.js');
const emailObjectFormatter = require('./emailObjectFormatter.js');
const postEngagement = require('./postEngagement.js');
const personalThreadsJson = require('./personalThreads.json');


let gAuth = auth.googleAuth().then((res) => {
  return res;
});


async function iterateThreads() {
  for (let i = 0; i < personalThreadsJson.length; i++) {
    let thread = personalThreadsJson[i];
    let emailObjects = await callGmailApi.callGmailApi(thread);
    let formattedEmailObjects = await emailObjectFormatter.emailObjectFormatter(emailObjects, thread);
    await postEngagement.postEngagement(formattedEmailObjects, thread);
  }
}


iterateThreads()
