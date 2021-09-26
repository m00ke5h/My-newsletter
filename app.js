const { response } = require('express');
const express = require('express');
const app = express();
const https = require('https');
const url = 'https://us5.api.mailchimp.com/3.0/lists/8e58208b21';
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.get('/', (req, res) => {
  res.sendFile(__dirname + "/signup.html")
})

app.post('/', (req, res) => {
  let name = req.body.name;
  let email = req.body.email;

  let data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: name
        }
      }
    ]
  };

  let jsonData = JSON.stringify(data);

  let options = {
    method: "POST",
    auth: "kinetic:41c10cad6aeb6ed84db349b9822165af-us5"
  }

  const request = https.request(url, options, (response) => {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + '/success.html');
    } else {
      res.sendFile(__dirname + '/failure.html');
    }
    
    response.on("data", (data) => {
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);
  request.end();
})

app.post("/failure", (req, res) => {
  res.redirect("/");
})

app.listen(port, () => console.log(`Server is running on port 3000!`))

// API key - 41c10cad6aeb6ed84db349b9822165af-us5
// List ID - 8e58208b21