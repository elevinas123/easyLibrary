import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { ActivityItem as ActivityItemType } from "../../../api/trackingApi";
import { formatDistanceToNow } from "date-fns";

type ActivityItemProps = {
    description: string;
    timestamp: string;
}

function ActivityItem({ description, timestamp }: ActivityItemProps) {
    const formattedTime = formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    
    return (
        <div className="flex justify-between items-center py-2">
            <p className="text-foreground">{description}</p>
            <span className="text-sm text-muted-foreground">{formattedTime}</span>
        </div>
    );
}

type RecentActivityProps = {
    activities: ActivityItemType[];
}

export function RecentActivity({ activities }: RecentActivityProps) {
    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
                {activities.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">
                        No recent activity to display
                    </p>
                ) : (
                    <div className="space-y-2">
                        {activities.map((activity, index) => (
                            <ActivityItem 
                                key={index}
                                description={activity.description}
                                timestamp={activity.timestamp}
                            />
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
} 