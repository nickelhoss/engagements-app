const {google} = require('googleapis');


async function callGmailApi(thread) {

  const auth = new google.auth.JWT({
    keyFile: './credentials.json',
    scopes: 'https://mail.google.com/',
    subject: 'process.env.USER_EMAIL'
  });
  
  await auth.authorize();

  const gmail = google.gmail({version: 'v1', auth});
  return new Promise((resolve, reject) => {
    gmail.users.threads.get({
      userId: 'me',
      id: thread
    }, (err, res) => {
      if (err) return console.log('The API returned an error with Thread ID: ', thread, 'Error Message: ' + err);
      let responseData = res.data;
      let rawEmailObjects = responseData.messages;
      resolve(rawEmailObjects);
    });
  });
};

exports.callGmailApi = callGmailApi;
