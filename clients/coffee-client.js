const { getAuthToken, getSpreadSheetValues } = require('./sheets-client');

async function getCoffees(targetDay, today, timezone) {
    const moment = require('moment-timezone');
    const auth = await getAuthToken();
    const res = await getSpreadSheetValues(
        process.env.SHEET_ID,
        process.env.SHEET_NAME,
        auth
    );

    const coffees = res.data.values;

    return coffees.slice(1).map(row => {
        const date = moment.tz(row[0], timezone);

        return {
            date: date,
            today: today.isSame(date, 'day'),
            target: targetDay == date.date(),
            day: date.date(),
            coffee: row[1],
            roaster: row[2],
            location: row[3],
            link: row[4]
        }
    }
    );
}


module.exports = {
    getCoffees
};