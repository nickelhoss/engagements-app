const axios = require('axios');


async function postEngagement(currentEngagementObject, thread) {
  const hubspotUrl = 'https://api.hubapi.com/engagements/v1/engagements?hapikey=' + process.env.PRODUCTION_HAPI_KEY;
  
  await new Promise(resolve => setTimeout(resolve, 75));
  
  axios.post(hubspotUrl, currentEngagementObject)
  .then(response => {
    console.log("Status: ", response.status, "Thread ID: ", thread);
  })
  .catch(error => {
    console.log("Error on Thread ID: ", thread, "Error Message: ", error);
    
  });
};


exports.postEngagement = postEngagement;
