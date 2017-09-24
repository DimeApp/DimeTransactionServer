import {Router} from 'express';
import facets from './facets';
var http = require('http');
var querystring = require('querystring');

export default({config, db}) => {
  let api = Router();

  // mount the facets resource
  api.use('/facets', facets({config, db}));

  // perhaps expose some API metadata at the root
  api.get('/', (req, res) => {
    res.send("sup mama nature!");
  });

  api.post('/processTransaction', (req, res) => {
    const itemId = req.param('item_id');

    const postData = querystring.stringify({'item_id': itemId});

    const options = {
      hostname: 'localhost',
      port: 5000,
      path: '/parse/functions/process_transaction',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'x-parse-master-key': '45ba92cc-f659-4a2b-adb4-ae2168447a23',
        'x-parse-application-id': "11011011"
      }
    };

    const request = http.request(options, (res) => {
      console.log(`STATUS: ${res.statusCode}`);
      console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
      res.setEncoding('utf8');
      res.on('data', (chunk) => {
        console.log(`BODY: ${chunk}`);
      });
      res.on('end', () => {
        console.log('No more data in response.');
      });
    });

    request.on('error', (e) => {
      res.send(`problem with request: ${e.message}`);
    });

    // write data to request body
    request.write(postData);
    request.end();

  })

  return api;
}