Socked.js
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
            return false;
        }
        //send auth message
        that.socked.send('authorize',{"hi":"bro"});
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
