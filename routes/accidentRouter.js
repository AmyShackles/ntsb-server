const { Router } = require("express");
const Accident = require("../models/Accident.js");
const router = new Router();
const { naturalSort } = require("../utils/naturalSort.js")

// Escape special characters and make them optional for search
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&?");
}

router.route("/").get(getAccidents);

router.get("/airCarrier/:carrier", async function (req, res) {
    const { carrier } = req.params;
    let carriers = [];
    try {
        carriers = await Accident.distinct("Air_Carrier", {
            $or: [
                { Final_Report_PDF: { $exists: true } },
                { Foreign_Report: { $exists: true } },
            ],
            Air_Carrier: new RegExp(`^${escapeRegex(carrier)}`, "i"),
        });
    } catch (err) {
        console.error(err);
    }
    res.status(200).json(naturalSort(carriers));
});

router.get("/airportCode/:code", async function (req, res) {
    const { code } = req.params;
    let codes = [];
    try {
        codes = await Accident.distinct("Airport_Code", {
            $or: [
                { Final_Report_PDF: { $exists: true } },
                { Foreign_Report: { $exists: true } },
            ],
            Airport_Code: new RegExp(`${escapeRegex(code)}`, "i"),
        })
                .collation({ locale: "en", strength: 2 })
                .exec();
    } catch (err) {
        console.error(err);
    }
    res.status(200).json(naturalSort(codes));
});

router.get("/airportName/:airport", async function (req, res) {
    const { airport } = req.params;
    let airports = [];
    try {
        airports = await Accident.distinct("Airport_Name", {
            $or: [
                { Final_Report_PDF: { $exists: true } },
                { Foreign_Report: { $exists: true } },
            ],
            Airport_Name: new RegExp(`^${escapeRegex(airport)}`, "i"),
        })
            .collation({ locale: "en", strength: 2 })
            .exec();
    } catch (err) {
        console.error(err);
    }
    res.status(200).json(naturalSort(airports));
});

router.get("/categoryList/:category", async function (req, res) {
    const { category } = req.params;
    let categories = [];
    try {
        categories = await Accident.distinct("Aircraft_Category", {
            $or: [
                { Final_Report_PDF: { $exists: true } },
                { Foreign_Report: { $exists: true } },
            ],
            Aircraft_Category: new RegExp(`^${escapeRegex(category)}`, "i"),
        })
            .collation({ locale: "en", strength: 2 })
            .exec();
    } catch (err) {
        console.error(err);
    }
    res.status(200).json(naturalSort(categories));
});

router.get("/cityList/:city", async function (req, res) {
    const { city } = req.params;
    let cities = [];
    try {
        cities = await Accident.distinct("City", {
            $or: [
                { Final_Report_PDF: { $exists: true } },
                { Foreign_Report: { $exists: true } },
            ],
            City: new RegExp(`^${escapeRegex(city)}`, "i"),
        })
            .collation({ locale: "en", strength: 2 })
            .exec();
    } catch (err) {
        console.error(err);
    }
    res.status(200).json(naturalSort(cities));
});

router.get("/countryList/:country", async function (req, res) {
    const { country } = req.params;
    let countries = [];
    try {
        countries = await Accident.distinct("Country", {
            $or: [
                { Final_Report_PDF: { $exists: true } },
                { Foreign_Report: { $exists: true } },
            ],
            Country: new RegExp(`^${escapeRegex(country)}`, "i"),
        })
            .collation({ locale: "en", strength: 2 })
            .exec();
    } catch (err) {
        console.error(err);
    }
    res.status(200).json(naturalSort(countries));
});

router.get("/engineType/:engineType", async function (req, res) {
    const { engineType } = req.params;
    let engineTypes = [];
    try {
        engineTypes = await Accident.distinct("Engine_Type", {
            $or: [
                { Final_Report_PDF: { $exists: true } },
                { Foreign_Report: { $exists: true } },
            ],
            Engine_Type: new RegExp(`${escapeRegex(engineType)}`, "i"),
        })
            .collation({ locale: "en", strength: 2 })
            .exec();
    } catch (err) {
        console.error(err);
    }
    res.status(200).json(naturalSort(engineTypes));
});

router.get("/make_model", async function (req, res) {
    let makeModels = [];
    try {
        makeModels = await Accident.distinct("Make_Model", {
            Final_Report_PDF: { $exists: true },
        })
            .collation({ locale: "en", strength: 2 })
            .exec();
    } catch (err) {
        console.error(err);
    }

    res.status(200).json(naturalSort(makeModels));
});
router.get("/make_model/:makeModel", async function (req, res) {
    const { makeModel } = req.params;
    let makeModels = [];
    try {
        makeModels = await Accident.find({
            Make_Model: new RegExp(`^${escapeRegex(makeModel)}`, "i"),
            Final_Report_PDF: { $exists: true },
        }).exec();
    } catch (err) {
        console.error(err);
    }
    res.status(200).json(naturalSort(makeModels));
});

router.get("/makeList", async function (req, res) {
    let makes = [];
    try {
        makes = await Accident.distinct("Make", {
            $or: [
                { Final_Report_PDF: { $exists: true } },
                { Foreign_Report: { $exists: true } },
            ],
        })
            .collation({ locale: "en", strength: 2 })
            .exec();
    } catch (err) {
        console.error(err);
    }
    res.status(200).json(naturalSort(makes));
});

router.get("/makeList/:make", async function (req, res) {
    const { make } = req.params;
    const makeRegex = new RegExp(`^${escapeRegex(make)}`, "i");
    let makes = [];
    try {
        makes = await Accident.distinct("Make", {
            $or: [
                { Final_Report_PDF: { $exists: true } },
                { Foreign_Report: { $exists: true } },
            ],
            Make: makeRegex,
        })
            .collation({ locale: "en", strength: 2 })
            .exec();
    } catch (err) {
        console.error(err);
    }
    res.status(200).json(naturalSort(makes));
});
router.get("/makeList/:make/model/:model", async function (req, res) {
    const { make, model } = req.params;
    let models = [];
    const makeRegex = new RegExp(`^${escapeRegex(make)}`, "i");
    const modelRegex = new RegExp(`^${escapeRegex(model)}`, "i");
    try {
        models = await Accident.distinct("Model", {
            $or: [
                { Final_Report_PDF: { $exists: true } },
                { Foreign_Report: { $exists: true } },
            ],
            Make: makeRegex,
            Model: modelRegex,
        })
            .collation({ locale: "en", strength: 2 })
            .exec();
    } catch (err) {
        console.error(err);
    }
    res.status(200).json(naturalSort(models));
});

router.get("/modelList", async function (req, res) {
    let models = [];
    try {
        models = await Accident.distinct("Model", {
            Final_Report_PDF: { $exists: true },
        })
            .collation({ locale: "en", strength: 2 })
            .exec();
    } catch (err) {
        console.error(err);
    }
    res.status(200).json(naturalSort(models));
});

router.get("/modelList/:model", async function (req, res) {
    const { model } = req.params;
    let models = [];
    try {
        models = await Accident.distinct("Model", {
            $or: [
                { Final_Report_PDF: { $exists: true } },
                { Foreign_Report: { $exists: true } },
            ],
            Model: new RegExp(`^${escapeRegex(model)}`, "i"),
        })
            .collation({ locale: "en", strength: 2 })
            .exec();
    } catch (err) {
        console.error(err);
    }
    res.status(200).json(naturalSort(models));
});

router.get("/numberOfEngines/:number", async function (req, res) {
    const { number } = req.params;
    let numberOfEngineOptions = [];
        try {
            numberOfEngineOptions = await Accident.distinct(
                "Number_of_Engines",
                {
                    $or: [
                        { Final_Report_PDF: { $exists: true } },
                        { Foreign_Report: { $exists: true } },
                    ],
                    Number_of_Engines: new RegExp(`^{escapeRegex(number)}`, "i"),
                }
            )
                .collation({ locale: "en", strength: 2 })
                .exec();
        } catch (err) {
            console.error(err);
        }
    res.status(200).json(naturalSort(numberOfEngineOptions));
});

router.get("/phaseList/:phase", async function (req, res) {
    const { phase } = req.params;
    let phases = [];
    try {
        phases = await Accident.distinct("Broad_Phase_of_Flight", {
            $or: [
                { Final_Report_PDF: { $exists: true } },
                { Foreign_Report: { $exists: true } },
            ],
            Broad_Phase_of_Flight: new RegExp(`^${escapeRegex(phase)}`, "i"),
        })
            .collation({ locale: "en", strength: 2 })
            .exec();
    } catch (err) {
        console.error(err);
    }
    res.status(200).json(naturalSort(phases));
});

router.get("/purposeOfFlight/:purpose", async function (req, res) {
    const { purpose } = req.params;
    let purposeOfFlightOptions = [];
    try {
        purposeOfFlightOptions = await Accident.distinct("Purpose_of_Flight", {
            $or: [
                { Final_Report_PDF: { $exists: true } },
                { Foreign_Report: { $exists: true } },
            ],
            Purpose_of_Flight: new RegExp(`^${escapeRegex(purpose)}`, "i"),
        })
            .collation({ locale: "en", strength: 2 })
            .exec();
    } catch (err) {
        console.error(err);
    }
    res.status(200).json(naturalSort(purposeOfFlightOptions));
});

router.get("/stateList/:state", async function (req, res) {
    const { state } = req.params;
    let states = [];
    try {
        states = await Accident.distinct("State", {
            $or: [
                { Final_Report_PDF: { $exists: true } },
                { Foreign_Report: { $exists: true } },
            ],
            State: new RegExp(`^${escapeRegex(state)}`, "i"),
        })
            .collation({ locale: "en", strength: 2 })
            .exec();
    } catch (err) {
        console.error(err);
    }
    res.status(200).json(naturalSort(states));
});

router.get("/totalFatalInjuries/:number", async function (req, res) {
    const { number } = req.params;
    let fatalInjuries = [];
        try {
            fatalInjuries = await Accident.distinct("Total_Fatal_Injuries", {
                $or: [
                    { Final_Report_PDF: { $exists: true } },
                    { Foreign_Report: { $exists: true } },
                ],
                Total_Fatal_Injuries: new RegExp(`^${escapeRegex(number)}`, "i"),
            })
                .collation({ locale: "en", strength: 2 })
                .exec();
        } catch (err) {
            console.error(err);
        }
    res.status(200).json(naturalSort(fatalInjuries));
});

router.get("/totalMinorInjuries/:number", async function (req, res) {
    const { number } = req.params;
    let minorInjuries = [];
        try {
            minorInjuries = await Accident.distinct("Total_Minor_Injuries", {
                $or: [
                    { Final_Report_PDF: { $exists: true } },
                    { Foreign_Report: { $exists: true } },
                ],
                Total_Minor_Injuries: new RegExp(`^${escapeRegex(number)}`, "i")
            })
                .collation({ locale: "en", strength: 2 })
                .exec();
        } catch (err) {
            console.error(err);
        }
    res.status(200).json(naturalSort(minorInjuries));
});

router.get("/totalSeriousInjuries/:number", async function (req, res) {
    const { number } = req.params;
    let seriousInjuries = [];
        try {
            seriousInjuries = await Accident.distinct(
                "Total_Serious_Injuries",
                {
                    $or: [
                        { Final_Report_PDF: { $exists: true } },
                        { Foreign_Report: { $exists: true } },
                    ],
                    Total_Serious_Injuries: new RegExp(`^${escapeRegex(number)}`, "i"),
                }
            )
                .collation({ locale: "en", strength: 2 })
                .exec();
        } catch (err) {
            console.error(err);
        }
    res.status(200).json(naturalSort(seriousInjuries));
});

router.get("/totalUninjured/:number", async function (req, res) {
    const { number } = req.params;
    let uninjured = [];
        try {
            uninjured = await Accident.distinct("Total_Uninjured", {
                $or: [
                    { Final_Report_PDF: { $exists: true } },
                    { Foreign_Report: { $exists: true } },
                ],
                Total_Uninjured: new RegExp(`^${escapeRegex(number)}`, "i"),
            })
                .collation({ locale: "en", strength: 2 })
                .exec();
        } catch (err) {
            console.error(err);
        }
    res.status(200).json(naturalSort(uninjured));
});

async function getAccidents(req, res) {
    const accidentsPerPage = 15;
    const { page = 0 } = req.query;
    const { query = {} } = req;
    const sanitizedQuery = {};
    if (!query.Final_Report_PDF) {
        sanitizedQuery["$or"] = [
            {
                Final_Report_PDF: { $exists: true },
            },
            {
                Foreign_Report: { $exists: true },
            },
        ];
    } else {
        sanitizedQuery.Final_Report_PDF = { $exists: true };
    }
    if (query.Event_Date) {
        sanitizedQuery.Event_Date = new Date(query.Event_Date);
    }
    if (query.Event_Date_Before) {
        sanitizedQuery.Event_Date = {
            ...(sanitizedQuery.Event_Date
                ? {
                      ...sanitizedQuery.Event_Date,
                      $lt: new Date(query.Event_Date_Before),
                  }
                : { $lt: new Date(query.Event_Date_Before) }),
        };
    }
    if (query.Event_Date_After) {
        sanitizedQuery.Event_Date = {
            ...(sanitizedQuery.Event_Date
                ? {
                      ...sanitizedQuery.Event_Date,
                      $gte: new Date(query.Event_Date_After),
                  }
                : { $gte: new Date(query.Event_Date_After) }),
        };
    }
    if (query.Country) {
        let countryRegex = new RegExp(`^${escapeRegex(query.Country)}`, "i");
        sanitizedQuery.Country = countryRegex;
    }
    if (query.Make) {
        let makeRegex = new RegExp(`^${escapeRegex(query.Make)}`, "i");
        sanitizedQuery.Make = makeRegex;
    }
    if (query.Model) {
        let modelRegex = new RegExp(`^${escapeRegex(query.Model)}`, "i");
        sanitizedQuery.Model = modelRegex;
    }
    if (query.Make_Model) {
        let makeModelRegex = new RegExp(
            `^${escapeRegex(query.Make_Model)}`,
            "i"
        );
        sanitizedQuery.Make_Model = makeModelRegex;
    }
    const sort = req.sort || { Event_Date: 1 };

    let accidentList, totalAccidents, totalPages;
    try {
        accidentList = await Accident.find(sanitizedQuery)
            .sort(sort)
            .limit(accidentsPerPage)
            .skip(accidentsPerPage * page)
            .exec();
        totalAccidents =
            +page === 0
                ? await Accident.countDocuments(sanitizedQuery)
                : undefined;
        totalPages = totalAccidents
            ? Math.floor(totalAccidents / accidentsPerPage)
            : undefined;
    } catch (err) {
        console.error(err);
    }
    const response = {
        accidents: accidentList,
        page: +page,
        filters: sanitizedQuery,
        entries_per_page: accidentsPerPage,
        ...(totalAccidents !== undefined && { total_results: totalAccidents }),
        ...(totalPages !== undefined && { total_pages: totalPages }),
    };
    res.json(response);
}

module.exports = router;
