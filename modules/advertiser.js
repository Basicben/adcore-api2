var mongoose = require('mongoose');
var advertiserModel = require('../models/advertiser/advertiserModel');
var credentialModel = require('../models/advertiser/credentialModel');

var defualtAgency = '55b774155d883ac41111e0bc';


var typesEnum = {
    'system' : { name: 'system', top: null },    // level 0
    'agency' : { name: 'agency', top: 'system' },// level 1
    'client' : { name: 'client', top: 'agency' } // level 2
};

var advertiser = {
    addAgency: function (agency, parent, credentials, cb) {
        // add agency
        advertiser.add(typesEnum.agency, agency, parent, credentials, cb);
    },
    addClient: function (client, parent, credentials, cb) {
        // add client
        advertiser.add(typesEnum.client, client, parent, credentials, cb);
    },
    addSystem: function (system, credentials, callback) {
        // set in model
        var sys = new advertiserModel(system);
        sys.type = typesEnum.system.name;
        
        sys.save(function (err, obj) {
            if (err) {
                callback(err);
                return;
            }
            else {
                //result['id'] = obj._id;
                console.log("system saved");
                advertiser.addCredential(credentials, obj._id, callback);

            }
        });
    },
    add: function (type, agency, parent, credentials, cb) {
        // validate parent exists
        advertiserModel.findOne({ _id: parent, type: typesEnum[type.top].name }, function (err, parentObj) {
            // if not exists
            if (!parentObj) {
                cb({ err: 'parent ' + typesEnum[type.top].name + ' does not exists' });
                return;
            }
            
            // set in model
            var obj = new advertiserModel(agency);
            obj.type = type.name;
            
            obj.save(function (err, obj) {
                if (err) {
                    cb({ err: err });
                    return;
                }
                else {
                    console.log(type.name + ' saved');
                    advertiser.addCredential(credentials, obj._id, cb);
                    parentObj.childrens.push(obj._id);
                    parentObj.save(function (err) {
                        if (err)
                            console.log('couldnt add children to ' + typesEnum[type.top].name);
                        else
                            console.log('children added to ' + typesEnum[type.top].name);
                    })
                }
            });
        })
    },
    get: function (id, cb) {
        advertiserModel
        .find({'address._id' : '55bdc0fb410c91d80a4eba4a' })
        //.$where(function (id) { 
        //    //console.log('param', param);
        //    return this.address._id == '55bdc0fb410c91d80a4eba4a';
        //})
        //.populate('childrens')
        .exec(function (err, docs) {
            if (err) return cb(err);
            cb(docs);
            // callback result
            //populateRec(docs[0], function (doc) { console.log('populateRec finished', doc); cb(doc); });
        });
    },
    getChildrens: function (id) { 
    
    },
    addChildren: function (id, childId) { 
    
    },
    updateAgency: function (agency) { 
      
    },
    updateClient: function (agency) { 
      
    },
    updateSystem: function (agency) { 
      
    },
    update: function (condition, update) { 
      
    },
    addCredential: function (credentials, advertiserId, callback) {
        
        var cre = new credentialModel(credentials);
        cre.advertiserId = advertiserId;
        cre.save(function (err, obj) {
            if (err) {
                callback(err);
            }
            else {
                console.log("addCredential: system saved");
                console.log(obj);
                callback(obj);
            }
        });
    }
}

module.exports = advertiser;

var isRunning = false;

function populateRec(docs, cb) {
    
    if (docs.childrens.length == 0)
        return;
    
    var i = 0;
    
    while (i < docs.childrens.length) {
        
        if (docs.childrens[i] && !isRunning) {
            console.log('docs.childrens[i]', docs.childrens[i]);
            isRunning = true;
            
            advertiserModel
            .$where(' this._id == \'' + docs.childrens[i].toString() + '\'')
            .exec(function (err, doc) {
                if (err) return cb(err);
                
                // callback result
                console.log('i ', i);
                if (doc.length > 0)
                    populateRec(doc[0], cb);
                
                // If here, recursion is over.
                docs.childrens[i] = doc;
                i++;
                isRunning = false;
            });
        }
        
        if (i == docs.childrens.length)
            cb(docs);

    }

    

}

/*
var conditions = { name: 'borne' }
    , update = { $inc: { visits: 1 } }
    , options = { multi: true };
        
Model.update(conditions, update, options, callback);
 */