const { Router } = require("express");
const { events, artists, sequelize, eventFollows } = require("../models");

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

router.get('/eventFollows/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const result = await eventFollows.getFollowedEvent(userId);
        return res.status(200).json({
            response: result
        });
    }
    catch(e) {
        return res.status(400).json({
            message: e.message
        });
    }
});

router.post('/eventFollow/:userId', async (req, res) => {
    const { userId } = req.params;
    const { eventId } = req.body;

    try {
        const result = await eventFollows.create({
            userId,
            eventId
        });

        return res.status(200);
    }
    catch(e) {
        return res.status(400).json({
            message: e.message
        })
    }
});

router.delete('/eventFollow/:userId', async (req, res) => {
    const { userId } = req.params;
    const { eventId } = req.body;

    try {
        const result = await eventFollows.destroy({
            where: {
                userId,
                eventId
            }
        });

        return res.status(200);
    }
    catch(e) {
        return res.status(400).json({
            message: e.message
        })
    }
});

module.exports = router;
