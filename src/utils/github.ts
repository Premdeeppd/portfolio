import "server-only";

export const GITHUB_USERNAME = "Premdeeppd";

export type ContributionLevel =
  | "NONE"
  | "FIRST_QUARTILE"
  | "SECOND_QUARTILE"
  | "THIRD_QUARTILE"
  | "FOURTH_QUARTILE";

export interface ContributionDay {
  date: string;
  weekday: number;
  contributionCount: number;
  contributionLevel: ContributionLevel;
}

export interface ContributionCalendar {
  totalContributions: number;
  weeks: { contributionDays: ContributionDay[] }[];
}

const QUERY = `
  query ($login: String!, $from: DateTime!, $to: DateTime!) {
    user(login: $login) {
      contributionsCollection(from: $from, to: $to) {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              weekday
              contributionCount
              contributionLevel
            }
          }
        }
      }
    }
  }
`;

// Last 3 months, starting on a Sunday so every column is a full week.
// Dates are whole UTC days so the request (and its cache key) only changes once a day.
function getRange() {
  const to = new Date();
  to.setUTCHours(23, 59, 59, 0);

  const from = new Date(to);
  from.setUTCMonth(from.getUTCMonth() - 3);
  from.setUTCDate(from.getUTCDate() - from.getUTCDay());
  from.setUTCHours(0, 0, 0, 0);

  return { from: from.toISOString(), to: to.toISOString() };
}

export async function getContributions(): Promise<ContributionCalendar | null> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    console.warn("GITHUB_TOKEN is not set, skipping GitHub contributions");
    return null;
  }

  try {
    const res = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: QUERY,
        variables: { login: GITHUB_USERNAME, ...getRange() },
      }),
      next: { revalidate: 60 * 60 * 6 },
    });

    if (!res.ok) {
      console.error(`GitHub API responded with ${res.status}`);
      return null;
    }

    const json = await res.json();
    return json.data?.user?.contributionsCollection?.contributionCalendar ?? null;
  } catch (error) {
    console.error("Failed to fetch GitHub contributions", error);
    return null;
  }
}
