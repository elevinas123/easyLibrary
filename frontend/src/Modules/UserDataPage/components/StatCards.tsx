import { Card, CardContent } from "../../../components/ui/card";

type StatCardProps = {
    title: string;
    value: string;
}

function StatCard({ title, value }: StatCardProps) {
    return (
        <Card>
            <CardContent className="p-6 flex flex-col justify-between">
                <h2 className="text-lg font-medium text-muted-foreground">
                    {title}
                </h2>
                <p className="text-3xl font-bold mt-2">
                    {value}
                </p>
            </CardContent>
        </Card>
    );
}

export function StatCards() {
    // In the future, these would be fetched from an API
    const stats = [
        { title: "Books Uploaded", value: "24" },
        { title: "Books Read", value: "12" },
        { title: "Reading Streak", value: "5 Days" },
        { title: "Avg. Reading Time", value: "45 mins" },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => (
                <StatCard 
                    key={stat.title} 
                    title={stat.title} 
                    value={stat.value} 
                />
            ))}
        </div>
    );
} 