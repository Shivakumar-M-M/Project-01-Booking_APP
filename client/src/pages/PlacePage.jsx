import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BookingWidget from "../BookingWidget";
import PlaceGallery from "../PlaceGallery";
import AddressLink from "../AddressLink";

export default function PlacePage() {
    const { id } = useParams();
    const [place, setPlace] = useState(null);
    const [showAllPhotos,setShowAllPhotos]=useState(false);

    useEffect(() => {
        if (!id) {
            return;
        } else {
            axios.get(`http://localhost:4000/places/${id}`).then(response => {
                setPlace(response.data);
            });
        }
    }, [id]);
    if(!place){
        return ' ';
    }




    return (
        <div className=" bg-gray-100 mt-4 -mx-8 px-8 pt-8">
            
            {/* {place ? (
                <h1>{place.extraInfo}</h1>
            ) : (
                <p>Loading...</p>
            )} */}

            {place && (
                <div >
                <h1 className="text-2xl">{place.title}</h1>
               <AddressLink place={place}></AddressLink>
               <PlaceGallery place={place}></PlaceGallery>
                <div>
                    
                </div>
                    <div className="grid mt-8 mb-4 gap-8 grid-cols-1 md:grid-cols-[2fr_1fr]">
                            

                            <div>
                            <div className="my-4">
                    <h2 className="font-semibold text-2xl">Description</h2>
                    {place.description}</div>
                            <b>Check-in: </b>{place.checkIn}<br></br>
                            <b>Check-out</b> {place.checkOut}
                            <br></br>
                          <b>  max numbetr of Guest: </b>6

                       
                            </div>
                            <div>
                      <BookingWidget place={place}></BookingWidget>
                    </div>
                    </div>
                        <div className="bg-white -mx-8 px-8 py-8 border-t">

                        <div>
                    <h1 className="font-semibold text-2xl">About this space</h1>
                    </div>
                    <div className="text-sm text-gray-700 leading-6 mt-4">{place.extraInfo}</div>
                        </div>

                </div>
            )}
            {!place && (
                 <p>Loading...</p>
            )}
        </div>
    );
}
