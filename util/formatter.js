function uptimeConvertUnits() {
    let up = process.uptime();
    let units = 'seconds';

    if (up > 60) {
        up /= 60;
        units = "minutes";
    }
    if (up > 60) {
        up /= 60;
        units = "hours";
    }
    if (up > 24 && units == "hours") {
        up /= 24;
        units = "days";
    }

    up = Math.floor(up);

    if (up === 1) {
        units = units.slice(0, -1);
    }

    return '**' + up + " " + units + '**';
}

module.exports = {
    getUptime: uptimeConvertUnits
};