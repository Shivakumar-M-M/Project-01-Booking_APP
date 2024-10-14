import { useContext, useState } from "react"
import { UserContext } from "../UserContext"
import { Navigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";
import PlacesPgae from "./PlacesPgae";
import AccountNav from "../AccountNav";


export default function ProfilePage()
{
  const [redirect,setRedirect]=useState(false);
  
  const {ready,user,setuser}  =useContext(UserContext);
  
  async function logout() {
    await axios.post('/logout');
    setuser(null); // Set user to null in context
      setRedirect('/');
     // Redirect to login page
  }
  var {subpage}=useParams();
  if(subpage===undefined)
    {
      subpage="profile";
    }
   
  
  if(!ready)
  {
    return '...Loding'
  }
 
  if(redirect){
    return <Navigate to={redirect}></Navigate>
  } 
  if(ready && !user && !redirect)
  {
    return <Navigate to={'/login'}></Navigate>
  }
  
  
  
    return (
        <div>
           <AccountNav></AccountNav> 
        
        {subpage==='profile' && (
          <div className="text-center max-w-lg mx-auto ">
            Logged in as {user.name} ({user.email})
            <br></br>
            
            <button onClick={logout} className="bg-red-500 w-full py-2 mt-3 rounded-full text-white text-center"> Logout</button>

        </div>)}

        {subpage==='places' &&(
          


            <PlacesPgae></PlacesPgae>
          
        )}
       </div>
        
    )
}