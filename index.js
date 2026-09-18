require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS_TOKEN;

// Your custom object's type ID
const OBJECT_TYPE = '2-268626723'; // Horror Book

// ROUTE 1: Homepage — GET all Horror Book records and display them in a table
app.get('/', async (req, res) => {
  const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    'Content-Type': 'application/json'
  };

  const url = `https://api.hubapi.com/crm/v3/objects/${OBJECT_TYPE}?properties=name,author,publication_year`;

  try {
    const resp = await axios.get(url, { headers });
    const books = resp.data.results;
    res.render('homepage', { title: 'Horror Books | Integrating With HubSpot I Practicum', books });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving Horror Book records');
  }
});

// ROUTE 2: Render the form to add a new Horror Book record
app.get('/update-cobj', async (req, res) => {
  res.render('updates', { title: 'Update Custom Object Form | Integrating With HubSpot I Practicum' });
});

// ROUTE 3: Handle form submission — POST a new Horror Book record
app.post('/update-cobj', async (req, res) => {
  const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    'Content-Type': 'application/json'
  };

  const url = `https://api.hubapi.com/crm/v3/objects/${OBJECT_TYPE}`;

  const data = {
    properties: {
      name: req.body.name,
      author: req.body.author,
      publication_year: req.body.publication_year
    }
  };

  try {
    await axios.post(url, data, { headers });
    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error creating Horror Book record');
  }
});

app.listen(3000, () => console.log('Listening on http://localhost:3000'));
