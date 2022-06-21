const router = require('express').Router();
const { render, json } = require('express/lib/response');
const { Plant, User, PlantsSaved, Zone } = require('../models');
const withAuth = require('../utils/auth');
const path = require('path');
const { request } = require('http');
const zoneLookup = require('./api/apicall');

router.get('/', async (req, res) => {
  try {
    res.sendFile(path.join(__dirname, '../views/login.html'));
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/results', async (req, res) => {
  try {
    const userid = req.session.user_id;
    const zip_code = req.session.zipcode;
    const userData = await User.findByPk(userid);
    console.log('++++++++++++++');
    console.table({ userid, zip_code });
    console.log('===============');

    const hz = await zoneLookup(zip_code);

    const zones = await Zone.findAll({
      where: {
        zone_id: hz,
      },
    });

    const plant_ids = [];
    zones.forEach((zone) => {
      plant_ids.push(zone.plant_id);
    });

    const plants = [];
    plant_ids.forEach(async (id) => {
      const plant = await Plant.findByPk(id);
      plants.push(plant);
    });

    res.render('results', {
      layout: 'index',
      // DATA NEEDS TO GO HERE
      resultsArray: [
        { name: 'Amaranthus caudatus' },
        { name: 'Zinnia Elegans' },
      ],
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/results/:hz', async (req, res) => {
  try {
    //console.log()
    // const userData = await User.findByPk(
    //   req.session.user_id

    Zone.findAll({
      where: {
        zone_id: (req, param.hz),
      },
    });

    console.log('++++++++++++++');
    console.table(req.user);
    console.log('===============');

    res.render('results', {
      message: 'Hello',
      user: req.user,

      // DATA NEEDS TO GO HERE
      //  userData
    });
  } catch (err) {
    res.status(500).json(err);
  }
});
// let zipcode = 80123 // req.session.zipcode || 80123
//     const options = {
//       method: 'GET',
//       url: `https://usda-plant-hardiness-zones.p.rapidapi.com/zone/${zipcode}`,
//       headers: {
//         'X-RapidAPI-Host': 'usda-plant-hardiness-zones.p.rapidapi.com',
//         'X-RapidAPI-Key': 'bf6c21b426msh0cd3146563ed98bp1607b3jsn6fa55e43e23c'
//       }
//     };
//     axios.request(options).then(function (response) {
//       console.log(response.data);
//     }).catch(function (error) {
//       console.error(error);
//     });
// });

router.get('/favorites', async (req, res) => {
  try {
    res.render('favorites', {
      layout: 'index',
      // DATA NEEDS TO GO HERE
      resultsArray: [{ plant_name: 'Fern' }, { plant_name: 'Zzz Plant' }],
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/login', async (req, res) => {
  try {
    res.render('login', {
      layout: 'index',
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/home', async (req, res) => {
  try {
    res.render('home', {
      layout: 'index',
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/register', async (req, res) => {
  try {
    res.render('register', {
      layout: 'index',
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
