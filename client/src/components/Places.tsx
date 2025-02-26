import { useEffect } from 'react'

const Places = () => {
    useEffect(() => {
        console.log('something');
        
      const findPlaces = async() => {
        const apiKey = import.meta.env.VITE_PLACES_API_KEY
        const userLocation = await getUserLocation(); // Get user's location dynamically
        console.log("User's Location:", userLocation);
        const url = 'https://places.googleapis.com/v1/places:searchNearby'
        const requestBody = {
            includedTypes: ["restaurant"], // Example: Searching for restaurants
            maxResultCount: 10, // Limit the results
            locationRestriction: {
                circle: {
                    center: userLocation,
                    radius: 5000 // 5 km radius
                }
            }
        };
    
        try {
            const response = await fetch(`${url}?key=${apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Goog-Api-Key': apiKey,
                    'X-Goog-FieldMask': '*' // Adjust field mask based on required response fields
                },
                body: JSON.stringify(requestBody)
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
    
            const data = await response.json();
            console.log('Nearby Places:', data);
        } catch (error) {
            console.error('Error fetching nearby places:', error);
        }
  
      }
      findPlaces()
    }, [])
    async function getUserLocation() {
        return new Promise((resolve, reject) => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        resolve({
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude
                        });
                    },
                    (error) => {
                        reject(error);
                    }
                );
            } else {
                reject(new Error("Geolocation is not supported by this browser."));
            }
        });
    }
    
  return (
    <div>Places</div>
  )
}

export default Places