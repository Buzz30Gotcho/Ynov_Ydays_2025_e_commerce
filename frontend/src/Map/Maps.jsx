// src/components/Map.js
import React, { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const defaultCenter = { lat: 48.8566, lng: 2.3522 }; // Paris par défaut

const Map = ({ shops }) => {
  const [userLocation, setUserLocation] = useState(null);

  // 1️⃣ Récupérer la localisation de l'utilisateur
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          alert("Impossible de récupérer votre position, localisation par défaut utilisée.");
        }
      );
    } else {
      alert("Votre navigateur ne supporte pas la géolocalisation.");
    }
  }, []);

  return (
    <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={userLocation || defaultCenter}
        zoom={13}
      >
        {/* Marqueurs des shops */}
        {shops.map((shop) => (
          <Marker
            key={shop.id}
            position={{ lat: shop.latitude, lng: shop.longitude }}
            title={shop.name}
          />
        ))}

        {/* Marqueur de l'utilisateur */}
        {userLocation && (
          <Marker
            position={userLocation}
            title="Vous êtes ici"
            icon={{
              url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
            }}
          />
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default Map;
