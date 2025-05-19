'use client';

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Tables } from "@/integrations/supabase/types";
import TripOfferCard from "@/components/trip/TripOfferCard";

export default function TripOffersPage() {
  const [offers, setOffers] = useState<Tables<"flight_offers">[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const tripId = searchParams.get("id");

  useEffect(() => {
    async function fetchOffers() {
      if (!tripId) return;

      const { data, error } = await supabase
        .from("flight_offers")
        .select("*")
        .eq("trip_request_id", tripId);

      if (error) {
        console.error("Error fetching offers:", error);
      } else {
        setOffers(data);
      }
      setLoading(false);
    }

    fetchOffers();
  }, [tripId]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Trip Offers ✈️</h1>
      {loading ? (
        <p>Loading offers...</p>
      ) : offers.length === 0 ? (
        <p>No offers found.</p>
      ) : (
<ul className="grid grid-cols-1 gap-4">
  {offers.map((offer) => (
    <TripOfferCard key={offer.id} offer={offer} />
  ))}
        </ul>
      )}
    </div>
  );
}
