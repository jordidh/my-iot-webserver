# Internet-of-Things Web Server

Web server to:
 * Store data from IoT devices in format
 ```
 The data has two kind of objects releated:
 * Object key: has all the attributes to descript an object, only exists
               one object for each array of values
 * Object value: has the reference of the description object, and all the 
               values in a given date time and the date time
 ```
 * Create data triggers to send alerts
 
## Exposed methods

The web server expose REST methods to manage keys and values.

### Key object managing
Methods to manage key objects [GET|POST|PUT|DELETE]. The URL is /key/
A key object is an object that can have a collection of values and can belong 
to an other key object in an hierarchy of key objects. 
A key object must have the following mandatory attributes:
* id
* name: default value string empty
* description: default value string empty
* unit:
  * code: code of the measure unit of the key (ex: m, kg, l, cm, ...), default value string empty
  * description: description of the measure unit (ex: meter, kilogram, liter, ...), default value string empty
* parentKey: id of the parent key, if does not has a parent key the value is string empty

 * /key/<id> [GET|POST|PUT|DELETE]: 
   * Ex: Get a key
     ```
       Request:
         [GET] /key/198O3JLKEDJE1312
        
       Response:
         200,
         { 
           id: "198O3JLKEDJE1312",
           name: "", 
           description: "",
           unit: { code: "", description: "" },
           parentkey: "" 
         }
     ```
   * Ex: Post a key
     ```
       Request:
         [POST] /key
         Data: { name: "", description: "", unit: { code: "", description: "" }, parentKey: ""}
          
       Response:
         200,
         {
           id: "198O3JLKEDJE1313",
           name: "", 
           description: "", 
           unit: { code: "", description: "" }
           parentkey: "" 
         }
     ```
    
### Value object managing
Methods to manage value objects [GET|POST|PUT|DELETE]
A value object must have the following mandatory attributes:
* id
* value
* timestamp
* key: id of the key

 * /key/<id>/value/<id> [GET|POST|PUT|DELETE]:
   * Ex: Gets all the values from a key
   ```
     Request:
       [GET] /key/198O3JLKEDJE1312/value
       
     Response:
       200,
       { 
         id: "198O3JLKEDJE1312",
         name: "", 
         description: "",
         unit: { code: "", description: "" },
         parentkey: ""
         values: 
           [
             {
                id: "198O3JLKEDJE1313",
                value: "123.567",
                timestamp: ""
             }
              ...
           ]
       }
   ```
   * Ex: Get a value from a key
   ```
     Request:
       [GET] /key/198O3JLKEDJE1312/value/20934rjñlkqwdjfwq4
       
     Response:
       200,
       { 
         id: "198O3JLKEDJE1312",
         name: "", 
         description: "",
         unit: { code: "", description: "" },
         parentkey: ""
         value: 
           {
              id: "198O3JLKEDJE1313",
              value: "123.567",
              timestamp: "" 
           }
       }
   ```
   * Ex: Posts a new value
   ```
     Request:
       [POST] /key/198O3JLKEDJE1312/value 
       Data: { value: 123.567 }
       
     Response:
       If the node id exists and the value field exists:
       200, 
       {
         id: "198O3JLKEDJE1312",
         value: "123.567",
         timestamp: "",
         key: "198O3JLKEDJE1312"
       } 
   ```

# Internet-of-Things Clients

## Simple client to water the plants

This client has to do the following tasks:
 * Control that the water depot has enough water, if not stop irrigate plants and send message
 * Water the plants according to some time table
 
The client needs to be configured before start with the following values:
 * Wifi and password
 * Internet-of-Things web server address, user and password
 * Email server to send alerts
 * Angle of the ultrasonic sensor from vertical

This client is build with:
 * 1 Weemos D1 mini V2 with
 * 1 ultrasonic sensor HC-SR04 to control the depot water level
 * 1 rele to activate the water bomb
 
The main control loop will do:
 * Read the depot water level
 * Post the water level to the web server
 * If the water level is not between the safe range
   * Stop the water bomb acting over the rele
   * Post the rele value to the web server
   * Send a message to alert
   * Post the send message to the web server
 * Else
   * Check the time table and if its time to start watering open the relé o if its time to stop watering close the rele
   * Post the rele value to the web server
   * Send a message to inform start or stop watering
   * Post the send message to the web server
 * Sleep some seconds
 
 
# SSL
 Basat en el post: http://blog.mgechev.com/2014/02/19/create-https-tls-ssl-application-with-express-nodejs/
 Instalem els paquetes HTTPS y FS, per implementar el servidor SSL i poder llegir els fitxers de certificats.
  ```
 $ npm install --save https
 $ npm install --save fs
 ```
 
 Editem el fitxer "/bin/www", comentem:
 ```
 /**
  * Create HTTP server.
  */
 
 //var server = http.createServer(app);
 ```
 
 Afegim
 ``` 
 var https = require('https');
 var fs = require('fs');
 

 /**
  * Create HTTPS server.
  */
 
 var server = https.createServer(
     {
         key: fs.readFileSync('ssl/key.pem'),
         cert: fs.readFileSync('ssl/cert.crt')
     },
     app);
```

Creem els certificats i els copiem a la carpeta "/ssl":
```
$ openssl genrsa -out key.pem \2048
$ openssl req -new -key key.pem -out csr.pem -subj "/C=<coutry code>/ST=<state>/L=<city>/O=<organization name>/OU=<organization unit> demo/CN=localhost"
$ openssl x509 -req -days 9999 -in csr.pem -signkey key.pem -out cert.crt

$ cp cert.crt /ssl
$ cp key.pem /ssl
```

En els fitxers de test frisby afegim la sentència següent per que no fallin en ser no confiable el certificat:
```
// Include this line at the beginning of your firsby test. This will direct non-rejection of SSL cert
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
```