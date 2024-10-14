import { useContext, useEffect, useState } from "react";
import {differenceInCalendarDays} from "date-fns";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "./UserContext";

export default function BookingWidget({place}){
const [checkIn,setCheckIn]=useState('');
const [checkOut,setCheckOut]=useState('');
const [numberOfGuest,setNumberOfGuest]=useState(1);
const [name,setName]=useState('');
const [phone,setPhone]=useState('');
const [redirect,setRedirect]=useState('');
const {user}=useContext(UserContext);

useEffect(()=>{
if(user)
{
  setName(user.name)
}
},[user])

let numberOfNights=0;
if(checkIn && checkOut){
  numberOfNights=differenceInCalendarDays(new Date(checkOut),new Date(checkIn));
}
async function bookThisPlace()
{
  
 const response = await axios.post('http://localhost:4000/bookings',{checkIn,checkOut,numberOfGuest,name,phone,place:place._id,price:numberOfNights*place.price});
  const bookingId=response.data._id;
  setRedirect(`/account/bookings/${bookingId}`);
}
if(redirect)
{
  return (
    <Navigate to={redirect}></Navigate>
  )
}
    return (
        <div className="bg-white shadow p-3 rounded-2xl">
  <div className="text-2xl text-center mt-4 ">
    <div>
    Price: $ {place.price} / per night
  </div>
  </div>
  <div className="border rounded-2xl mt-4">
    <div className="flex">
      <div className="py-3 px-4">
        <label>Check in: </label>
        <input
          type="date"
          value={checkIn}
          onChange={(ev) => setCheckIn(ev.target.value)} // Corrected to onChange
        />
      </div>
      <div className="py-3 px-4 border-l">
        <label>Check out: </label>
        <input
          type="date"
          value={checkOut}
          onChange={(ev) => setCheckOut(ev.target.value)} // Corrected to onChange
        />
      </div>
    </div>
    <div>
      <div className="py-3 px-4 border-t">
        <label>Number of Guests: </label>
        <input
          type="number"
          value={numberOfGuest}
          onChange={(ev) => setNumberOfGuest(ev.target.value)} // Corrected the function name
        />
      </div>
    </div>
    {numberOfNights>0 && (
      <div className="py-3 px-4 border-t">
      <label>Your full name: </label>
      <input
        type="text"
        value={name}
        onChange={(ev) => setName(ev.target.value)} // Corrected the function name
      />
      <label>Phone number: </label>
      <input
        type="tel"
        value={phone}
        onChange={(ev) => setPhone(ev.target.value)} // Corrected the function name
      />
    </div>
    )}
  </div>


  <button onClick={bookThisPlace} className="primary mt-4">Book this place 
    {numberOfNights>0  && (
      <span> for {numberOfNights} Days $ {numberOfNights* place.price} </span>
    )}
  </button>

</div>

    )
}