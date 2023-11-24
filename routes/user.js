const { Router } = require("express");
const { events, artists, sequelize, users } = require("../models");
const oneUseCode = require("../models/oneUseCode");

const router = Router();

router.get('/searchEventPlanner/:query?', async (req, res) => {
    const { query } = req.params;
    let { limit, page } = req.query;

    try {
        const searchResult = await users.search(query, limit, page);
        return res.status(200).json(searchResult);
    }
    catch(e) {
        return res.status(400).json({
            message: e.message
        });
    }
});

router.post('/requestOTUCode', async (req, res) => {
    const { email } = req.body;

    try {
        await oneUseCode.requestOTUCode(email);
        return res.status(200);
    }
    catch(e) {
        return res.status(400).json({
            message: e.message
        });
    }
})

module.exports = router;