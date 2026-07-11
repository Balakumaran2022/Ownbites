const https = require('https');

const data = JSON.stringify({
  belongsTo: "657193f2f01f221f7cbf7e23",
  outletId: "657193f2f01f221f7cbf7e23"
});

const options = {
  hostname: 'foodie.own-a.com',
  port: 443,
  path: '/api/category/getCategory',
  method: 'POST',
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
    if(json.data && json.data.length > 0 && json.data[0].items && json.data[0].items.length > 0) {
      console.log(JSON.stringify(json.data[0].items[0], null, 2));
    } else {
      console.log("No items found");
    }
  });
});

req.on('error', error => {
  console.error(error);
});

req.write(data);
req.end();
