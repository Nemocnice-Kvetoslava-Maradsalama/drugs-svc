module.exports = {
    instance: {
        app: 'drug-svc',
        instanceId: 'one1',
        hostName: 'localhost',
        ipAddr: '127.0.0.1',
        port: {
            '$': 8702,
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
        host: '192.168.111.46',
        port: 8761,
        servicePath: '/eureka/apps',
    },
}