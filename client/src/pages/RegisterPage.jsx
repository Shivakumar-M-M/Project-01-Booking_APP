import { Link, Navigate } from "react-router-dom";
import Header from "../Header";
import { useState } from "react";
import axios from 'axios'


export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [redirect,setRedirect]=useState();
 async function registerUser(e){
    e.preventDefault();
    try{
  await axios.post('http://localhost:4000/register',{
    name,
    email,
    password,
    // VY3XAwLkAQJ0Jiya
 });
 alert("Registration Succesfull you can log-in");
 setRedirect('/login');

}
catch(e){
  alert("Registration failed use new email")
}

  }
  if(redirect)
  {
    return <Navigate to={redirect}></Navigate>
  }
  
  return (
    <div className="mt-4 grow flex items-center justify-around">
      <div className="mb-64">
        <h1 className="text-4xl text-center mb-4 font-bold">Register</h1>
        <form className="max-w-md mx-auto" onSubmit={registerUser}>
          <input
            type="text"
            placeholder="Eg:Prashant Kumar"
            value={name}
            onChange={(e) => setName(e.target.value)}
          ></input>
          <input
            type="email"
            placeholder="Your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></input>
          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></input>
          <button className="primary ">Register</button>
          <div className="text-center py-2 text-gray-500">
            Already a member?
            <Link className="underline  text-black font-medium" to="/login">
              Login now
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
