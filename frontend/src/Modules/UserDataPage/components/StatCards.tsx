import { Card, CardContent } from "../../../components/ui/card";
import { ReadingStats, ReadingStreak } from "../../../api/trackingApi";

type StatCardProps = {
  title: string;
  value: string;
};

function StatCard({ title, value }: StatCardProps) {
  return (
    <Card>
      <CardContent className="p-6 flex flex-col justify-between">
        <h2 className="text-lg font-medium text-muted-foreground">{title}</h2>
        <p className="text-3xl font-bold mt-2">{value}</p>
      </CardContent>
    </Card>
  );
}

type StatCardsProps = {
  stats?: ReadingStats;
  streak?: ReadingStreak;
};

export function StatCards({ stats, streak }: StatCardsProps) {
  // Format reading time from seconds to hours and minutes
  const formatReadingTime = (seconds: number = 0) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes} mins`;
  };

  const statItems = [
    {
      title: "Books Completed",
      value: stats?.totalBooksRead?.toString() || "0",
    },
    {
      title: "Pages Read",
      value: stats?.totalPagesRead?.toString() || "0",
    },
    {
      title: "Reading Streak",
      value: `${streak?.currentStreak || 0} Days`,
    },
    {
      title: "Total Reading Time",
      value: formatReadingTime(stats?.totalReadingTime),
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {statItems.map((stat) => (
        <StatCard key={stat.title} title={stat.title} value={stat.value} />
      ))}
    </div>
  );
}
