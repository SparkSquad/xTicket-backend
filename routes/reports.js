const { Router } = require('express');
const { reports, events } = require('../models');
const { events } = require('../models');
const { users } = require('../models');


const router = Router();

router.get('/getAll/:eventId', async (req, res) => {
    const { eventId } = req.params;
    try {
        const report = await reports.getByEventId(eventId);

        if (report.length == 0) {
            return res.status(200).json({
                message: 'No reports found',
                report
            });
        }

        return res.status(200).json({
            message: 'Reports found',
            report
        });
    } catch(error) {
        console.log(error);
        return res.status(500).json({
            message: 'Error getting reports',
        });
    }
});

router.post('/create', async (req, res) => {
    const report = { description, eventId, userId }  = req.body
    try {
        const newReport = await reports.create(report);

        return res.status(200).json({
            message: 'Report created',
        });
    } catch(error) {
        console.log(error);
        return res.status(500).json({
            message: 'Error creating report',
        });
    }
});

router.get('/getEventReports', async (req, res) => {
    try {

        const events = await events.get();
        const count = await reports.getReportCountByEventId(eventId);

        if (events.length > 0) {
            return res.status(200).json({
                message: 'Reports found',
                events
            });
        }
        else {
            
        }

    } catch(error) {
        console.log(error);
        return res.status(500).json({
            message: 'Error getting report count',
        });
    }
});


module.exports = router;