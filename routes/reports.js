const { Router } = require('express');
const { reports, events } = require('../models');


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
    const { description, eventId, userId }  = req.body
    try {
        const newReport = await reports.createReport(description, eventId, userId);

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
    const eventsInfo = [];
    try {

        const eventsList = await events.get();
        if (eventsList.length > 0) {
            for (let i = 0; i < eventsList.length; i++) {
                const count = await reports.getReportCountByEventId(eventsList[i].eventId);
                
                if (count > 0) {
                    const eventInfo = {
                        event: eventsList[i],
                        reports: count
                    }
                    eventsInfo.push(eventInfo);
                }
            }
            return res.status(200).json({
                message: 'Reports found',
                eventsInfo
            });
        } else {
            return res.status(520).json({
                message: 'Reports not found',
                eventsInfo
            });
        }
    } catch(error) {
        console.log(error);
        return res.status(500).json({
            message: 'Error getting report count',
        });
    }
});


module.exports = router;