# Engagements App
This application is designed to pull email data for multiple users from Gmail using Thread IDs, in my case pulled from our old sales CRM with Streak, and then import that data into our new Hubspot CRM.  

First: Create a file called credentials.json and then add credentials downloaded from Google.  
Second: Create an .env file and add STAGING_HAPI_KEY & PRODUCTION_HAPI_KEY and then set them equal to the appropriate API keys for Hubspot  
Third: Create a file called threads.json and add save all of the gmail thread IDs to the file.