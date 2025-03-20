import { Button } from "../../../components/ui/button";
import { RefreshCw } from "lucide-react";

type DashboardHeaderProps = {
    onRefresh?: () => void;
}

export function DashboardHeader({ onRefresh }: DashboardHeaderProps) {
    return (
        <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Statistics</h1>
        </div>
    );
} 