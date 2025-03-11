import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { ChartDataPoint } from "../../../api/trackingApi";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type ReadingProgressChartProps = {
    data: ChartDataPoint[];
}

export function ReadingProgressChart({ data }: ReadingProgressChartProps) {
    // Format date for display
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle>Reading Progress</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
                {data.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-muted-foreground">
                        <p>No reading data available</p>
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis 
                                dataKey="day" 
                                tickFormatter={formatDate}
                            />
                            <YAxis />
                            <Tooltip 
                                formatter={(value) => [`${value} minutes`, 'Reading Time']}
                                labelFormatter={formatDate}
                            />
                            <Bar 
                                dataKey="totalMinutes" 
                                name="Reading Time" 
                                fill="#8884d8" 
                            />
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </CardContent>
        </Card>
    );
} 