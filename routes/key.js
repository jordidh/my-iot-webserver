/**
 * Created by jordi on 31/07/17.
 */
var express = require('express');
var router = express.Router();

var url = require('url');
var mongoose = require('mongoose');
var Key = require('../models/Key.js');
var Value = require('../models/Value.js');

var database = require('../api/database');

const GET_DEFAULT_LIMIT = 1000;


//**********************************************************************************************************************
//** KEY FUNCTIONS
//**********************************************************************************************************************


/* GET logs listing query from a JSON object and sorting from a JSON object

 Searching examples:
 http://localhost:3000/log/query?[{name:"find", object:"object"},{name:"sort", object:"object"},{name:"skip", object:"object"},{name:"limit", object:"object"}]
 */
/*
router.get('/query?', function(req, res, next) {
    if (database.isConnected()) {
        var findObj;
        var sortObj;
        var skipObj;
        var limitObj;

        var urlQuery = url.parse(req.url).query;
        var objArray;

        if (urlQuery) {
            //console.log('QUERY = ' + query);
            objArray = JSON.parse(decodeURIComponent(urlQuery));

            //console.log(JSON.stringify(objArray));

            var findObj = objArray.find(o => o.name === "find");
            var sortObj = objArray.find(o => o.name === "sort");
            var skipObj = objArray.find(o => o.name === "skip");
            var limitObj = objArray.find(o => o.name === "limit");

            if (findObj) console.log('findObj = ' + findObj.name);
            if (sortObj) console.log('sortObj = ' + sortObj.name);
            if (skipObj) console.log('skipObj = ' + skipObj.name);
            if (limitObj) console.log('limitObj = ' + limitObj.name);
        }

        // Set the filters of the query
        if (findObj) {
            query = Key.find(findObj.object);
        } else {
            query = Key.find();
        }
        //Documents to skip
        if (skipObj) {
            query.skip(skipObj.object);
        }
        //Documents to get
        if (limitObj) {
            query.limit(limitObj.object);
        }
        // Sort the results
        if (sortObj) {
            query.sort(sortObj.object);
        }
        // Execute the query
        query.exec(function (err, keys) {
            if (err) return next(err);
            res.status(200).json(keys);
        });
    } else {
        //database.connect();
        res.status(500).json('{ error: "Not connected to database"}');
    }
});
*/

/* GET logs listing.

 Searching examples:
 Test 1: Find all logs
 ordered by created_at desc and clientId asc
 get the firs 100 documents
 http://localhost:3000/log?sort={"created_at":-1, "clientId":1}&page=0&per_page=100

 Test 2: Find all logs with item={"data":"data"}, type=Add, __v=0
 ordered by created_at desc and clientId asc
 get the firs 100 documents
 http://localhost:3000/log?item={"data":"data"}&type=Add&__v=0&sort={"created_at":-1, "clientId":1}&page=0&per_page=100

 Sorting examples:
 GET /appLog?sort=-type,action  //retrieves appLogs in descending type order (-) and action in ascending order

 Pagination examples:
 page: from 0 to inf.
 per_page: from 0 to inf.
 GET /appLog?page=0&per_page=100    //Get the first 100 documents
 GET /appLog?page=2&per_page=100    //Get the document 200 to 299
 */
router.get('/', function(req, res, next) {
    //console.log(req.query);
    var findFilter = false;
    var filter = {};
    var query;

    if (database.isConnected()) {

        for (element in req.query) {
            switch (element) {
                case 'sort':
                case 'page':
                case 'per_page':
                    break;
                default:
                    findFilter = true;
                    filter[element] = _urlQueryToJSON(req.query[element]);
                    break;
            }
        }

        // Set the filters of the query
        if (findFilter) {
            query = Key.find(filter);
        } else {
            query = Key.find();
        }
        // Limit results and paginate
        if (req.query['page']) {
            if (req.query['per_page']) {
                query.skip(req.query['page'] * req.query['per_page']);  //Documents to skip
            } else {
                query.skip(req.query['page']);                          //Documents to skip
            }
        }
        //Documents to get
        if (req.query['per_page']) {
            query.limit(parseInt(req.query['per_page']));
        } else {
            //Set a default limit to avoid user errors and crash mongodb with an excess of data
            query.limit(parseInt(GET_DEFAULT_LIMIT));
        }
        // Sort the results
        if (req.query['sort']) {
            var jsonSort = JSON.parse(req.query['sort']);
            query.sort(jsonSort);
        }
        // Execute the query
        query.exec(function (err, logs) {
            if (err) return next(err);
            res.status(200).json(logs);
        });
    } else {
        //database.connect();
        res.status(500).json('{ error: "Not connected to database"}');
    }
});

/* GET /key/id */
router.get('/:id', function(req, res, next) {

    if (database.isConnected()) {
        Key.findById(req.params.id, function (err, post) {
            if (err) {
                return next(err);
            }
            if (post) {
                res.status(200).json(post);
            } else {
                res.status(404).json('{ error: "key id not found"}');
            }
        });
    } else {
        //database.connect();
        res.status(500).json('{ error: "Not connected to database"}');
    }
});

/* POST /key */
router.post('/', function(req, res, next) {

    try {
        //console.log(JSON.stringify(req.body));
        if (database.isConnected()) {
            Key.create(req.body, function (err, post) {
                if (err) return next(err);
                res.status(201).json(post);
            });
        } else {
            //database.connect();
            res.status(500).json('{ error: "Not connected to database"}');
        }
    } catch (e) {
        res.status(500).json('{ error: ' + e.message + '}');
    }
});

/* PUT /key/:id */
router.put('/:id', function(req, res, next) {

    if (database.isConnected()) {
        //Using option new = true to return the modified object rather than the original. Defaults to false.
        Key.findByIdAndUpdate(req.params.id, req.body, {new: true}, function (err, post) {
            if (err) return next(err);
            if (post) {
                res.status(200).json(post);
            } else {
                res.status(404).json('{ error: "key id not found"}');
            }
        });
    } else {
        //database.connect();
        res.status(500).json('{ error: "Not connected to database"}');
    }
});

/* DELETE /key/:id */
router.delete('/:id', function(req, res, next) {

    if (database.isConnected()) {
        Key.findByIdAndRemove(req.params.id, req.body, function (err, post) {
            if (err) return next(err);
            if (post) {
                res.status(200).json(post);
            } else {
                res.status(404).json('{ error: "key id not found"}');
            }
        });
    } else {
        //database.connect();
        res.status(500).json('{ error: "Not connected to database"}');
    }
});



//**********************************************************************************************************************
//** KEY-VALUE FUNCTIONS
//**********************************************************************************************************************

/* GET /key/id/value */
router.get('/:keyId/value', function(req, res, next) {
    //console.log(req.query);
    var query;

    if (database.isConnected()) {
        Key.findById(req.params.keyId, function (err, key) {
            if (err) {
                return next(err);
            }
            if (key) {
                // Set the filters of the query
                query = Key.find('parentKey="' + req.params.keyId + '"');
                // Sort the results
                query.sort('{"timestamp":-1}');
                // Execute the query
                query.exec(function (err, values) {
                    if (err) return next(err);
                    ret = {
                        _id: key._id,
                        __v: key.__v,
                        name: key.name,
                        description: key.description,
                        unit: key.unit,
                        parentKey: key.parentKey,
                        createdAt: key.createdAt,
                        value: values
                    };
                    res.status(200).json(ret);
                });
            } else {
                res.status(404).json('{ error: "key id not found"}');
            }
        });
    } else {
        //database.connect();
        res.status(500).json('{ error: "Not connected to database"}');
    }
});

/* GET /key/id/value/id */
router.get('/:keyId/value/:id', function(req, res, next) {
    if (database.isConnected()) {
        Key.findById(req.params.keyId, function (err, key) {
            if (err) {
                return next(err);
            }
            if (key) {
                Value.findById(req.params.id, function (err, value) {
                    if (err) {
                        return next(err);
                    }
                    if (value) {
                        ret = {
                            _id: key._id,
                            __v: key.__v,
                            name: key.name,
                            description: key.description,
                            unit: key.unit,
                            parentKey: key.parentKey,
                            createdAt: key.createdAt,
                            value: value
                        };
                        res.status(200).json(ret);
                    } else {
                        res.status(404).json('{ error: "value id not found"}');
                    }
                });
            } else {
                res.status(404).json('{ error: "key id not found"}');
            }
        });
    } else {
        //database.connect();
        res.status(500).json('{ error: "Not connected to database"}');
    }
});

/* POST /key/id/value */
router.post('/:keyId/value', function(req, res, next) {
    try {
        if (database.isConnected()) {
            Key.findById(req.params.keyId, function (err, key) {
                if (err) {
                    return next(err);
                }
                if (key) {

                    //console.log(req.body);
                    if (!req.body.parentKey) {
                        req.body.parentKey = req.params.keyId;
                    }

                    Value.create(req.body, function (err, post) {
                        if (err) return next(err);
                        res.status(201).json(post);
                    });
                } else {
                    res.status(404).json('{ error: "key id not found"}');
                }
            });
        } else {
            //database.connect();
            res.status(500).json('{ error: "Not connected to database"}');
        }
    } catch (e) {
        res.status(500).json('{ error: ' + e.message + '}');
    }
});

/* PUT /key/id/value/id */
router.put('/:keyId/value/:id', function(req, res, next) {
    if (database.isConnected()) {
        Key.findById(req.params.keyId, function (err, key) {
            if (err) {
                return next(err);
            }
            if (key) {
                //Using option new = true to return the modified object rather than the original. Defaults to false.
                Value.findByIdAndUpdate(req.params.id, req.body, {new: true}, function (err, value) {
                    if (err) return next(err);
                    if (value) {
                        res.status(200).json(value);
                    } else {
                        res.status(404).json('{ error: "value id not found"}');
                    }
                });
            } else {
                res.status(404).json('{ error: "key id not found"}');
            }
        });
    } else {
        //database.connect();
        res.status(500).json('{ error: "Not connected to database"}');
    }
});

/* DELETE /key/id/value/id */
router.delete('/:keyId/value/:id', function(req, res, next) {
    if (database.isConnected()) {
        Key.findById(req.params.keyId, function (err, key) {
            if (err) {
                return next(err);
            }
            if (key) {
                Value.findByIdAndRemove(req.params.id, req.body, function (err, post) {
                    if (err) return next(err);
                    if (post) {
                        res.status(200).json(post);
                    } else {
                        res.status(404).json('{ error: "value id not found"}');
                    }
                });
            } else {
                res.status(404).json('{ error: "key id not found"}');
            }
        });
    } else {
        //database.connect();
        res.status(500).json('{ error: "Not connected to database"}');
    }
});

//**********************************************************************************************************************
//** AUXILIARY FUNCTIONS
//**********************************************************************************************************************

function _isJSON(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
};


var _urlQueryToJSON = function(value) {
    if (_isJSON(value)) {
        return JSON.parse(value);
    } else {
        return value;
    }
};

module.exports = router;
