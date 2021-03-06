/**
 * Created by jordi on 05/08/17.
 */
var frisby = require('frisby');
const Joi = frisby.Joi; // Frisby exposes Joi for convenince
const URL_KEY =  'http://localhost:3000/key';
const KEY_ID_BAD_FORMAT = '12398ue1jdp299034iidjiasldvlkaw8q34';
const KEY_ID_NOT_EXISTS = '9999999d46ed2925ab0594f3';
const VAL_ID_BAD_FORMAT = '12398ue1jdp299034iidjiasldvlkaw8q34';
const VAL_ID_NOT_EXISTS = '9999999d46ed2925ab0594f3';

// Do setup first
frisby.globalSetup({
    request: {
        headers: {
            'Authorization': 'Basic ' + Buffer.from("de1c59dc9a7a3b77856d1476938a8fd6:f9a0ffcb886a89e8526be704006bbd8e").toString('base64'),
            'Content-Type': 'application/json'
        }
    }
});

// Include this line at the beginning of your firsby test. This will direct non-rejection of SSL cert
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
