const { Router } = require("express");
const Accident = require("../models/Accident.js");
const router = new Router();

router.route("/").get(getAccidents);

router.get("/modelList", async function (req, res, next) {
  let models = await Accident.distinct("Model").exec().catch(next);
  res.status(200).json(models);
});

router.get("/modelList/:model", async function (req, res, next) {
  const { model } = req.params;
  let models = [];
  let allModels = [];
  try {
    allModels = await Accident.distinct("Model").exec();
  } catch (err) {
    console.error(err);
  }
  allModels.forEach((m) => {
    if (new RegExp(`^${model}`, "i").test(m)) {
      models.push(m);
    }
  });
  res.status(200).json(models);
});

router.get("/makeList", async function (req, res, next) {
  let makes = await Accident.distinct("Make").exec().catch(next);
  res.status(200).json(makes);
});

router.get("/makeList/:make", async function (req, res, next) {
  const { make } = req.params;
  let makes = [];
  let allMakes = [];
  try {
    allMakes = await Accident.distinct("Make").exec();
  } catch (err) {
    console.error(err);
  }
  allMakes.forEach((m) => {
    if (new RegExp(`^${make}`, "i").test(m)) {
      makes.push(m);
    }
  });
  res.status(200).json(makes);
});

router.get("/cityList/:city", async function (req, res, next) {
  const { city } = req.params;
  let cities = [];
  let allCities = await Accident.distinct("City").exec().catch(next);
  allCities.forEach((c) => {
    if (new RegExp(city, "i").test(c)) {
      cities.push(c);
    }
  });
  res.status(200).json(cities);
});

router.get("/stateList", async function (req, res, next) {
  let states = await Accident.distinct("State").exec().catch(next);
  res.status(200).json(states);
});

router.get("/models/:model", async function (req, res, next) {
  let accidents = await Accident.distinct("Event_Date", {
    Model: req.params.model,
  })
    .exec()
    .catch(next);
  res.status(200).json(accidents);
});

router.get("/models/:model/date/:date", async function (req, res) {
  req.query.Model = req.params.model;
  req.query.Event_Date = req.params.date;
  return await getAccidents(req, res);
});

router.get("/makes/:make", async function (req, res, next) {
  let models = await Accident.distinct("Model", { Make: req.params.make })
    .exec()
    .catch(next);
  res.status(200).json(models);
});

async function getAccidents(req, res, next) {
  const accidentsPerPage = 50;
  const { page = 0 } = req.query;
  delete req.query.page;
  const { query = {} } = req;
  if (query.Event_Date) {
    query.Event_Date = new Date(query.Event_Date);
  }
  if (query.before) {
    query.Event_Date = {
      ...(query.Event_Date
        ? { ...query.Event_Date, $lt: new Date(query.before) }
        : { $lt: new Date(query.before) }),
    };
  }
  if (query.after) {
    query.Event_Date = {
      ...(query.Event_Date
        ? { ...query.Event_Date, $gte: new Date(query.after) }
        : { $gte: new Date(query.after) }),
    };
  }
  const sort = req.sort || { Event_Date: 1 };

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
    filters: query,
    entries_per_page: accidentsPerPage,
    ...(totalAccidents && { total_results: totalAccidents }),
    ...(totalPages && { total_pages: totalPages }),
  };
  res.json(response);
}

module.exports = router;
