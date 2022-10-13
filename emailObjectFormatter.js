const {google} = require('googleapis');
const parseMessage = require('gmail-api-parse-message');
const vidJson = require('./contactVids.json');


async function emailObjectFormatter(emailObjects, thread) {
  for (let i = 0; i < emailObjects.length; i++) {
    let currentEmail = emailObjects[i];
    let parsedMessage = parseMessage(currentEmail);
    let dateString = parsedMessage.headers.date;
    let timestamp = Date.parse(dateString);

    let fromData = parsedMessage.headers.from;
    let fromSliceIndex = fromData.indexOf('<');
    let fromEmail;
    let fromFirstName;
    let fromLastName;
    if (fromSliceIndex >= 0) {
      let fromEmailRaw = fromData.slice(fromSliceIndex - 1);
      let fromEmailClean = fromEmailRaw.replace(/[<>]/g,'').toLowerCase().trim();
      fromEmail = fromEmailClean
      let fromName = fromData.slice(0, fromSliceIndex - 1).replace(/"/g,'');
      let fromNameObj = fromName.split(" ");
      fromFirstName = fromNameObj[0]
      fromLastName = fromNameObj[1]
    } else {
      fromEmail = fromData
    };

    let toObj = [];
    let toEmailsList = [];
    let toData = parsedMessage.headers.to.split(',');
    toData.forEach(toEmail => {
      let trimmedToEmail = toEmail.trim();
      toObj.push(trimmedToEmail);
      let toEmailNameCheck = toEmail.indexOf('<');
      if (toEmailNameCheck >= 0) {
        emailToCheckListRaw = toEmail.slice(toEmailNameCheck - 1);
        emailToCheckList = emailToCheckListRaw.replace(/[<>]/g, '').toLowerCase().trim();
        toEmailsList.push(emailToCheckList);
      } else {
        toEmailsList.push(trimmedToEmail);
      };
    });

    let ccObj = [];
    let ccData = parsedMessage.headers.cc;
    if (typeof ccData !== 'undefined') {
      let ccDataSplit = ccData.split(',');
      ccDataSplit.forEach(ccEmail => ccObj.push({"email": ccEmail}));
    };

    let bccObj = [];
    let bccData = parsedMessage.headers.bcc;
    if (typeof bccData !== 'undefined') {
      let bccDataSplit = bccData.split(',');
      bccDataSplit.forEach(bccEmail => bccObj.push({"email": bccEmail}));
    };

    let subject = parsedMessage.headers.subject;
    let emailText = parsedMessage.textPlain;
    let emailHtml = parsedMessage.textHtml;
    // create empty array of contact emails that need to be checked
    let contactsForIdCheck = [];
    let buddyContacts = [process.env.USERS_ARRAY];
    //check to see if from email matches array of buddy contacts, if not - push to contactsForIdCheck
    if (buddyContacts.indexOf(fromEmail) == -1) {
      contactsForIdCheck.push(fromEmail);
    };
    // check to see if the to emails match array of buddy contacts, push non matches to contactsForIdCheck array
    toEmailsList.forEach(toEmailToCheck => {
      if (buddyContacts.indexOf(toEmailToCheck) == -1) {
      contactsForIdCheck.push(toEmailToCheck);
      };
    });

    // create array for contact VIDs
    let contactIds = [];
    // for each contact to check, check the vid json to see if the user is in huspot
    contactsForIdCheck.forEach(contact => {
      vidJson.forEach(object => {
        if (object.email === contact) {
          let vid = object.vid;
          contactIds.push(vid);
        }
      })
    })
      //if contact has ID, push ID to contact VIDs contactIds array

    //once I have data for the Contacts VIDs, then build the messageDataObj to be sent to Hubspot


    // //****************

    let engagementObject = {
      "engagement": {
        "type": "EMAIL",
        "timestamp": timestamp,
      },
      "associations": {
        "contactIds": contactIds,
      },
      "metadata": {
        "from": {
          "email": fromEmail,
          "firstName": fromFirstName,
          "lastName": fromLastName,
        },
        "to": [
          {
            "email": toObj[0],
          }
        ],
        "cc": ccObj,
        "bcc": bccObj,
        "subject": subject,
        "html": emailHtml,
        "text": emailText,
      }
    };
    if (contactsForIdCheck.length == 0) {
      console.log("Thread", thread, "does not have any external contacts");
    };
    return engagementObject;
  }
}

exports.emailObjectFormatter = emailObjectFormatter;
