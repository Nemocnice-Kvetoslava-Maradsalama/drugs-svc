# drugs-svc
To run the db. 
```docker build -t my-postgres-image .  ```\

```docker run -d --name my-postgres-container -p 5555:5432 my-postgres-image  ```

  
To registrate with eureka:  
```node eureka.js  ```
  
  
To run the servise  
```npm start  ```


configuration is at ```eureka.js``` file, where you will probably need to change address of eureka server 
