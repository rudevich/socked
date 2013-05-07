socked
======

Simple client-library for working with Web Sockets protocol

Using:

```javascript
var router = {
      "message1": function(data) {
        console.log(data)
      }
    },
    socked = new Socked(function(err){
        if (err) {
           // console.log("SOCKED: error", err);
            return false;
        }// else console.log("SOCKED: opened");
        //send auth message
        that.socked.send('authorize',{
            userID : userDetails.userID,
            sessionID: readCookie("sessionID")
        });
        //
    }, "responsibleWSURLfromRootOfYourServer", this.router);
```


Server must send messages in format:

```javascript
{
  "data": {
    "seqID":1, // ID of message (ordered)
    "messageType": "wow", // type of message
    "data": 42 // any data you want
  }
}
```
