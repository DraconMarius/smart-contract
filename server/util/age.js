function calcAge(startT, endT) {
    const start = new Date(startT);
    const end = new Date(endT);

    const diffMs = end - start; // milliseconds between event emitted block & initial call time
    return `${Math.max(diffMs, 0)} milliseconds`;

}

function getTime() {
    const now = new Date();

    // Get minutes and round to the nearest half-hour block
    const minutes = now.getMinutes();

    if (minutes < 15) {
        // Round down to the nearest hour (XX:00)
        now.setMinutes(0, 0, 0);
    } else if (minutes >= 15 && minutes < 45) {
        // Round to the nearest half-hour (XX:30)
        now.setMinutes(30, 0, 0);
    } else {
        // Round up to the next hour (XX:00 of the next hour)
        now.setMinutes(0, 0, 0);
        now.setHours(now.getHours() + 1); // Move to the next hour
    }

    return now;
}

module.exports = { calcAge, getTime }