import React, { useState } from "react";
import Map, {
  Marker,
  NavigationControl,
  FullscreenControl,
  Popup,
} from "react-map-gl";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import "mapbox-gl/dist/mapbox-gl.css";

interface PropertyMapProps {
  latitude: number;
  longitude: number;
  address: string;
  title: string;
}

const PropertyMap: React.FC<PropertyMapProps> = ({
  latitude,
  longitude,
  address,
  title,
}) => {
  const [showPopup, setShowPopup] = useState(false);

  const openInGoogleMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    window.open(url, "_blank");
  };

  return (
    <Card className="overflow-hidden">
      <div className="relative w-full h-96">
        <Map
          initialViewState={{
            latitude: latitude,
            longitude: longitude,
            zoom: 15,
            pitch: 50,
          }}
          mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
          mapStyle="mapbox://styles/mapbox/streets-v12"
          interactive={true}
          attributionControl={true}
        >
          <Marker
            latitude={latitude}
            longitude={longitude}
            anchor="bottom"
            onClick={() => setShowPopup(true)}
          >
            <div className="text-red-500">
              <MapPin className="h-8 w-8" />
            </div>
          </Marker>

          {showPopup && (
            <Popup
              latitude={latitude}
              longitude={longitude}
              anchor="top"
              onClose={() => setShowPopup(false)}
              closeButton={true}
            >
              <div className="p-2">
                <p className="font-medium">{title}</p>
                <p className="text-sm text-muted-foreground">{address}</p>
              </div>
            </Popup>
          )}

          <NavigationControl position="bottom-right" />
          <FullscreenControl position="top-right" />
        </Map>

        <div className="absolute top-4 left-4 z-10">
          <Button
            variant="secondary"
            size="sm"
            className="shadow-lg"
            onClick={openInGoogleMaps}
          >
            <MapPin className="h-4 w-4 mr-2" />
            Open in Google Maps
          </Button>
        </div>

        <div className="absolute bottom-4 left-4 z-10 bg-background/90 p-2 rounded-lg shadow-lg max-w-[300px]">
          <p className="text-sm font-medium truncate">{address}</p>
        </div>
      </div>
    </Card>
  );
};

export default PropertyMap;
