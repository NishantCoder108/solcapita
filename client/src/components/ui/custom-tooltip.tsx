import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { Info } from "lucide-react"

interface CustomTooltipProps {
    content: string;
    children: React.ReactNode;
}

export const CustomTooltip = ({ content, children }: CustomTooltipProps) => (
    <TooltipProvider>
        <Tooltip>
            <TooltipTrigger asChild>
                <div className="flex items-center gap-1 cursor-help">
                    {children}
                    <Info className="h-3 w-3 text-gray-400" />
                </div>
            </TooltipTrigger>
            <TooltipContent>
                <p className="text-xs">{content}</p>
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>
) 