# Challenges
# Challenge 2
  Challenge 2 code is on NODEJS using Express<br/>
  Though the question is on AWS the Code flavoured to obtain Google Metadata as i have GCP account to deploy and test the code<br/>
  Deployed the code on to Google Cloud using GCP AppEngine <br/>
  Below are the steps from google Cloud Console to re-deploy, <br/>
    1) git clone git@github.com:girisheduru/Challenges.git<br/>
    2) cd Challenges<br/> 
    3) cd challenge2<br/>
    4) gcloud app deploy<br/>
    5) gcloud app browse<br/>
    6) An URL will be provided to check for its working <br/>
 
 Sample Input as in Code : computeMetadata/v1/instance?recursive=true&alt=json <br/>
 URL produced : https://rosy-decker-309304.ew.r.appspot.com
 
 Below is the sample output : 
 {"id":"00c61b117cb4465015dfc175e49918947398289d744cc7e40126813bce21165c41143ae3559a49a434120e4a6593248173631a6716344f8870c8866049461d4bdadc12a311164456","region":"projects/869001643515/regions/europe-west1","serviceAccounts":{"default":{"aliases":["default"],"email":"rosy-decker-309304@appspot.gserviceaccount.com","scopes":["https://www.googleapis.com/auth/appengine.apis","https://www.googleapis.com/auth/cloud-platform","https://www.googleapis.com/auth/cloud_debugger","https://www.googleapis.com/auth/devstorage.full_control","https://www.googleapis.com/auth/logging.write","https://www.googleapis.com/auth/monitoring.write","https://www.googleapis.com/auth/trace.append","https://www.googleapis.com/auth/userinfo.email"]},"rosyDecker-309304@appspot.gserviceaccount.com":{"aliases":["default"],"email":"rosy-decker-309304@appspot.gserviceaccount.com","scopes":["https://www.googleapis.com/auth/appengine.apis","https://www.googleapis.com/auth/cloud-platform","https://www.googleapis.com/auth/cloud_debugger","https://www.googleapis.com/auth/devstorage.full_control","https://www.googleapis.com/auth/logging.write","https://www.googleapis.com/auth/monitoring.write","https://www.googleapis.com/auth/trace.append","https://www.googleapis.com/auth/userinfo.email"]}},"zone":"projects/869001643515/zones/eu5"} <br/>
  
# Challenge 3 
Created a HTML page having Javascript code to have the recursive function <br/>

Two Functions created<br/>
1) one to parse the JSON object passed and pass on to the Key <br/>
2) recursive function to parse through the JSON Data and obtain the required Key values printed <br/>
3) Added some checks to handle few -ve test cases 

Sample Inputs :<br/>
 // Test Input with sample set<br/>
    parseAndPrint(jsonobject1,"b");<br/>
    parseAndPrint(jsonobject2, "z");<br/>
    parseAndPrint(jsonobject1, "xxx");<br/>
    parseAndPrint(jsonobject2, "a");<br/>
//Sample Test Data<br/>
    var jsonobject1 = `{"a":{"b":{"c":"d"}}}`;<br/>
    var jsonobject2 = `{"x":{"y":{"z":"a"}}}`;<br/>
    
Output : <br/>
Before parsing -- JSON StringiFY"{\"a\":{\"b\":{\"c\":\"d\"}}}"<br/>
After parsing -- JSON StringiFY{"a":{"b":{"c":"d"}}}<br/>
Value Required for Key : b<br/>
Parsing the nested Array for KEY b --- current key is a and Value is{"b":{"c":"d"}}<br/>
Output Value of the Key :b is {"c":"d"}<br/>

Before parsing -- JSON StringiFY"{\"x\":{\"y\":{\"z\":\"a\"}}}"<br/>
After parsing -- JSON StringiFY{"x":{"y":{"z":"a"}}}<br/>
Value Required for Key : z<br/>
Parsing the nested Array for KEY z --- current key is x and Value is{"y":{"z":"a"}}<br/>
Parsing the nested Array for KEY z --- current key is y and Value is{"z":"a"}<br/>
Output Value of the Key :z is "a"<br/>

Before parsing -- JSON StringiFY"{\"a\":{\"b\":{\"c\":\"d\"}}}"<br/>
After parsing -- JSON StringiFY{"a":{"b":{"c":"d"}}}<br/>
Value Required for Key : xxx<br/>
Parsing the nested Array for KEY xxx --- current key is a and Value is{"b":{"c":"d"}}<br/>
Parsing the nested Array for KEY xxx --- current key is b and Value is{"c":"d"}<br/>
ERRRR: "xxx" not found<br/>

Before parsing -- JSON StringiFY"{\"x\":{\"y\":{\"z\":\"a\"}}}"<br/>
After parsing -- JSON StringiFY{"x":{"y":{"z":"a"}}}<br/>
Value Required for Key : a<br/>
Parsing the nested Array for KEY a --- current key is x and Value is{"y":{"z":"a"}}<br/>
Parsing the nested Array for KEY a --- current key is y and Value is{"z":"a"}<br/>
ERRRR: "a" not found<br/>
