export default function PlaceImg({place,className=null})
{
    if(!place.addedPhotos?.length)
    {
        return ' ';
    }
    if(!className)
    {
        className="object-cover";
    }
    return(
      
            <img  src={`http://localhost:4000/uploads/${place.addedPhotos[0]}`} alt={place.title} className=" object-cover w-full h-full object-cover rounded-xl" />
      
        
    )
}