import { TablesInsert } from "@/integrations/supabase/types";
import { v4 as uuidv4 } from "uuid";

export function generateMockOffers(
  trip_request_id: string,
  count = 6
): TablesInsert<"flight_offers">[] {
  const airlines = ["Delta Airlines", "JetBlue", "United Airways", "Southwest", "Alaska Airlines", "British Airways"];
  const flightOffers: TablesInsert<"flight_offers">[] = [];

  for (let i = 0; i < count; i++) {
    const departureDate = new Date();
    departureDate.setDate(departureDate.getDate() + Math.floor(Math.random() * 10) + 1);

    const returnDate = new Date(departureDate);
    returnDate.setDate(returnDate.getDate() + Math.floor(Math.random() * 7) + 2);

    const offer: TablesInsert<"flight_offers"> = {
      id: uuidv4(),
      trip_request_id,
      airline: airlines[Math.floor(Math.random() * airlines.length)],
      flight_number: `FL${Math.floor(Math.random() * 9000) + 1000}`,
      departure_date: departureDate.toISOString().split("T")[0],
      departure_time: "08:00",
      return_date: returnDate.toISOString().split("T")[0],
      return_time: "18:00",
      duration: "3h 45m",
      price: Math.floor(Math.random() * 400) + 300,
      created_at: new Date().toISOString(),
    };

    flightOffers.push(offer);
  }

  return flightOffers;
}
