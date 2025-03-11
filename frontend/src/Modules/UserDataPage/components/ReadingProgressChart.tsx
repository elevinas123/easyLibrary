import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";

export function ReadingProgressChart() {
    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle>Reading Progress</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center text-muted-foreground">
                {/* Replace with actual chart component in the future */}
                <p>Chart Placeholder</p>
            </CardContent>
        </Card>
    );
} 