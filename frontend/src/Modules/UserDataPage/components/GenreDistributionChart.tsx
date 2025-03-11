import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { GenreDistribution } from "../../../api/trackingApi";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

type GenreDistributionChartProps = {
    data: GenreDistribution[];
}

export function GenreDistributionChart({ data }: GenreDistributionChartProps) {
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle>Genre Distribution</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
                {data.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-muted-foreground">
                        <p>No genre data available</p>
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="count"
                                nameKey="genre"
                                label={({ genre }) => genre}
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                )}
            </CardContent>
        </Card>
    );
} 