export type RedirectStatistics = {
    redirectCount: number;
    referrers: Record<string, number>;
    countries: Record<string, number>;
    deviceTypes: Record<string, number>;
    redirectsDuringPeriod: RedirectTimeStatistics;
};
export type RedirectTimeStatistics = {
    startDate: Date;
    endDate: Date;
    timeDivision: string;
    timeDivisionInMS: number;
    timeDivisionRedirectCounts: number[];
};
