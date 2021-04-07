# Challenges
# Challenge 1 
Challenge is on 3 - Tier Application setup<br/> 
Technical stack for Sample apps :<br/>
  Front End : React JS with NGINX Server <br/>
  Backe End : Node Js with Express Server<br/>
  Database : Cloud SQL(Google) with MYSQL<br/>

Deployment Manager is used to create the setup with JINJA and YAML files. <br/>

Steps to reproduce the setup : Cloud SDK and Kubectl installed locally <br/>
//Setting the cloud context - <br/>
gcloud auth login<br/>
export PROJECT_ID=rosy-decker-309304<br/>
echo $PROJECT_ID<br/>
gcloud config set project $PROJECT_ID<br/>
gcloud config set compute/zone  europe-west1-b<br/>

Create Docker Files locally and pushed to Docker Registry :<br/>
// Align Docker registry for the project <br/>
gcloud auth configure-docker<br/>
docker-credential-gcloud list<br/>
gcloud container clusters get-credentials challenge-cluster<br/>
kubectl create secret docker-registry gcr-access-token \<br/>
--docker-server=eu.gcr.io \<br/>
--docker-username=oauth2accesstoken \<br/>
--docker-password="$(gcloud auth print-access-token)" \<br/>
--docker-email=girisheduru@gmail.com
<br/>


// Docker Build and Push <br/>
docker build . --tag eu.gcr.io/rosy-decker-309304/challengefe:latest<br/>
docker push eu.gcr.io/rosy-decker-309304/challengefe:latest<br/>
docker build . --tag eu.gcr.io/rosy-decker-309304/challengebe:latest<br/>
docker push eu.gcr.io/rosy-decker-309304/challengebe:latest<br/>

// Enable Deployment manager<br/>
gcloud services enable deploymentmanager.googleapis.com<br/>
// Enable GKE<br/>
gcloud services enable container.googleapis.com<br/>

// Pushed cloud SQL proxy image to make it available on the registry<br/>
gcloud projects add-iam-policy-binding $PROJECT_ID \<br/>
    --member=serviceAccount:869001643515@cloudservices.gserviceaccount.com --role=roles/storage.admin<br/>
docker pull gcr.io/cloudsql-docker/gce-proxy:1.17<br/>
docker tag gcr.io/cloudsql-docker/gce-proxy:1.17 eu.gcr.io/rosy-decker-309304/gce-proxy:1.17<br/>
docker push eu.gcr.io/rosy-decker-309304/gce-proxy:1.17<br/>

// Cluster Creation<br/>
gcloud deployment-manager deployments create challenge-cluster --config challenge1/cluster.yaml<br/>
gcloud deployment-manager deployments update challenge-cluster --config challenge1/cluster.yaml<br/>
gcloud deployment-manager deployments delete challenge-cluster<br/> 

gcloud container clusters get-credentials cluster-name <br/>


// Enable SQL components 
gcloud services enable sql-component.googleapis.com<br/>
gcloud services enable sqladmin.googleapis.com<br/>
gcloud projects add-iam-policy-binding $PROJECT_ID \<br/>
    --member=serviceAccount:869001643515@cloudservices.gserviceaccount.com --role=roles/storage.objectAdmin<br/>
kubectl create secret generic dbsecret --from-literal=username=root --from-literal=password=test123_ --from-literal=database=challengeDB<br/>
gcloud components install kubectl<br/>

gcloud deployment-manager deployments create challenge1-db --config challenge1/db/sql.yaml<br/>
gcloud deployment-manager deployments update challenge1-db --config challenge1/db/sql.yaml<br/>
gcloud deployment-manager deployments delete challenge1-db<br/>

// Service Account for the proxy Side car to connect MYSQL from GKE Pods 
gcloud iam service-accounts create sasidecar1 --description=“sidecar1” --display-name=“sasidecar1”<br/>
gcloud iam service-accounts keys create ~key.json --iam-account sasidecar1@rosy-decker-309304.iam.gserviceaccount.com<br/>
kubectl create secret generic sasecret1 --from-file=credentials.json=~key.json<br/>
gcloud projects add-iam-policy-binding $PROJECT_ID \<br/>
    --member=serviceAccount:sasidecar1@rosy-decker-309304.iam.gserviceaccount.com --role=roles/cloudsql.client<br/>

// APPS creation
gcloud deployment-manager deployments create challenge-apps --config challenge1/apps.yaml<br/>
gcloud deployment-manager deployments update challenge-apps --config challenge1/apps.yaml<br/>
gcloud deployment-manager deployments delete challenge-apps <br/>


Output : 
React Front end exposed through Ingress Gateway : http://34.117.196.83 <br/>
Accessing backend APIs though NGINX proxy (front end Server) : http://34.117.196.83/api<br/>
Backend is a multi container pod with sql proxy as a side car : SQL server can be connected through localhost in backend pod<br/> 

```
Deployments list : gcloud deployment-manager deployments list
NAME                 LAST_OPERATION_TYPE  STATUS  DESCRIPTION  MANIFEST                ERRORS
challenge-apps       update               DONE                 manifest-1617776253413  []
challenge-cluster    insert               DONE                 manifest-1617713694207  []
challenge-db-client  update               DONE                 manifest-1617705890584  []
challenge1-db        update               DONE                 manifest-1617683988237  []

Cluster list : gcloud container clusters list
NAME                LOCATION        MASTER_VERSION   MASTER_IP       MACHINE_TYPE   NODE_VERSION     NUM_NODES  STATUS
challenge1-cluster  europe-west1-b  1.18.16-gke.302  146.148.28.128  n1-standard-1  1.18.16-gke.302  2          RUNNING

DB : gcloud sql databases list --instance=challenge1-db-cloudsql-master
NAME                CHARSET  COLLATION
information_schema  utf8     utf8_general_ci
challengeDB         utf8     utf8_general_ci
mysql               utf8     utf8_general_ci
performance_schema  utf8     utf8_general_ci
sys                 utf8     utf8_general_ci

Kubectl get pods - 
NAME                               READY   STATUS    RESTARTS   AGE
backend-deploy-69749d8544-jz8tb    2/2     Running   0          45m
backend-deploy-69749d8544-wvlnq    2/2     Running   0          45m
frontend-deploy-754459dd69-gxfc7   1/1     Running   0          15h
frontend-deploy-754459dd69-pczgl   1/1     Running   0          15h

Kubectl get Deployments -
NAME              READY   UP-TO-DATE   AVAILABLE   AGE
backend-deploy    2/2     2            2           15h
frontend-deploy   2/2     2            2           15h

Kubectl get Ingress -
NAME               CLASS    HOSTS   ADDRESS         PORTS   AGE
frontend-ingress   <none>   *       34.117.196.83   80      15h
  
Kubectl get svc - 
NAME           TYPE           CLUSTER-IP      EXTERNAL-IP    PORT(S)          AGE
backend-svc    ClusterIP      10.27.242.70    <none>         9001/TCP         15h
frontend-svc   LoadBalancer   10.27.254.240   34.76.196.48   8001:31489/TCP   15h
kubernetes     ClusterIP      10.27.240.1     <none>         443/TCP          17h
  
Kubectl get secrets - <br/>
NAME                  TYPE                                  DATA   AGE
db-secret             Opaque                                3      15h
dbsecret              Opaque                                3      12h
default-token-2n4q4   kubernetes.io/service-account-token   3      17h
gcr-access-token      kubernetes.io/dockerconfigjson        1      15h
sasecret              Opaque                                1      12h
sasecret1             Opaque                                1      11h

```

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
 
 Code get stored in Cloud Storage and then gets deployed. 
 
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
