// The venue's day runs 03:00 -> 03:00 the next morning (last call, closing, etc. all land after
// midnight), so a plain HH:MM comparison would treat "01:00" as *earlier* than "22:00" and get
// the ordering backwards for anything scheduled in the small hours. Shifting every time so this
// day's 03:00 becomes minute 0 puts the whole cycle in one monotonic order instead:
// 03:00->0 ... 23:00->1200 ... 00:00->1260 ... 02:59->1439.
const DAY_START_HOUR = 3;
const MINUTES_PER_DAY = 24 * 60;

function parseTimeToMinutes(time: string): number | undefined {
    const match = /^(\d{1,2}):(\d{2})$/.exec(time.trim());
    if (!match) {
        return undefined;
    }
    const hours = Number(match[1]);
    const minutes = Number(match[2]);
    if (hours > 23 || minutes > 59) {
        return undefined;
    }
    return hours * 60 + minutes;
}

function toBusinessMinutes(minutesSinceMidnight: number): number {
    return (minutesSinceMidnight - DAY_START_HOUR * 60 + MINUTES_PER_DAY) % MINUTES_PER_DAY;
}

// Whether `now` falls within [fromTime, toTime) — both "HH:MM" and both optional (an unset
// bound leaves that side open). Comparisons happen in the venue's day per DAY_START_HOUR above,
// so e.g. fromTime "01:00" only opens up after midnight, not for the ~23 hours before it too.
export function isWithinDailyWindow(fromTime: string | undefined, toTime: string | undefined, now: Date): boolean {
    if (!fromTime && !toTime) {
        return true;
    }

    const nowMinutes = toBusinessMinutes(now.getHours() * 60 + now.getMinutes());

    if (fromTime) {
        const fromMinutes = parseTimeToMinutes(fromTime);
        if (fromMinutes !== undefined && nowMinutes < toBusinessMinutes(fromMinutes)) {
            return false;
        }
    }

    if (toTime) {
        const toMinutes = parseTimeToMinutes(toTime);
        if (toMinutes !== undefined && nowMinutes >= toBusinessMinutes(toMinutes)) {
            return false;
        }
    }

    return true;
}
