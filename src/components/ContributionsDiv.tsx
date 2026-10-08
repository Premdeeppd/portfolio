import {
  ContributionLevel,
  GITHUB_USERNAME,
  getContributions,
} from "../utils/github";

const LEVELS: ContributionLevel[] = [
  "NONE",
  "FIRST_QUARTILE",
  "SECOND_QUARTILE",
  "THIRD_QUARTILE",
  "FOURTH_QUARTILE",
];

// Lighter tints of the blue background, with peach as the busiest level.
// (Peach at partial opacity over blue mixes into a muddy grey-lilac.)
const LEVEL_CLASSES: Record<ContributionLevel, string> = {
  NONE: "bg-white/10",
  FIRST_QUARTILE: "bg-white/30",
  SECOND_QUARTILE: "bg-white/50",
  THIRD_QUARTILE: "bg-white/70",
  FOURTH_QUARTILE: "bg-brand-peach",
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const DAY_LABELS = [
  { weekday: 1, label: "Mon" },
  { weekday: 3, label: "Wed" },
  { weekday: 5, label: "Fri" },
];

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });

export default async function ContributionsDiv() {
  const calendar = await getContributions();
  const profileUrl = `https://github.com/${GITHUB_USERNAME}`;

  // Label a column when its week starts in a new month, like GitHub does.
  const monthLabels = (calendar?.weeks ?? []).map((week, i, weeks) => {
    const month = Number(week.contributionDays[0].date.slice(5, 7)) - 1;
    const prevMonth = i > 0 ? Number(weeks[i - 1].contributionDays[0].date.slice(5, 7)) - 1 : -1;
    return month !== prevMonth ? MONTHS[month] : null;
  });
  // Drop the first label if the next one would overlap it.
  if (monthLabels.findIndex((label, i) => i > 0 && label) === 1) {
    monthLabels[0] = null;
  }

  return (
    <div
      id="github"
      className="scroll-mt-28 mx-0 sm:mx-4 flex flex-col items-center bg-brand-blue px-4 py-12 rounded-none sm:px-6 md:px-8 text-center"
    >
      <h2 className="pb-3 text-center text-xl font-semibold leading-snug text-brand-peach sm:pb-4 sm:text-2xl md:text-3xl lg:text-4xl">
        GitHub Activity
      </h2>

      <p className="max-w-4xl px-1 py-8 text-center text-base leading-relaxed text-white/90 sm:px-2 sm:text-lg md:px-4 md:py-10 md:text-xl lg:text-2xl">
        {calendar ? (
          <>
            My activity on GitHub over the last <b>3 months</b>, with{" "}
            <b>{calendar.totalContributions.toLocaleString("en-US")} contributions</b>{" "}
            and counting.
          </>
        ) : (
          <>
            Take a look at what I have been building lately on <b>GitHub</b>.
          </>
        )}
      </p>

      {calendar && (
        <div className="mb-8 w-full max-w-2xl">
          <div
            role="img"
            aria-label={`${calendar.totalContributions} GitHub contributions in the last 3 months`}
            className="grid gap-1 sm:gap-1.5"
            style={{
              gridTemplateColumns: `auto repeat(${calendar.weeks.length}, minmax(0, 1fr))`,
            }}
          >
            {monthLabels.map(
              (label, i) =>
                label && (
                  <span
                    key={`month-${i}`}
                    className="whitespace-nowrap pb-1 text-left text-xs text-white/70 sm:text-sm"
                    style={{ gridColumn: i + 2, gridRow: 1 }}
                  >
                    {label}
                  </span>
                )
            )}

            {DAY_LABELS.map(({ weekday, label }) => (
              <span
                key={label}
                className="self-center pr-1 text-right text-xs text-white/70 sm:pr-2 sm:text-sm"
                style={{ gridColumn: 1, gridRow: weekday + 2 }}
              >
                {label}
              </span>
            ))}

            {calendar.weeks.flatMap((week, i) =>
              week.contributionDays.map((day) => (
                <div
                  key={day.date}
                  title={`${day.contributionCount} contribution${day.contributionCount === 1 ? "" : "s"} on ${formatDate(day.date)}`}
                  className={`aspect-square rounded-none transition-transform duration-300 hover:scale-110 ${LEVEL_CLASSES[day.contributionLevel]}`}
                  style={{ gridColumn: i + 2, gridRow: day.weekday + 2 }}
                />
              ))
            )}
          </div>

          <div
            className="mt-4 flex items-center justify-end gap-1 text-xs text-white/70 sm:gap-1.5 sm:text-sm"
            aria-hidden="true"
          >
            <span className="mr-1">Less</span>
            {LEVELS.map((level) => (
              <div key={level} className={`size-3 sm:size-4 ${LEVEL_CLASSES[level]}`} />
            ))}
            <span className="ml-1">More</span>
          </div>
        </div>
      )}

      <a
        href={profileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-block bg-brand-peach text-brand-blue font-bold px-6 py-3 rounded-none shadow-md hover:scale-105 transition-all duration-300"
      >
        View on GitHub →
      </a>
    </div>
  );
}
