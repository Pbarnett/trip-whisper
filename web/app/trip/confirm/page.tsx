"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

type Offer = {
  id: string;
  trip_request_id: string;
  airline: string;
  flight_number: string;
  departure_date: string;
  departure_time: string;
  return_date: string;
  return_time: string;
  duration: string;
  price: number;
};

export default function TripConfirmPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const offerId = searchParams.get("id");

  const [offer, setOffer] = useState<Offer | null>(null);
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    if (!offerId) return;

    const loadOffer = async () => {
      const { data, error } = await supabase
        .from("flight_offers")
        .select("*")
        .eq("id", offerId)
        .single();

      if (error || !data) {
        toast({
          title: "Offer not found",
          description: error?.message || "Unable to load flight details.",
          variant: "destructive",
        });
        return;
      }

      setOffer(data as Offer);
    };

    loadOffer();
  }, [offerId]);

  const handleConfirm = async () => {
    if (!offer) return;
    setIsBooking(true);

    const { data: session } = await supabase.auth.getSession();
    const userId = session.session?.user.id;

    if (!userId) {
      toast({
        title: "Not logged in",
        description: "Please sign in to confirm your booking.",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase.from("bookings").insert({
      user_id: userId,
      trip_request_id: offer.trip_request_id,
      flight_offer_id: offer.id,
    });

    if (error) {
      toast({
        title: "Booking failed",
        description: error.message,
        variant: "destructive",
      });
      setIsBooking(false);
      return;
    }

    toast({
      title: "Flight booked!",
      description: `You booked ${offer.airline} flight ${offer.flight_number}`,
    });

    router.push("/dashboard");
  };

  if (!offer) return <p className="p-6 text-sm text-gray-500">Loading...</p>;

  return (
    <div className="max-w-xl mx-auto p-6 space-y-4">
      <h1 className="text-xl font-bold">Confirm Your Flight</h1>
      <div className="border rounded p-4 shadow bg-white space-y-2">
        <p><strong>Airline:</strong> {offer.airline}</p>
        <p><strong>Flight:</strong> {offer.flight_number}</p>
        <p><strong>Departure:</strong> {offer.departure_date} at {offer.departure_time}</p>
        <p><strong>Return:</strong> {offer.return_date} at {offer.return_time}</p>
        <p><strong>Duration:</strong> {offer.duration}</p>
        <p><strong>Price:</strong> ${offer.price}</p>
      </div>
      <Button onClick={handleConfirm} disabled={isBooking} className="w-full">
        {isBooking ? "Booking..." : "Confirm Booking"}
      </Button>
    </div>
  );
}
