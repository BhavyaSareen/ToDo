// import React, { useState } from 'react'
// import { createContext } from 'react'

// const AuthContext = createContext();

// const AuthProvider = ({ children }) => {
//     const [token, setToken] = useState(null);
//     const login = (token) => {
//         setToken(token);
//     }
//     const logOut = () => {
//         token = null;
//     }
//     console.log(token);
//     return (
//         <AuthContext.Provider value={{ token, login, logOut }}>{children}</AuthContext.Provider>
//     )
// }

// export { AuthContext, AuthProvider } 
