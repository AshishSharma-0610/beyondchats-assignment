import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import PropTypes from "prop-types"

export function TooltipWrapper({ content, children, side = "top" }) {
    return (
        <TooltipProvider>
            <Tooltip delayDuration={300}>
                <TooltipTrigger asChild>{children}</TooltipTrigger>
                <TooltipContent side={side} className="max-w-[300px] text-sm">
                    {content}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}

TooltipWrapper.propTypes = {
    content: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    side: PropTypes.oneOf(["top", "right", "bottom", "left"]),
}

TooltipWrapper.defaultProps = {
    side: "top",
}

// Export TooltipProvider separately for cases where we need to wrap multiple tooltips
export { TooltipProvider }

