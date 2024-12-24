import React, { useState, useMemo } from "react";
import Map, { Marker, Popup } from "react-map-gl";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { Euro, X } from "lucide-react";
import "mapbox-gl/dist/mapbox-gl.css";
import { Listing } from "@/lib/db/schema";

interface ListingsMapProps {
  listings: Listing[];
}

interface ClusteredMarker {
  listing: Listing;
  offset: [number, number];
}

const ListingsMap: React.FC<ListingsMapProps> = ({ listings }) => {
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [zoom, setZoom] = useState(5.5); // Initial zoom level

  // Function to calculate offsets based on zoom level
  const calculateOffset = (
    index: number,
    total: number,
    zoom: number
  ): [number, number] => {
    const baseRadius = 0.0005; // Base radius for spacing
    const scaledRadius = baseRadius / Math.pow(2, zoom - 10); // Scale based on zoom
    const angle = (2 * Math.PI * index) / total; // Angle for circular placement
    const offsetX = Math.cos(angle) * scaledRadius;
    const offsetY = Math.sin(angle) * scaledRadius;
    return [offsetX, offsetY]; // Return as tuple
  };

  // Group listings by location and calculate offsets
  const clusteredMarkers = useMemo(() => {
    const markers: ClusteredMarker[] = [];
    const locationGroups: { [key: string]: Listing[] } = {};

    listings.forEach((listing) => {
      const key = `${Number(listing.latitude).toFixed(6)}-${Number(listing.longitude).toFixed(
        6
      )}`;
      if (!locationGroups[key]) {
        locationGroups[key] = [];
      }
      locationGroups[key].push(listing);
    });

    Object.values(locationGroups).forEach((group) => {
      if (group.length === 1) {
        markers.push({
          listing: group[0],
          offset: [0, 0],
        });
      } else {
        group.forEach((listing, index) => {
          const offset = calculateOffset(index, group.length, zoom);
          markers.push({
            listing,
            offset,
          });
        });
      }
    });

    return markers;
  }, [listings, zoom]);

  return (
    <>
      <Map
        initialViewState={{
          latitude: 46.603354, // Center of France
          longitude: 1.888334,
          zoom: 5.5,
        }}
        onZoom={(e) => setZoom(e.viewState.zoom)} // Update zoom level dynamically
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        style={{
          width: "100%",
          height: "90vh",
          borderRadius: "8px",
        }}
      >
        {clusteredMarkers.map(({ listing, offset }) => (
          <Marker
            key={listing.id}
            latitude={Number(listing.latitude) + offset[1]}
            longitude={Number(listing.longitude) + offset[0]}
            onClick={(e) => {
              e.originalEvent.stopPropagation();
              setSelectedListing(listing);
            }}
          >
            <div
              className="transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedListing(listing);
              }}
            >
              <div className="bg-primary text-primary-foreground px-2 py-1 rounded-lg shadow-lg font-semibold hover:scale-105 transition-transform">
                €{Math.floor(Number(listing.price)).toLocaleString()}
              </div>
            </div>
          </Marker>
        ))}

        {selectedListing && (
          <Popup
            latitude={Number(selectedListing.latitude)}
            longitude={Number(selectedListing.longitude)}
            closeOnClick={false}
            onClose={() => setSelectedListing(null)}
            offset={[0, -15]}
          >
            <div className="bg-background rounded-lg shadow-lg overflow-hidden w-72 relative">
              {/* Close Button */}
              <Button
                size="icon"
                variant="ghost"
                className="absolute top-2 left-2 h-8 w-8 bg-background/80 hover:bg-background z-10"
                onClick={() => setSelectedListing(null)}
              >
                <X className="h-4 w-4" />
              </Button>

              <div className="relative h-36">
                <img
                  src={selectedListing.images?.[0]?.url || "/placeholder.png"}
                  alt={selectedListing.title}
                  className="object-cover w-full h-full"
                />
                <Badge
                  className="absolute top-2 right-2"
                  variant={
                    selectedListing.listingType === "sale"
                      ? "default"
                      : selectedListing.listingType === "rent"
                      ? "secondary"
                      : "outline"
                  }
                >
                  {selectedListing.listingType === "sale"
                    ? "For Sale"
                    : selectedListing.listingType === "rent"
                    ? "For Rent"
                    : "Vacation Rental"}
                </Badge>
              </div>

              <div className="p-3">
                <h3 className="font-semibold text-base mb-1 line-clamp-1">
                  {selectedListing.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-2 line-clamp-1">
                  {selectedListing.address}, {selectedListing.city}
                </p>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1 font-semibold">
                    <Euro className="h-4 w-4" />
                    {Number(selectedListing.price).toLocaleString()}
                  </div>
                  <Button asChild size="sm">
                    <Link href={`/listings/${selectedListing.slug}`}>
                      View Details
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </Popup>
        )}
      </Map>
    </>
  );
};

export default ListingsMap;
