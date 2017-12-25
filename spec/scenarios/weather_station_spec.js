/**
 * Created by jordi on 25/12/17.
 *
 * Important: This tests require test data. First run script "/scripts/test-data.js"
 */
var frisby = require('frisby');
const Joi = frisby.Joi; // Frisby exposes Joi for convenince
const URL_KEY =  'https://localhost:3000/key';

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

