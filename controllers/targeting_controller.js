var mysql = require('mysql');

module.exports = {
    getAllowedCampaigns(req, res){
        var connection = mysql.createConnection({
            host: 'zyklusdb.ciohag68m4xh.us-east-2.rds.amazonaws.com',
            user: 'zykladmin',
            password: 'zyklus2017!',
            database: 'TST_advertising'
        });
        
        //Check if connection is OK
        connection.connect(function(error) {
            if (error) {
                connection.end();
                console.log('ERROR - Could not connect to the database: ' + error.message);
                res.status(500).send({message: error.message});
            }
        });
        var zipCode = parseInt(req.query['zip_code']);
        var id = req.query['advertiser_campaigns'];
        
        var query = 
            'SELECT\n' + 
            '   id\n' + 
            'FROM\n' +
            '   advertiser_campaigns\n' +
            'WHERE' + 
            '   (id IN (?) AND\n' +
            "   (targeting like '%,?,%' OR targeting like '?,%' OR targeting like '%,?')) OR\n" +
            "   (targeting is null OR targeting = '' OR targeting = 'ALL');";

        var params = [
            id, 
            zipCode, 
            zipCode, 
            zipCode
        ];

        
        connection.query(query, params, function(error, results, fields) {
            //Close connection
            connection.end();
            console.log(query);
            //Internal server error, return 500
            if (error) {
                console.log('ERROR - Problem with provided query: ' + error.message);
                res.status(500).send({message: error.message});
            }
            console.log(results);
            //No records, return 404
            if(results.length == 0){
                console.log('ERROR - No records found');
                res.status(400).send({message: 'ERROR - No records found'});
            } else {
                //Found records
                console.log('OK - Successful query: "' + query + '" with results: ' + results);
                res.status(200).send({'response' : results});
            }
        }); 
    }
};