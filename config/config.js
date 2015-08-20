// data base connection configuration.
var dbconfig = {
    dev : {
        mssql: {
            userName: 'adCore',
            password: 'time4free',
            server: 'podiumdev.adcore.com',
            // If you are on Microsoft Azure, you need this:
            options: { database: 'adcore23072015', port: '2433', rowCollectionOnDone: true, rowCollectionOnRequestCompletion: true }
        },
        mongo: {
            url: 'mongodb://adcore:adcore@ds057862.mongolab.com:57862/adcoretest'
        }
    },
    prod: {
        mssql: {
            userName: 'adCore',
            password: 'time4free',
            server: 'podiumdev.adcore.com',
            // If you are on Microsoft Azure, you need this:
            options: { database: 'dbAdCore', port: '2433', rowCollectionOnDone: true, rowCollectionOnRequestCompletion: true }
        },
        mongo: {
            url: 'mongodb://adcore:adcore@ds057862.mongolab.com:57862/adcoretest'
        }
    },
    stage: {
        mssql: {
            userName: 'adCore',
            password: 'time4free',
            server: 'podiumdev.adcore.com',
            // If you are on Microsoft Azure, you need this:
            options: { database: 'adcore23072015', port: '2433', rowCollectionOnDone: true, rowCollectionOnRequestCompletion: true }
        },
        mongo: {
            url: 'mongodb://adcore:adcore@ds057862.mongolab.com:57862/adcoretest'
        }
    }
}

// common config
var commonConfig = {
    dev: {
        test: 123,
        adwords: {},
        bing: {},
        folder: {
            'temp' : 'C:\\inetpub\\wwwroot\\adCore.nodejs.v6\\adcore.api\\Files\\Temp\\'
        }
    },
    prod: {
        test: 456,
        adwords: {},
        bing: {},
        folder: {
            'temp': __dirname.replace('config', 'Files') + '/' + 'Temp' + '/'
        }
    },
    stage: {
        test: 789,
        adwords: {},
        bing: {},
        folder: {}
    }
}

// config object
var appData = {
    version: '6.00',
    mssql_db_environment: 'prod',
    mongo_db_environment: 'prod',
    sys_environment: 'prod',
    connection: '',
    common: null,
    dbconfig: { mssql: null, mongo: null }
}

// get relevant config by environment
appData.common = commonConfig[appData.sys_environment] || commonConfig['dev'];
appData.dbconfig.mssql = dbconfig[appData.mssql_db_environment].mssql;
appData.dbconfig.mongo = dbconfig[appData.mongo_db_environment].mongo;


module.exports = appData;