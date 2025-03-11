import { Button } from "../../../components/ui/button";
import { RefreshCw } from "lucide-react";

type DashboardHeaderProps = {
    onRefresh?: () => void;
}

export function DashboardHeader({ onRefresh }: DashboardHeaderProps) {
    return (
        <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <Button variant="default" onClick={onRefresh}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh Data
            </Button>
        </div>
    );
} 