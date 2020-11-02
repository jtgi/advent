const { getAuthToken, getSpreadSheetValues } = require('./sheets-client');
const moment = require('moment');

async function getCoffees(targetDay, today) {
    const auth = await getAuthToken();
    const res = await getSpreadSheetValues(
        process.env.SHEET_ID,
        process.env.SHEET_NAME,
        auth
    );

    const coffees = res.data.values;
    const headers = coffees[0];

    return coffees.slice(1).map(row => {
        const date = moment(row[0], 'MM/DD/YYYY');

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