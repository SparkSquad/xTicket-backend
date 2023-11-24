const { Router } = require("express");
const { events, artists, sequelize } = require("../models");

const router = Router();

router.get('/search/:query?', async (req, res) => {
    const { query } = req.params;
    let { limit, page } = req.query;

    try {
        const searchResult = await events.search(query, limit, page);
        return res.status(200).json(searchResult);
    }
    catch(e) {
        return res.status(400).json({
            message: e.message
        });
    }
});

module.exports = router;