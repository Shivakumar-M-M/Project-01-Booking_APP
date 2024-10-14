import { Link, Navigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Perks from "../Perks";
import axios from "axios";
import PhotosUploader from "../PhotosUploader";
import AccountNav from "../AccountNav";
export default function PlacesFormPage()
{
  const {id}=useParams();
  
  
  const [title, setTitle] = useState('');
  const [address, setAddress] = useState('');
  const [addedPhotos, setAddedPhotos] = useState([]);
  const [photoLink, setPhotoLink] = useState('');
  const [description, setDescription] = useState('');
  const [perks, setPerks] = useState('');
  const [extraInfo, setExtraInfo] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [maxGuests, setMaxGuests] = useState(1);
  const [redirect,setRedirect]=useState(false);
  const [price,setPrice]=useState(100);
  const [redirectToPlacesList,setRedirectToPlacesList]=useState(false);

useEffect(()=>{
if(!id)
{
  return;
}
else{
  axios.get('/places/'+id).then(response=>{
    const {data}=response;
    setTitle(data.title);
    setAddress(data.address);
    setAddedPhotos(data.photos);
    setDescription(data.description);
    setPerks(data.perks);
    setExtraInfo(data.extraInfo);
    setCheckIn(data.checkIn);
    setCheckOut(data.checkOut);
    setMaxGuests(data.maxGuests);
    setPrice(data.price);
  })
}
},[id]);

  function inputHeader(text) {
    return <h2 className="text-2xl mt-4">{text}</h2>;
  }

  function inputDescription(text) {
    return <p className="text-gray-500 text-sm">{text}</p>;
  }

  function preInput(header, description) {
    return (
      <div>
        {inputHeader(header)}
        {inputDescription(description)}
      </div>
    );
  }
  async function savePlace(ev) {
    ev.preventDefault();
    const placeData = {
      title, address, addedPhotos, description, perks, extraInfo, checkIn, checkOut, maxGuests,price
    };
    
    const token = localStorage.getItem("token");
    
    // Check if token exists
    console.log(token);
    
    try {
      if (id) {
        // Send PUT request with token in headers
        await axios.put('http://localhost:4000/places', 
          { id, ...placeData },  // Pass the data object with id included
          {
            headers: {
              Authorization: `Bearer ${token}`, // Set token in headers
            },
          }
        );
      } else {
        // Send POST request with token in headers
        await axios.post('http://localhost:4000/places', 
          placeData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
      setRedirect(true);  // Redirect after successful request
    } catch (error) {
      console.error("Failed to add or update place:", error);
      alert("An error occurred while adding the place. Please try again.");
    }
  }
  
  // async function savePlace(ev) {
  //   ev.preventDefault();
  //   const placeData={
  //      title, address, addedPhotos, description, perks, extraInfo, checkIn, checkOut, maxGuests 
  //   };
  //   // Retrieve the token from localStorage (or sessionStorage, if used)
  //   const token = localStorage.getItem("token");
    
  //   // Check if token exists
  //   console.log(localStorage.getItem("token"));


  //   // if(id)
  //   //   {
  //   //    await axios.put('http://localhost:4000/places',{
  //   //     id,...placeData
  //   //    });
  //   //    setRedirect(true);
  //   //   }
  //   //   else{
  
  //   //     await axios.post('http://localhost:4000/places',placeData);
  //   //     setRedirect(true);
        
  //   // }

  //   if(id)
  //   {
      
  //     try {
  //       await axios.post('http://localhost:4000/places',
  //       id,...placeData,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${token}`, // Attach token in the Authorization header
  //           },
  //         },
  //         setRedirect(true)
         
  //       );
        
  //     } catch (error) {
  //       console.error("Failed to add new place:", error);
  //       alert("An error occurred while adding the place. Please try again.");
  //     }

  //   }
  //   else{
  //     try {
  //       await axios.post('http://localhost:4000/places',
  //         ...placeData,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${token}`, // Attach token in the Authorization header
  //           },
  //         },
  //         setRedirect(true)
         
  //       );
        
  //     } catch (error) {
  //       console.error("Failed to add new place:", error);
  //       alert("An error occurred while adding the place. Please try again.");
  //     }

  //   }   
  // }
  
if(redirect)
{
    return (
        <Navigate to={'/account/places'}></Navigate>
    )
}
    return (
<div>
    <AccountNav></AccountNav>
          <form onSubmit={savePlace}>
            {preInput('Title', 'Title for your place should be short')}
            <input
              type="text"
              value={title}
              onChange={ev => setTitle(ev.target.value)}
              placeholder="Title e.g., My Sweet Home"
              className="w-full border rounded-md px-3 py-2 mt-1"
            />

            {preInput('Address', 'Address for this place')}
            <input
              type="text"
              value={address}
              onChange={ev => setAddress(ev.target.value)}
              placeholder="Address"
              className="w-full border rounded-md px-3 py-2 mt-1"
            />

            {preInput('Photos', 'More photos = better')}
            <PhotosUploader addedPhotos={addedPhotos} onChange={setAddedPhotos}></PhotosUploader>

            {preInput('Description', 'Description of the place')}
            <textarea
              className="w-full h-40 border my-1 py-2 px-3 rounded-2xl"
              placeholder="Describe your place"
              value={description}
              onChange={ev => setDescription(ev.target.value)}
            ></textarea>

            {preInput('Perks', 'Select all the perks of your place')}
            <div className="grid gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
              <Perks selected={perks} onChange={setPerks}></Perks>
            </div>

            {preInput('Extra information', 'House condition and rules')}
            <textarea
              value={extraInfo}
              onChange={ev => setExtraInfo(ev.target.value)}
              className="w-full h-40 border my-1 py-2 px-3 rounded-2xl"
            ></textarea>

            {preInput('Check-in & Check-out times', 'Add check-in and out times, allowing time for cleaning')}
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-2">
              <div>
                <h3 className="mt-2 -mb-1">Check-in time</h3>
                <input
                  type="number"
                  value={checkIn}
                  onChange={ev => setCheckIn(ev.target.value)}
                  placeholder="14:00"
                />
              </div>

              <div>
                <h3 className="mt-2 -mb-1">Check-out time</h3>
                <input
                  type="number"
                  value={checkOut}
                  onChange={ev => setCheckOut(ev.target.value)}
                  placeholder="11:00"
                />
              </div>

              <div>
                <h3 className="mt-2 -mb-1">Max number of guests</h3>
                <input
                  type="number"
                  value={maxGuests}
                  onChange={ev => setMaxGuests(ev.target.value)}
                />
              </div>
       
              <div>
                <h3 className="mt-2 -mb-1">Price per night</h3>
                <input
                  type="number"
                  value={price}
                  onChange={ev => setPrice(ev.target.value)}
                />
              </div>





            </div>
            <button className="gap-1 text-center mt-3 bg-red-500 p-2 text-white w-full rounded-full"> Save</button>
          </form>
        </div>
    );
}