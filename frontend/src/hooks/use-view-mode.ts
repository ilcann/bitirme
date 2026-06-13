import { useState } from "react";

type ViewMode = "compact" | "wide";

export const useViewMode = (defaultMode: ViewMode = "compact") => {
    const [viewMode, setViewMode] = useState<ViewMode>(defaultMode);

    return {
        viewMode,
        setViewMode,
        isCompact: viewMode === "compact",
        isWide: viewMode === "wide"
    };
};
