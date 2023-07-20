import { RedirectTimeStatistics } from '../shortener/types/redirect-statistics.type';

export function countViewsInTimeDivisions(
    startDate: Date,
    endDate: Date,
    timeDivision: string,
    redirectDates: Date[],
): RedirectTimeStatistics {
    const timeInMiliseconds: Record<string, number> = {
        h: 3600000,
        d: 86400000,
        w: 86400000 * 7,
    };
    const endTime = endDate.getTime();
    const startTime = startDate.getTime();
    const matches = timeDivision.match(/^(\d+)([hdw])$/);
    if (!matches) {
        throw new Error('Invalid time division format');
    }
    const timeValue = parseInt(matches[1]);
    const timeUnit = matches[2];
    const timeIncrement = timeValue * timeInMiliseconds[timeUnit];

    const divisionCount = Math.floor((endTime - startTime) / timeIncrement) + 1;
    const timeDivisionRedirectCounts: number[] = Array(divisionCount).fill(0);
    for (const redirectDate of redirectDates) {
        const divisionIndex = Math.floor((redirectDate.getTime() - startDate.getTime()) / timeIncrement);
        timeDivisionRedirectCounts[divisionIndex]++;
    }
    return { startDate, endDate, timeDivision, timeDivisionInMS: timeIncrement, timeDivisionRedirectCounts };
}
