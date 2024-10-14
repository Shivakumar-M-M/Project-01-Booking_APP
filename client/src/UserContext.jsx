import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { createContext } from "react";

export const UserContext=createContext({});


export function UserContextProvider({children}){
    const [user,setuser]=useState(null);
    const [ready,setReady]=useState(false);

 useEffect(()=>{
        if(!user){
      const {data}=axios.get('http://localhost:4000/profile', { // Use your backend URL
            withCredentials: true, // Ensure cookies are sent with the request
          })
          .then(({data})=>{
            setuser(data);
            setReady(true);
          })
        }
    },[]);
    return (
        <UserContext.Provider value={{user,setuser,ready}}>
        {children}
        </UserContext.Provider>
    );
}