function Socked(ready, handler, router, host, secure) {
    //init options
    var options = {};
    options.host = host || window.location.host;
    options.handler = handler; //init handler
    options.protocol = secure?'wss:/':'ws:/';
    options.uri = [options.protocol, options.host, options.handler].join("/");
    //init router
    this.router = router;
    
    //method for getting options
    this.getOptions = function(){ return options; };
    
    //init socked
    this.init(ready, options);
};
Socked.prototype.sequence = function(msg, data){
    var cx = 1;
    var buff = {};
    var buffseq = [];
    var breakcx = 0;
    var that = this;
    this.sequence = function(msg, data){
        var seqID = data.seqID;
        //if we lost up to 20 messages
        if (breakcx>20 || that.reopen) {
            cx = seqID+1;
            buff = {};
            buffseq = [];
            breakcx = 0;
            that.reopen = false;
            return true;
        }
        //if all fine
        if (seqID==cx) {
            cx++;
            return true;
        }
        //if we have some message in buffer which is next
        else if (buff.length>0 && buffseq.indexOf(cx)!=-1) {
            delete buff[data.messageType+'-'+data.seqID+'-'];
            buffseq.splice(buffseq.indexOf(cx), 1);
            setTimeout(function(){ this.socket.onmessage(msg); }, 0);
        } else { // if we must buffer this message
            buff[data.messageType+'-'+data.seqID+'-'] = msg;
            buffseq.push(data.seqID);
            breakcx++;
            return false;
        }
    };
    return this.sequence(msg, data);
};
//init with current options
Socked.prototype.init = function(ready, o) {
    var that = this;
    this.socket = new WebSocket(o.uri);
    this.socket.onopen = function(){
        that.closed = false;
        that.reopen = true;
        ready();
        that.messages();
    };
    //error
    this.socket.onerror = function(err) {
        ready(err);
    };
    //close
    this.socket.onclose = function() {
        that.closed = true;
        //reopen till 1 sec
        //console.log("REOPEN in 0 sec");
        setTimeout(function() { that.init(ready, o); }, 0);
    };
    
    window.onbeforeunload = function(){
        that.socket.close();
    };
};
//init messaging
Socked.prototype.messages = function() {
    var that = this,
        router = this.router;
    //message
    this.socket.onmessage = function(msg){
        //console.log("ONMESSAGE", msg);
        var data = JSON.parse(msg.data);
        if (!that.sequence(msg, data)) return false;
        var route = data.messageType;
        if (router[route]) {
            router[route].call(this, data.data);
        } else if (router['default']) router['default']();
    };
};
//send method
Socked.prototype.send = function(message, data) {
    if (!this.socket) return false;
    if (this.closed) return false;
    var that = this,
        d = {messageType:message, data:data};
    var json = JSON.stringify(d);
    that.socket.send(json);
    return that;
};
