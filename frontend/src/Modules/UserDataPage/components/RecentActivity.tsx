import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";

type ActivityItemProps = {
    description: string;
    timestamp: string;
}

function ActivityItem({ description, timestamp }: ActivityItemProps) {
    return (
        <div className="flex justify-between items-center py-2">
            <p className="text-foreground">{description}</p>
            <span className="text-sm text-muted-foreground">{timestamp}</span>
        </div>
    );
}

export function RecentActivity() {
    // In the future, these would be fetched from an API
    const activities = [
        { description: "Finished reading `Book Title 1`", timestamp: "2 days ago" },
        { description: "Uploaded `Book Title 2`", timestamp: "4 days ago" },
        { description: "Started reading `Book Title 3`", timestamp: "5 days ago" },
    ];

    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    {activities.map((activity, index) => (
                        <ActivityItem 
                            key={index}
                            description={activity.description}
                            timestamp={activity.timestamp}
                        />
                    ))}
                </div>
            </CardContent>
        </Card>
    );
} 