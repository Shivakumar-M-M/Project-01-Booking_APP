import { useState } from "react";

export default function PlaceGallery({place})
{
    const [showAllPhotos,setShowAllPhotos]=useState(false);
    if (showAllPhotos) {
        return (
            <divc>
                <h2  className="text-3xl m-2 ml-8">Photos of "{place.title}"</h2>
                <button onClick={()=>setShowAllPhotos(false)} className=" ml-8 p-3 rounded-xl flex gap-2 text-black-500 ">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
  <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
</svg>

                    Close Photos</button>
            <div className="absolute bg-white min-w-full min-h-screen p-8 grid grid-cols-3 gap-3">
               
                {place?.addedPhotos?.length > 0 && place.addedPhotos.map((photo, index) => (
                    <div key={index} className="w-auto h-96">
                        <img src={"http://localhost:4000/uploads/" + photo} className="w-full h-full object-cover" alt="" />
                    </div>
                ))}
               </div>
            </divc>
        );
    }
    

    return (
        <div className="relative">
<div className="grid gap-2 grid-cols-[2fr_1fr] rounded-3xl overflow-hidden ">
    <div>
        {place.addedPhotos?.[0] && (
            <div>
                <img  onClick={()=>setShowAllPhotos(true)} className="aspect-square object-cover cursor-pointer" src={'http://localhost:4000/uploads/'+place.addedPhotos[0]} alt=""></img>
            </div>
            
        )}
    </div>
    <div className="grid ">
    {place.addedPhotos?.[1] && (
            <img  onClick={()=>setShowAllPhotos(true)} className="aspect-square object-cover cursor-pointer" src={'http://localhost:4000/uploads/'+place.addedPhotos[1]} alt=""></img>
        )}
        <div className=" overflow-hidden">
        {place.addedPhotos?.[2] && (
            <img  onClick={()=>setShowAllPhotos(true)} className="aspect-square object-cover relative top-2 cursor-pointer" src={'http://localhost:4000/uploads/'+place.addedPhotos[2]} alt=""></img>
        )}
        </div>
    </div>
</div>
<button onClick={()=>setShowAllPhotos(true)}className=" flex gap-1 right-2 absolute bottom-0 py-2 px-4 bg-white rounded-2xl shadow shadow-md shadow-grey-500 mb-3 text-center">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
<path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z" clipRule="evenodd" />
</svg>


    Show more photos

</button>
        
</div>
    )
}