    // time protocol server Port 37 RFC 868
    // 
    // Goals: 
    //      play around with old protocols, from 'a more civilized age'
    //      make time server with only core modules
    //      Implement TCP and UDP protocols
    //      post on my github for fake internet points

    var tcp = require('net');
    var udp = require('dgram');
    var dns = require('dns');

    // Local DNS can be bad
    // Google has free public DNS
    // Relax, problem solved
    dns.setServers(["8.8.8.8", "8.8.4.4"]);     

    var udpMessageReceived = function(msg, rinfo){
        var tvl = getTimeValue();
        var msg = new Uint8Array(tvl.split(""));
        // prevent volley of udp datagrams bouncing back and forth, time responses are non zero length
        if(msg.length < 1){
            udpSocket.send(msg, 0, 32, rinfo.port, rinfo.address, (err) => {
                console.log(`UDP: message received from ${rinfo.address}:${rinfo.port} responded with ${tvl}`)
            });
        }
    };

    var udpSocket = udp.createSocket(
        {
            recvBufferSize: 1024,
            sendBufferSize: 1024,
            reuseAddr:      true,
            type:           "udp4"
        },
        udpMessageReceived
    );

    var udpListeningOnBind = function(){
        var addr = udpSocket.address();
        console.log(`UDP Listening on ${addr.address}:${addr.port}`);
    };  
    udpSocket.bind(37, "localhost", udpListeningOnBind);


    function getTimeValue(){
        var beginDate = new Date("1900-01-01T00:00:00.000Z");
        var todayDate = new Date();
        var deviation = Math.round(((todayDate - beginDate) / 1000))

        return deviation.toString(2);
    }

    // if not using NPM, get version manually
    if(!process.env.npm_package_version){
        process.env.npm_package_version = require('./package.json').version;
    }
    console.log("\n\n\n");
    console.log(`Time37 time protocol server v${process.env.npm_package_version}`);