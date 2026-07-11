const https = require('https');

const data = JSON.stringify({
  belongsTo: "657193f2f01f221f7cbf7e23",
  lat: 10.777,
  lng: 79.634,
  locationSorting: true
});

const options = {
  hostname: 'foodie.own-a.com',
  port: 443,
  path: '/api/organization/outlets/get-all',
  method: 'POST',
  rejectUnauthorized: false,
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = https.request(options, res => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => {
    const json = JSON.parse(body);
    if(json.data && json.data.outlets && json.data.outlets.length > 0) {
      console.log(JSON.stringify(json.data.outlets[0], null, 2));
    } else {
      console.log("No outlets found");
    }
  });
});

req.on('error', error => {
  console.error(error);
});

req.write(data);
req.end();
