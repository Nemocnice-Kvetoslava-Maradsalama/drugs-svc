## drug-svc

 - To run the servise: ``` docker-compose up --build ```
 - Api documentation is available on ```/documentation```
 - Visual documentation is located in docs repository with documentation of other services 


There are 4 branches in this repository:

* ```develop``` - branch where all new changes will be pushed
* ```stage``` - branch with already tested copy of a code which is functional and has been tested by other team members. (Patient-Drug-Disease communication)
* ```master``` - default
* ```feature/requesting-disease-with-token``` - adjusted drug-svc to work with updated version of disease svc

### Fulfilled point:
 - [x] Separate repositories for each microservice
 - [x] Implement some tests and test each service separately 
 - [x] Dependencies – explicitly declare and isolate dependencies
 - [x] Configuration of services provided via environmental properties
 - [x] Backing services like database and similar will be deployed as containers too
 - [x] CI & docker
 - [x] Processes – execute the app as one or more stateless processes
 - [x] Port binding – export services via port binding
 - [x] Disposability – maximize robustness with fast startup and graceful shutdown
 - [x] Ability to stop/restart service without catastrophic failure for the rest 
 - [x] Logs – treat logs as event streams. Log into standard output
 - [x] REST API defined using Open API standard (Swagger)
 - [x] Clear URLs
 - [x] Clean usage of HTTP statuses
 - [x] Transparency – the client should never know the exact location of a service
 - [x] Service discovery
 - [x] Scope – use domain driven design or similar to design the microservices
 - [x] Documentation – visually communicate architecture of your system
