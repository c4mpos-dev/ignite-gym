import { createContext, ReactNode, useState } from "react";

import { UserDTO } from "@dtos/UserDTO";

export type AuthContextDataProps = {
    user: UserDTO;
}

type AuthContextProviderProps = {
    children: ReactNode;
}

export const AuthContext = createContext<AuthContextDataProps>({} as AuthContextDataProps);

export function AuthContextProvider({ children }: AuthContextProviderProps){
    const [user, setUser] = useState({
        id: '1',
        name: 'Cauã Campos',
        email: 'Teste@gmail.com',
        avatar: 'campos.png'
    });

    return(
        <AuthContext.Provider value={{ user }}>
            {children}
        </AuthContext.Provider>
    );
}