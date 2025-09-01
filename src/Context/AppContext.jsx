import { createContext } from "react";


export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {

    const value = {}
    return <AppContext.provider value={value}>
        {children}
    </AppContext.provider>
}

export const useAppContext = () => {
    return useContext(AppContext);
}