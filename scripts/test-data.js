// To execute the script:
// $ mongo localhost/iot-ws ./test-data.js

//drop the database
print('Dropping database ...');
db.dropDatabase();
print('* Database dropped');

//create the keys collection and add documents to it
print('Creating keys ...');
db.keys.insert({'name' : 'my-iot-project', 'description' : 'My custom IOT project', 'createdAt' : 'ISODate("2017-12-18T10:00:00.000Z")' });
db.keys.insert({'name' : 'my-weather-station', 'description' : 'My custom weather station', 'parentKey' : 'my-iot-project', 'createdAt' : 'ISODate("2017-12-18T10:00:10.000Z")'});
db.keys.insert({'name' : 'outdoor-station', 'description' : 'Outdoor station for my custom weather station', 'parentKey' : 'my-weather-station', 'createdAt' : 'ISODate("2017-12-18T10:00:20.000Z")'});
db.keys.insert({'name' : 'outdoor-station-temperature', 'description' : 'temperature', 'unit' : { 'code' : 'ºC', 'description' : 'Degree Celsius' }, 'parentKey' : 'outdoor-station', 'createdAt' : 'ISODate("2017-12-18T10:00:30.000Z")'});
db.keys.insert({'name' : 'outdoor-station-pressure', 'description' : 'pressure', 'unit' : { 'code' : 'mmHg', 'description' : 'millimeters of mercury' }, 'parentKey' : 'outdoor-station', 'createdAt' : 'ISODate("2017-12-18T10:00:40.000Z")'});

db.keys.createIndex( { 'createdAt' : -1 } );

//set a reference to all documents in the database
allKeys = db.keys.find();

//iterate the names collection and output each document
while (allKeys.hasNext()) {
    printjson(allKeys.next());
}

//create the values collections
print('Creating values ...');
db.values.insert({'value' : '1000', 'parentKey' : 'outdoor-station-pressure', 'timeStamp' : 'ISODate("2017-12-18T10:00:00.000Z")', 'createdAt' : 'ISODate("2017-12-18T10:00:00.000Z")' });
db.values.insert({'value' : '1001', 'parentKey' : 'outdoor-station-pressure', 'timeStamp' : 'ISODate("2017-12-18T10:10:00.000Z")', 'createdAt' : 'ISODate("2017-12-18T10:00:00.001Z")' });
db.values.insert({'value' : '1002', 'parentKey' : 'outdoor-station-pressure', 'timeStamp' : 'ISODate("2017-12-18T10:20:00.000Z")', 'createdAt' : 'ISODate("2017-12-18T10:00:00.002Z")' });
db.values.insert({'value' : '1003', 'parentKey' : 'outdoor-station-pressure', 'timeStamp' : 'ISODate("2017-12-18T10:30:00.000Z")', 'createdAt' : 'ISODate("2017-12-18T10:00:00.003Z")' });
db.values.insert({'value' : '1004', 'parentKey' : 'outdoor-station-pressure', 'timeStamp' : 'ISODate("2017-12-18T10:40:00.000Z")', 'createdAt' : 'ISODate("2017-12-18T10:00:00.004Z")' });
db.values.insert({'value' : '1005', 'parentKey' : 'outdoor-station-pressure', 'timeStamp' : 'ISODate("2017-12-18T10:50:00.000Z")', 'createdAt' : 'ISODate("2017-12-18T10:00:00.005Z")' });
db.values.insert({'value' : '1006', 'parentKey' : 'outdoor-station-pressure', 'timeStamp' : 'ISODate("2017-12-18T11:00:00.000Z")', 'createdAt' : 'ISODate("2017-12-18T10:00:00.006Z")' });
db.values.insert({'value' : '1007', 'parentKey' : 'outdoor-station-pressure', 'timeStamp' : 'ISODate("2017-12-18T11:10:00.000Z")', 'createdAt' : 'ISODate("2017-12-18T10:00:00.007Z")' });
db.values.insert({'value' : '1008', 'parentKey' : 'outdoor-station-pressure', 'timeStamp' : 'ISODate("2017-12-18T11:20:00.000Z")', 'createdAt' : 'ISODate("2017-12-18T10:00:00.008Z")' });
db.values.insert({'value' : '1009', 'parentKey' : 'outdoor-station-pressure', 'timeStamp' : 'ISODate("2017-12-18T11:30:00.000Z")', 'createdAt' : 'ISODate("2017-12-18T10:00:00.009Z")' });

db.values.insert({'value' : '20', 'parentKey' : 'outdoor-station-temperature', 'timeStamp' : 'ISODate("2017-12-18T10:00:00.000Z")', 'createdAt' : 'ISODate("2017-12-18T10:00:00.000Z")' });
db.values.insert({'value' : '21', 'parentKey' : 'outdoor-station-temperature', 'timeStamp' : 'ISODate("2017-12-18T10:10:00.000Z")', 'createdAt' : 'ISODate("2017-12-18T10:00:00.001Z")' });
db.values.insert({'value' : '22', 'parentKey' : 'outdoor-station-temperature', 'timeStamp' : 'ISODate("2017-12-18T10:20:00.000Z")', 'createdAt' : 'ISODate("2017-12-18T10:00:00.002Z")' });
db.values.insert({'value' : '23', 'parentKey' : 'outdoor-station-temperature', 'timeStamp' : 'ISODate("2017-12-18T10:30:00.000Z")', 'createdAt' : 'ISODate("2017-12-18T10:00:00.003Z")' });
db.values.insert({'value' : '24', 'parentKey' : 'outdoor-station-temperature', 'timeStamp' : 'ISODate("2017-12-18T10:40:00.000Z")', 'createdAt' : 'ISODate("2017-12-18T10:00:00.004Z")' });
db.values.insert({'value' : '23', 'parentKey' : 'outdoor-station-temperature', 'timeStamp' : 'ISODate("2017-12-18T10:50:00.000Z")', 'createdAt' : 'ISODate("2017-12-18T10:00:00.005Z")' });
db.values.insert({'value' : '22', 'parentKey' : 'outdoor-station-temperature', 'timeStamp' : 'ISODate("2017-12-18T11:00:00.000Z")', 'createdAt' : 'ISODate("2017-12-18T10:00:00.006Z")' });
db.values.insert({'value' : '21', 'parentKey' : 'outdoor-station-temperature', 'timeStamp' : 'ISODate("2017-12-18T11:10:00.000Z")', 'createdAt' : 'ISODate("2017-12-18T10:00:00.007Z")' });
db.values.insert({'value' : '22', 'parentKey' : 'outdoor-station-temperature', 'timeStamp' : 'ISODate("2017-12-18T11:20:00.000Z")', 'createdAt' : 'ISODate("2017-12-18T10:00:00.008Z")' });
db.values.insert({'value' : '23', 'parentKey' : 'outdoor-station-temperature', 'timeStamp' : 'ISODate("2017-12-18T11:30:00.000Z")', 'createdAt' : 'ISODate("2017-12-18T10:00:00.009Z")' });

db.keys.createIndex( { 'timeSpan' : -1 } );

//set a reference to all documents in the database
allValues = db.values.find();

//iterate the names collection and output each document
while (allValues.hasNext()) {
    printjson(allValues.next());
}