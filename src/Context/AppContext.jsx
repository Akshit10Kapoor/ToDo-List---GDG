import { createContext } from "react";


export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {

    const [toDoBox, setToDoBox] = useState([]);
    const [toDo, setToDo] = useState({});

    const value = {
        toDoBox, setToDoBox,
        toDo, setToDo
    }
    return <AppContext.provider value={value}>
        {children}
    </AppContext.provider>
}

export const useAppContext = () => {
    return useContext(AppContext);
}