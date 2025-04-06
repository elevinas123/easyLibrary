import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { ActivityItem as ActivityItemType } from "../../../api/trackingApi";
import { formatDistanceToNow } from "date-fns";
import { Book, BookOpen, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

type ActivityItemProps = {
    activity: ActivityItemType;
}

function ActivityItem({ activity }: ActivityItemProps) {
    const formattedTime = formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true });
    
    // Determine icon based on activity type
    const getActivityIcon = () => {
        switch (activity.type) {
            case 'reading':
                return <BookOpen className="h-5 w-5 text-blue-500 mr-3" />;
            case 'completed':
                return <CheckCircle className="h-5 w-5 text-green-500 mr-3" />;
            default:
                return <Book className="h-5 w-5 text-muted-foreground mr-3" />;
        }
    };
    
    return (
        <div className="flex justify-between items-center py-3 border-b border-border last:border-0">
            <div className="flex items-center">
                {getActivityIcon()}
                <div>
                    <p className="text-foreground">{activity.description}</p>
                    {activity.bookId && (
                        <Link 
                            to={`/book/${activity.bookId}`}
                            className="text-xs text-primary hover:underline"
                        >
                            View book
                        </Link>
                    )}
                </div>
            </div>
            <span className="text-sm text-muted-foreground ml-4">{formattedTime}</span>
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
                    <div className="space-y-1">
                        {activities.map((activity, index) => (
                            <ActivityItem 
                                key={index}
                                activity={activity}
                            />
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
} 