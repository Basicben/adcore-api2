var mongoose = require('mongoose');

var Schema = mongoose.Schema;


var typesEnum = {
    values: ['system', 'agency', 'client'],
    message: 'enum validation faild for path `{PATH}` with value `{VALUE}'
};

// address
var addressSchema = new Schema({
    address: { type: String },
    zipcode: { type: String },
    country: { type: String, uppercase: true }
});

// advertiser main schema.
var advertiserSchema = new Schema({
    childrens: [{ type: Schema.ObjectId, ref: 'advertiser' }],
    type: { type: String, enum: typesEnum },
    sql_id: { type: Number },
    companyName: { type: String },
    name: { type: String },
    currency: { type: String },
    registredNumber: { type: String },
    website: { type: String, lowercase: true },
    phone: { type: String },
    fax: { type: String },
    address: [addressSchema],
    description: { type: String },
    timezone: { type: String },
    createDate: { type: Date , default: Date.now },
    isActive : { type: Boolean }
});

var credentialSchema = new Schema({
    email: { type: String, lowercase: true, match: [/\S+@\S+\.\S+/, 'invalid email address.'], required: true, unique:true },
    password: { type: String },
    salt: { type: String, required: true, default: 'NoSaLtNoSaLtNoSaLtNoSaLt' },
    advertiserId: { type: mongoose.Schema.ObjectId, ref: 'advertiser' },
    createDate: { type: Date, default: new Date(), required: true }
});

module.exports = {
    credentialSchema: credentialSchema,
    advertiserSchema: advertiserSchema,
}

