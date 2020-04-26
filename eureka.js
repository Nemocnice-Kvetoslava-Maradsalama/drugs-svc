const Eureka = require('eureka-js-client').Eureka;

    const client = new Eureka({
        instance: {
            app: 'drug-svc',
            instanceId: 'one1',
            hostName: 'localhost',
            ipAddr: 'localhost',
            port: {
                '$': 5000,
                '@enabled': true,
            },
            vipAddress: 'drug-svc',
            dataCenterInfo: {
                '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
                name: 'MyOwn',
            },
            registerWithEureka: true,
            fetchRegistry: true
        },
        eureka: {
            host: '172.28.0.2',
            port: 8761,
            servicePath: '/eureka/apps',
        },
    });
    client.start((error) => {
        console.log(error || 'Eureka Started!');
    });

    var eurekaa = {
        // const instances = this.eureka.getInstancesByAppId('PERSONNEL-SVC');
        //   if (instances.length > 0) {
        //     console.log(instances[0].hostName || '');
        //   } else {
        //     console.log('none :(');
        // }
        getInstances: function(){
            const instances = client.getInstancesByAppId('PERSONNEL-SVC');
            console.log(instances[0])
            if (instances){
                const hostname = 'http://' + instances[0]['hostName'] + ':' + instances[0]['port']['$']
                //const port = instances[0]['port']['$']
                return `${hostname}`
            } else {
                return ''
            }
        }
    }

    module.exports = eurekaa