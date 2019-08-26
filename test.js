

var argv = process.argv;
if(argv.length == 3){
    var udp = require('dgram');
    var sck = udp.createSocket('udp4');
    sck.send(' ', 37, argv[3], (err) => { sck.close(); });
}