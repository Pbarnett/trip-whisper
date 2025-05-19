"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

type Offer = {
  id: string;
  airline: string;
  flight_number: string;
  departure_date: string;
  departure_time: string;
  return_date: string;
  return_time: string;
  duration: string;
  price: number;
};

export default function TripOfferCard({ offer }: { offer: Offer }) {
  const router = useRouter();

  const handleSelect = () => {
    console.log("Selected offer", offer.id);
    router.push(`/trip/confirm?id=${offer.id}`);
  };

  return (
    <div className="border rounded-lg p-4 shadow">
      <div className="text-lg font-semibold mb-2">
        {offer.airline} <span className="text-sm text-gray-500">{offer.flight_number}</span>
      </div>
      <div className="text-sm text-gray-600 space-y-1">
        <p><strong>Departure:</strong> {offer.departure_date} at {offer.departure_time}</p>
        <p><strong>Return:</strong> {offer.return_date} at {offer.return_time}</p>
        <p><strong>Flight Duration:</strong> {offer.duration}</p>
        <p><strong>Price:</strong> ${offer.price}</p>
      </div>
      <Button onClick={handleSelect} className="mt-4 w-full">
        Select This Flight
      </Button>
    </div>
  );
}
