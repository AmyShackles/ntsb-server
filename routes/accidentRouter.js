const { Router } = require("express");
const Accident = require("../models/Accident.js");
const router = new Router();

// Escape special characters and make them optional for search
function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&\?");
};

router.route("/").get(getAccidents);

router.get("/modelList", async function (req, res, next) {
  let models = await Accident.distinct("Model").exec().catch(next);
  res.status(200).json(models);
});

router.get("/modelList/:model", async function (req, res, next) {
    const { model } = req.params;
    let models = [];
    try {
        models = await Accident.distinct("Model", {
            Model: new RegExp(`^${escapeRegex(model)}`, "i"),
        }).exec();
    } catch (err) {
        console.error(err);
    }
    res.status(200).json(models);
});

router.get("/category/:category", async function (req, res, next) {
  const { category } = req.params;
  let categories = [];
  try {
    categories = await Accident.distinct("Make", { Aircraft_Category: new RegExp(`^${category}`, "i")}).exec();
  } catch(err) {
    console.error(err);
  }
  res.status(200).json(categories)
})

router.get("/make_model", async function (req, res, next) {
    let makeModels = await Accident.distinct("Make_Model").exec().catch(next);
    res.status(200).json(makeModels);
});
router.get("/make_model/:makeModel", async function (req, res, next) {
    const { makeModel } = req.params;
    let makeModels = [];
    try {
        makeModels = await Accident.distinct("Make_Model", {
            Make_Model: new RegExp(`^${makeModel}`, "i"),
        }).exec();
    } catch (err) {
        console.error(err);
    }
    res.status(200).json(makeModels);
});

router.get("/makeList", async function (req, res, next) {
  let makes = [];
  try {
    makes = await Accident.distinct("Make", { Final_Report_PDF: { $exists: true }}).exec();
  } catch (err) {
    console.error(err);
  }
  res.status(200).json(makes);
});

router.get("/makeList/:make", async function (req, res, next) {
  const { make } = req.params;
  const makeRegex = new RegExp(`^${escapeRegex(make)}`, "i");
  let makes = [];
  try {
    makes = await Accident.distinct("Model", {
        Make: makeRegex,
        Final_Report_PDF: { $exists: true }
    }).exec();
  } catch (err) {
      console.error(err);
  }
  res.status(200).json(makes);
});

router.get("/countryList/:country", async function (req, res) {
  const { country } = req.params;
  let countries = [];
  try {
    countries = await Accident.distinct("Country", {
        Country: new RegExp(`^${country}`, "i"),
    }).exec();
  } catch (err) {
      console.error(err);
  }
  res.status(200).json(countries);
});

router.get("/cityList/:city", async function (req, res, next) {
  const { city } = req.params;
  let cities = [];
  try {
      cities = await Accident.distinct("City", {
          City: new RegExp(city, "i"),
      }).exec();
  } catch (err) {
        console.error(err);
  }
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
  const accidentsPerPage = 20;
  const { page = 0 } = req.query;
  delete req.query.page;
  const { query = {} } = req;
  if (!query.Final_Report_PDF) {
    query.Final_Report_PDF = { ...query.Final_Report_PDF, $exists: true }
  } else {
    query.Final_Report_PDF = { $exists: true }
  }
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
  if (query.Make) {
    let makeRegex = new RegExp(`^${escapeRegex(query.Make)}`, "i");
    query.Make = makeRegex;
  }
  if (query.Model) {
    let modelRegex = new RegExp(`^${escapeRegex(query.Model)}`, "i");
    query.Model = modelRegex;
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
        +page === 0 ? await Accident.countDocuments(query) : undefined;
    totalPages = totalAccidents
      ? Math.floor(totalAccidents / accidentsPerPage)
      : undefined;
      console.log(totalAccidents, totalPages)
  } catch (err) {
    console.error(err);
  }
  const response = {
    accidents: accidentList,
    page: +page,
    filters: query,
    entries_per_page: accidentsPerPage,
    ...(totalAccidents !== undefined && { total_results: totalAccidents }),
    ...(totalPages !== undefined && { total_pages: totalPages }),
  };
  res.json(response);
}

module.exports = router;
