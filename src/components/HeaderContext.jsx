import React, { createContext, useState } from "react";

export const HeaderContext = createContext();

export function HeaderProvider({ children }) {
    // 儲存 Header 是否展開
    const [isHeaderOpen, setIsHeaderOpen] = useState(false);

    return (
        <HeaderContext.Provider value={{ isHeaderOpen, setIsHeaderOpen }}>
            {children}
        </HeaderContext.Provider>
    );
}