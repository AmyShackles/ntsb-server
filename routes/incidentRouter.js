const { Router } = require("express");
const Incident = require("../models/Incident.js");
const router = new Router();

router.route("/").get(getIncidents);

router.get("/city/:city", async function (req, res) {
  const { city } = req.params;
  let cities = [];
  let allCities;

  try {
    allCities = await Incident.distinct("City").exec();
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
    states = await Incident.distinct("State").exec();
  } catch (err) {
    console.error(err);
  }
  res.status(200).json(states);
});

async function getIncidents(req, res, next) {
  const incidentsPerPage = 20;
  const { page = 0 } = req.query;
  const query = {};
  const sort = { Event_Date: 1 };

  let incidentList, totalIncidents, totalPages;
  try {
    incidentList = await Incident.find(query)
      .sort(sort)
      .limit(incidentsPerPage)
      .skip(incidentsPerPage * page)
      .exec();
    totalIncidents =
      page === 0 ? await Incident.countDocuments(query) : undefined;
    totalPages = totalIncidents
      ? Math.floor(totalIncidents / incidentsPerPage)
      : undefined;
  } catch (err) {
    console.error(err);
  }
  const response = {
    incidents: incidentList,
    page: +page,
    filters: {},
    entries_per_page: incidentsPerPage,
    ...(totalIncidents && { total_results: totalIncidents }),
    ...(totalPages && { total_pages: totalPages }),
  };
  res.json(response);
}

module.exports = router;
