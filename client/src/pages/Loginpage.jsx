import { Link, Navigate } from "react-router-dom";
import Header from "../Header";
import { useState, } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../UserContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [redirect,setredirect]=useState(false);
  const {user,setuser}=useContext(UserContext);
  async function handleLoginSubmit(e) {
    e.preventDefault();
    try {
     const {data}= await axios.post('http://localhost:4000/login', {
        email,
        password
      }, {
        withCredentials: true // Include credentials in request (cookies)
      });
      setuser(data)
      alert("Login Successfully");
      console.log(data );
      setredirect(true);
      console.log(redirect);
    } catch (e) {
      alert("Invalid Email/Password");
    }
  }

  if(redirect)
  {
   return < Navigate to="/"/>
  }

  return (
    <div className="mt-4 grow flex items-center justify-around">
      <div className="mb-64">
        <h1 className="text-4xl text-center mb-4 font-bold">Login</h1>
        <form className="max-w-md mx-auto" onSubmit={handleLoginSubmit}>
          <input
            type="email"
            placeholder="Your@email.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="primary">Login</button>
          <div className="text-center py-2 text-gray-500">
            Don't have an account yet? 
            <Link className="underline text-black" to="/register">Register now</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
