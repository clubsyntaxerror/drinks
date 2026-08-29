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

// Milliseconds from `now` until the next wall-clock occurrence of `time` ("HH:MM") — e.g. a
// live "ends in HH:MM:SS" countdown toward a happy-hour cutoff (see PriceCard.tsx). Plain
// same-day-or-tomorrow rollover rather than DAY_START_HOUR's business-day shift above: that
// shift is for "is this active *now*" comparisons spanning midnight, but "how long until the
// clock reads HH:MM" is just the next literal occurrence of that time, full stop. Only
// meaningful while isWithinDailyWindow(undefined, time, now) is still true — once time's up,
// "next occurrence" means tomorrow's, not "0 remaining".
export function msUntilDailyTime(time: string, now: Date): number | undefined {
    const targetMinutes = parseTimeToMinutes(time);
    if (targetMinutes === undefined) {
        return undefined;
    }

    const target = new Date(now);
    target.setHours(Math.floor(targetMinutes / 60), targetMinutes % 60, 0, 0);
    if (target.getTime() <= now.getTime()) {
        target.setDate(target.getDate() + 1);
    }

    return target.getTime() - now.getTime();
}

// Formats milliseconds as "HH:MM:SS" for a countdown display.
export function formatCountdown(ms: number): string {
    const totalSeconds = Math.max(0, Math.floor(ms / 1000));
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}
