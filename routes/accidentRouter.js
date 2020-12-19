const { Router } = require("express");
const Accident = require("../models/Accident.js");
const router = new Router();

router.route("/").get(getAccidents);

router.get("/models", async function (req, res, next) {
  let models;
  try {
    models = await Accident.distinct("Model").exec();
  } catch (err) {
    console.error(err);
  }
  res.status(200).json(models);
});

router.get("/models/:model", async function (req, res) {
  const { model } = req.params;
  let allModels;
  let models = [];
  try {
    allModels = await Accident.distinct("Model").exec();
    allModels.forEach((m) => {
      if (new RegExp(model, "i").test(m)) {
        models.push(m);
      }
    });
  } catch (err) {
    console.error(err);
  }
  res.status(200).json(models);
});

router.get("/makes", async function (req, res) {
  let makes;
  try {
    makes = await Accident.distinct("Make").exec();
  } catch (err) {
    console.error(err);
  }
  res.status(200).json(makes);
});

router.get("/makes/:make", async function (req, res) {
  const { make } = req.params;
  let makes = [];
  let allMakes;
  try {
    allMakes = await Accident.distinct("Make").exec();
    allMakes.forEach((m) => {
      if (new RegExp(make, "i").test(m)) {
        makes.push(m);
      }
    });
  } catch (err) {
    console.error(err);
  }
  res.status(200).json(makes);
});

router.get("/city/:city", async function (req, res) {
  const { city } = req.params;
  let cities = [];
  let allCities;

  try {
    allCities = await Accident.distinct("City").exec();
    allCities.forEach((c) => {
      if (new RegExp(city, "i").test(c)) {
        cities.push(c);
      }
    });
  } catch (err) {
    console.error(err);
  }
  res.status(200).json(cities);
});

router.get("/states", async function (req, res) {
  let states;

  try {
    states = await Accident.distinct("State").exec();
  } catch (err) {
    console.error(err);
  }
  res.status(200).json(states);
});

async function getAccidents(req, res, next) {
  const accidentsPerPage = 20;
  const { page = 0 } = req.query;
  const query = {};
  const sort = { Event_Date: 1 };

  let accidentList, totalAccidents, totalPages;
  try {
    accidentList = await Accident.find(query)
      .sort(sort)
      .limit(accidentsPerPage)
      .skip(accidentsPerPage * page)
      .exec();
    totalAccidents =
      page === 0 ? await Accident.countDocuments(query) : undefined;
    totalPages = totalAccidents
      ? Math.floor(totalAccidents / accidentsPerPage)
      : undefined;
  } catch (err) {
    console.error(err);
  }
  const response = {
    accidents: accidentList,
    page: +page,
    filters: {},
    entries_per_page: accidentsPerPage,
    ...(totalAccidents && { total_results: totalAccidents }),
    ...(totalPages && { total_pages: totalPages }),
  };
  res.json(response);
}

module.exports = router;
