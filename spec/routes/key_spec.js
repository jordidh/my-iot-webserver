/**
 * Created by jordi on 01/08/17.
 */
var frisby = require('frisby');
const Joi = frisby.Joi; // Frisby exposes Joi for convenince
const URL_KEY =  'https://localhost:3000/key';
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

describe('Gets', function () {
    it('should get all the keys if the id is not specified in the URL', function (done) {
        frisby.get(URL_KEY)
            .expect('status', 200)
            .expect('header', 'content-type', 'application/json; charset=utf-8')
            .done(done)
    });
    it('should return 500 if key id has an invalid format', function (done) {
        frisby.get(URL_KEY + '/' + KEY_ID_BAD_FORMAT)
            .expect('status', 500)
            .expect('header', 'content-type', 'text/html; charset=utf-8')
            .done(done)
    });
    it('should return 404 if key id does not exists', function (done) {
        frisby.get(URL_KEY + '/' + KEY_ID_NOT_EXISTS)
            //.inspectJSON()
            .expect('status', 404)
            .expect('header', 'content-type', 'application/json; charset=utf-8')
            .done(done)
    });
});

describe('Posts that return error', function () {
    //TODO
});

describe('Puts that return error', function () {
    it('should return 500 if key id has an invalid format', function (done) {
        frisby.put(URL_KEY + '/' + KEY_ID_BAD_FORMAT, {
            name: "testKeyName2",
            description: "testKeyDescription2",
            unit: {
                code: "testKeyUnitCode2",
                description: "testKeyUnitDescription2"
            },
            parentKey: "testKeyParentKey2"
        }, {json: true})
            .expect('status', 500)
            .expect('header', 'content-type', 'text/html; charset=utf-8')
            .done(done)
    });
    it('should return 404 if key id does not exists', function (done) {
        frisby.put(URL_KEY + '/' + KEY_ID_NOT_EXISTS, {
            name: "testKeyName2",
            description: "testKeyDescription2",
            unit: {
                code: "testKeyUnitCode2",
                description: "testKeyUnitDescription2"
            },
            parentKey: "testKeyParentKey2"
        }, {json: true})
            //.inspectJSON()
            .expect('status', 404)
            .expect('header', 'content-type', 'application/json; charset=utf-8')
            .done(done)
    });
});

describe('Deletes that return error', function () {
    it('should return 500 if key id has an invalid format', function (done) {
        frisby.del(URL_KEY + '/' + KEY_ID_BAD_FORMAT)
            .expect('status', 500)
            .expect('header', 'content-type', 'text/html; charset=utf-8')
            .done(done)
    });
    it('should return 404 if key id does not exists', function (done) {
        frisby.del(URL_KEY + '/' + KEY_ID_NOT_EXISTS)
            //.inspectJSON()
            .expect('status', 404)
            .expect('header', 'content-type', 'application/json; charset=utf-8')
            .done(done)
    });
});

describe('Posts a key successfully', function () {
    it('should create a key specifying all the required data, including parent key', function (done) {
        frisby.post(URL_KEY, {
            name: "testKeyName",
            description: "testKeyDescription",
            unit: {
                code: "testKeyUnitCode",
                description: "testKeyUnitDescription"
            },
            parentKey: "testKeyParentKey"
        }, {json: true})
            .expect('status', 201)
            .expect('header', 'content-type', 'application/json; charset=utf-8')
            //.inspectJSON()
            .expect('jsonTypes', {
                __v: Joi.number(),
                _id: Joi.string(),
                name: Joi.string(),
                description: Joi.string(),
                unit: {
                    code: Joi.string(),
                    description: Joi.string(),
                },
                parentKey: Joi.string(),
                createdAt: Joi.date()
            })
            .expect('json', {
                name: "testKeyName",
                description: "testKeyDescription",
                unit: {
                    code: "testKeyUnitCode",
                    description: "testKeyUnitDescription"
                },
                parentKey: "testKeyParentKey"
            })
            .then(function (res) { // res = FrisbyResponse object
                //console.log(res.json);
                let postId = res.json._id;

                // Get first post's comments
                // RETURN the FrisbySpec object so the 'done' function waits on it to finish - just like a Promise chain
                return frisby.get(URL_KEY + '/' + postId)
                    .expect('status', 200)
                    .expect('header', 'content-type', 'application/json; charset=utf-8')
                    //.inspectJSON()
                    .expect('json', {
                        _id: postId,
                        name: "testKeyName",
                        description: "testKeyDescription",
                        unit: {
                            code: "testKeyUnitCode",
                            description: "testKeyUnitDescription"
                        },
                        parentKey: "testKeyParentKey"
                    });
            })
            .done(done)
    });
    it('should create a key specifying all the required data, without parent key', function (done) {
        frisby.post(URL_KEY, {
            name: "testKeyName",
            description: "testKeyDescription",
            unit: {
                code: "testKeyUnitCode",
                description: "testKeyUnitDescription"
            }
            //,parentKey: "afdads"
        }, {json: true})
            .expect('status', 201)
            .expect('header', 'content-type', 'application/json; charset=utf-8')
            //.inspectJSON()
            .expect('jsonTypes', {
                __v: Joi.number(),
                _id: Joi.string(),
                name: Joi.string(),
                description: Joi.string(),
                unit: {
                    code: Joi.string(),
                    description: Joi.string(),
                },
                //parentKey:
                createdAt: Joi.date()
            })
            .expect('json', {
                name: "testKeyName",
                description: "testKeyDescription",
                unit: {
                    code: "testKeyUnitCode",
                    description: "testKeyUnitDescription"
                },
                parentKey: ""
            })
            .then(function (res) { // res = FrisbyResponse object
                //console.log(res.json);
                let postId = res.json._id;

                // Get first post's comments
                // RETURN the FrisbySpec object so the 'done' function waits on it to finish - just like a Promise chain
                return frisby.get(URL_KEY + '/' + postId)
                    .expect('status', 200)
                    .expect('header', 'content-type', 'application/json; charset=utf-8')
                    //.inspectJSON()
                    .expect('json', {
                        _id: postId,
                        name: "testKeyName",
                        description: "testKeyDescription",
                        unit: {
                            code: "testKeyUnitCode",
                            description: "testKeyUnitDescription"
                        },
                        parentKey: ""
                    });
            })
            .done(done)
    });
    it('should create a key omitting data', function (done) {
        frisby.post(URL_KEY, {
            }, {json: true})
            .expect('status', 201)
            .expect('header', 'content-type', 'application/json; charset=utf-8')
            //.inspectJSON()
            .expect('jsonTypes', {
                __v: Joi.number(),
                _id: Joi.string(),
                //name: Joi.string(),
                //description: Joi.string(),
                //unit: {
                //    code: Joi.string(),
                //    description: Joi.string(),
                //},
                //parentKey: Joi.string(),
                createdAt: Joi.date()
            })
            .expect('json', {
                name: "",
                description: "",
                unit: {
                    code: "",
                    description: "",
                },
                parentKey: ""
            })
            .then(function (res) { // res = FrisbyResponse object
                //console.log(res.json);
                let postId = res.json._id;

                // Get first post's comments
                // RETURN the FrisbySpec object so the 'done' function waits on it to finish - just like a Promise chain
                return frisby.get(URL_KEY + '/' + postId)
                    .expect('status', 200)
                    .expect('header', 'content-type', 'application/json; charset=utf-8')
                    //.inspectJSON()
                    .expect('json', {
                        _id: postId,
                        name: "",
                        description: "",
                        unit: {
                            code: "",
                            description: ""
                        },
                        parentKey: ""
                    });
            })
        .done(done)
    });
});

describe('Posts and put a key successfully', function () {
    it('should create a key and then modify', function (done) {
        frisby.post(URL_KEY, {
            name: "testKeyName",
            description: "testKeyDescription",
            unit: {
                code: "testKeyUnitCode",
                description: "testKeyUnitDescription"
            },
            parentKey: "testKeyParentKey"
        }, {json: true})
            .expect('status', 201)
            .expect('header', 'content-type', 'application/json; charset=utf-8')
            //.inspectJSON()
            .then(function (res) {
                //console.log(res.json);
                let postId = res.json._id;

                // Get first post's comments
                // RETURN the FrisbySpec object so the 'done' function waits on it to finish - just like a Promise chain
                return frisby.put(URL_KEY + '/' + postId, {
                    name: "testKeyName2",
                    description: "testKeyDescription2",
                    unit: {
                        code: "testKeyUnitCode2",
                        description: "testKeyUnitDescription2"
                    },
                    parentKey: "testKeyParentKey2"
                }, {json: true})
                    .expect('status', 200)
                    .expect('header', 'content-type', 'application/json; charset=utf-8')
                    //.inspectJSON()
                    .expect('json', {
                        _id: postId,
                        name: "testKeyName2",
                        description: "testKeyDescription2",
                        unit: {
                            code: "testKeyUnitCode2",
                            description: "testKeyUnitDescription2"
                        },
                        parentKey: "testKeyParentKey2"
                    })
            })
            .done(done)
    });
});

describe('Post and delete a key successfully', function () {
    it('should create a key and then delete', function (done) {
        frisby.post(URL_KEY, {
            name: "testKeyName",
            description: "testKeyDescription",
            unit: {
                code: "testKeyUnitCode",
                description: "testKeyUnitDescription"
            },
            parentKey: "testKeyParentKey"
        }, {json: true})
            .expect('status', 201)
            .expect('header', 'content-type', 'application/json; charset=utf-8')
            //.inspectJSON()
            .then(function (res) {
                //console.log(res.json);
                let postId = res.json._id;

                // Get first post's comments
                // RETURN the FrisbySpec object so the 'done' function waits on it to finish - just like a Promise chain
                return frisby.del(URL_KEY + '/' + postId)
                    .expect('status', 200)
                    .expect('header', 'content-type', 'application/json; charset=utf-8')
                    .then(function (res) {
                        return frisby.get(URL_KEY + '/' + postId)
                            .expect('status', 404)
                            .expect('header', 'content-type', 'application/json; charset=utf-8')
                    })
            })
        .done(done)
    })
});



//**********************************************************************************************************************
//** KEY-VALUE TEST FUNCTIONS
//**********************************************************************************************************************

describe('Gets with keys that does not exist', function () {
    it('should return 404 if key id does not exists', function (done) {
        frisby.get(URL_KEY + '/' + KEY_ID_NOT_EXISTS + '/value')
            .expect('status', 404)
            .expect('header', 'content-type', 'application/json; charset=utf-8')
            .done(done)
    });
    it('should return 404 if key id and the value do not exists', function (done) {
        frisby.get(URL_KEY + '/' + KEY_ID_NOT_EXISTS + '/value/' + VAL_ID_NOT_EXISTS)
        //.inspectJSON()
            .expect('status', 404)
            .expect('header', 'content-type', 'application/json; charset=utf-8')
            .done(done)
    });
});

describe('Posts that return error with keys that does not exist', function () {
    //TODO
});

describe('Puts that return error with keys and values that does not exist', function () {
    it('should return 404 if key id and the value do not exists', function (done) {
        frisby.put(URL_KEY + '/' + KEY_ID_NOT_EXISTS + '/value/' + VAL_ID_NOT_EXISTS, {
            name: "testKeyName2",
            description: "testKeyDescription2",
            unit: {
                code: "testKeyUnitCode2",
                description: "testKeyUnitDescription2"
            },
            parentKey: "testKeyParentKey2"
        }, {json: true})
        //.inspectJSON()
            .expect('status', 404)
            .expect('header', 'content-type', 'application/json; charset=utf-8')
            .done(done)
    });
});

describe('Deletes that return error with keys that does not exist', function () {
    it('should return 404 if key id does not exists', function (done) {
        frisby.del(URL_KEY + '/' + KEY_ID_NOT_EXISTS + '/value/' + VAL_ID_NOT_EXISTS)
        //.inspectJSON()
            .expect('status', 404)
            .expect('header', 'content-type', 'application/json; charset=utf-8')
            .done(done)
    });
});

describe('Post a key with value successfully', function () {
    it('should create a key with a value', function (done) {
        frisby.post(URL_KEY, {
            name: "testKeyName",
            description: "testKeyDescription",
            unit: {
                code: "testKeyUnitCode",
                description: "testKeyUnitDescription"
            },
            parentKey: "testKeyParentKey"
        }, {json: true})
            .expect('status', 201)
            .expect('header', 'content-type', 'application/json; charset=utf-8')
            //.inspectJSON()
            .then(function (res) {
                //console.log(res.json);
                let postKeyId = res.json._id;

                // Get first post's comments
                // RETURN the FrisbySpec object so the 'done' function waits on it to finish - just like a Promise chain
                return frisby.post(URL_KEY + '/' + postKeyId + '/value', {
                    value: "12345"
                }, {json: true})
                    .expect('status', 201)
                    .expect('header', 'content-type', 'application/json; charset=utf-8')
                    .expect('json', {
                        value: "12345",
                        parentKey: postKeyId
                    });
            })
            .done(done)
    })
});

describe('Post a key with value and update successfully', function () {
    it('should create a key with a value and update the value', function (done) {
        frisby.post(URL_KEY, {
            name: "testKeyName",
            description: "testKeyDescription",
            unit: {
                code: "testKeyUnitCode",
                description: "testKeyUnitDescription"
            },
            parentKey: "testKeyParentKey"
        }, {json: true})
            .expect('status', 201)
            .expect('header', 'content-type', 'application/json; charset=utf-8')
            //.inspectJSON()
            .then(function (res) {
                //console.log(res.json);
                let postKeyId = res.json._id;

                // Get first post's comments
                // RETURN the FrisbySpec object so the 'done' function waits on it to finish - just like a Promise chain
                return frisby.post(URL_KEY + '/' + postKeyId + '/value', {
                    value: "12345"
                }, {json: true})
                    .expect('status', 201)
                    .expect('header', 'content-type', 'application/json; charset=utf-8')
                    .expect('json', {
                        value: "12345",
                        parentKey: postKeyId
                    })
                    .then(function (res) {
                        let postValueId = res.json._id;

                        return frisby.put(URL_KEY + '/' + postKeyId + '/value/' + postValueId, {
                            value: "54321"
                            }, {json: true})
                            .expect('status', 200)
                            .expect('header', 'content-type', 'application/json; charset=utf-8')
                            .expect('json', {
                                value: "54321",
                                parentKey: postKeyId
                            });
                    })
            })
            .done(done)
    })
});

describe('Post a key with value and delete successfully', function () {
    it('should create a key with a value and delete the value', function (done) {
        frisby.post(URL_KEY, {
            name: "testKeyName",
            description: "testKeyDescription",
            unit: {
                code: "testKeyUnitCode",
                description: "testKeyUnitDescription"
            },
            parentKey: "testKeyParentKey"
        }, {json: true})
            .expect('status', 201)
            .expect('header', 'content-type', 'application/json; charset=utf-8')
            //.inspectJSON()
            .then(function (res) {
                //console.log(res.json);
                let postKeyId = res.json._id;

                // Get first post's comments
                // RETURN the FrisbySpec object so the 'done' function waits on it to finish - just like a Promise chain
                return frisby.post(URL_KEY + '/' + postKeyId + '/value', {
                    value: "12345"
                }, {json: true})
                    .expect('status', 201)
                    .expect('header', 'content-type', 'application/json; charset=utf-8')
                    .expect('json', {
                        value: "12345",
                        parentKey: postKeyId
                    })
                    .then(function (res) {
                        let postValueId = res.json._id;

                        return frisby.del(URL_KEY + '/' + postKeyId + '/value/' + postValueId)
                            .expect('status', 200)
                            .expect('header', 'content-type', 'application/json; charset=utf-8');
                    })
            })
            .done(done)
    })
});

describe('Post a key with value and get successfully', function () {
    it('should create a key with a value and get the value', function (done) {
        frisby.post(URL_KEY, {
            name: "testKeyName",
            description: "testKeyDescription",
            unit: {
                code: "testKeyUnitCode",
                description: "testKeyUnitDescription"
            },
            parentKey: "testKeyParentKey"
        }, {json: true})
            .expect('status', 201)
            .expect('header', 'content-type', 'application/json; charset=utf-8')
            //.inspectJSON()
            .then(function (res) {
                //console.log(res.json);
                let postKeyId = res.json._id;

                // Get first post's comments
                // RETURN the FrisbySpec object so the 'done' function waits on it to finish - just like a Promise chain
                return frisby.post(URL_KEY + '/' + postKeyId + '/value', {
                    value: "12345"
                }, {json: true})
                    .expect('status', 201)
                    .expect('header', 'content-type', 'application/json; charset=utf-8')
                    .expect('json', {
                        value: "12345",
                        parentKey: postKeyId
                    })
                    .then(function (res) {
                        let postValueId = res.json._id;

                        return frisby.get(URL_KEY + '/' + postKeyId + '/value/' + postValueId)
                            .expect('status', 200)
                            .expect('header', 'content-type', 'application/json; charset=utf-8')
                            //.inspectJSON()
                            .expect('json', {
                                _id: postKeyId,
                                name: "testKeyName",
                                description: "testKeyDescription",
                                unit: {
                                    code: "testKeyUnitCode",
                                    description: "testKeyUnitDescription"
                                },
                                parentKey: "testKeyParentKey",
                                value: {
                                    value: "12345",
                                    parentKey: postKeyId
                                }
                            });
                    })
            })
            .done(done)
    })
});