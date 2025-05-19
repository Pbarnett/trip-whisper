'use client';

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { generateMockOffers } from "@/services/mockOffers";

const departureOptions = [
  { label: "Boston Logan (BOS)", value: "BOS" },
  { label: "Chicago O’Hare (ORD)", value: "ORD" },
  { label: "Los Angeles (LAX)", value: "LAX" },
  { label: "Dallas-Fort Worth (DFW)", value: "DFW" },
  { label: "Denver (DEN)", value: "DEN" },
  { label: "San Francisco (SFO)", value: "SFO" },
  { label: "Seattle (SEA)", value: "SEA" },
  { label: "Miami (MIA)", value: "MIA" },
  { label: "Phoenix (PHX)", value: "PHX" },
];

const destinationOptions = [
  { label: "Martha’s Vineyard (MVY)", value: "MVY" },
  { label: "Nantucket (ACK)", value: "ACK" },
  { label: "Aspen (ASE)", value: "ASE" },
  { label: "Palm Springs (PSP)", value: "PSP" },
  { label: "Jackson Hole (JAC)", value: "JAC" },
  { label: "East Hampton (HTO)", value: "HTO" },
  { label: "Naples, FL (APF)", value: "APF" },
  { label: "Charleston, SC (CHS)", value: "CHS" },
  { label: "Key West (EYW)", value: "EYW" },
  { label: "Lake Tahoe / Reno (RNO)", value: "RNO" },
];

const formSchema = z.object({
  earliestDeparture: z.string(),
  latestDeparture: z.string(),
  min_duration: z.number().min(1).max(30),
  max_duration: z.number().min(1).max(30),
  budget: z.number().min(100).max(10000),
  departure_airports: z.array(z.string()).min(1, "Select at least one departure airport"),
  destination_airport: z.string().optional(),
  destination_other: z.string().optional(),
  other_departure_airport: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function TripRequestForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      departure_airports: [],
    },
  });

const onSubmit = async (data: FormValues) => {
  setIsSubmitting(true);

  try {
    const user = await supabase.auth.getUser();
    const userId = user.data.user?.id;

    if (!userId) {
      toast({
        title: "Not logged in",
        description: "You must be logged in to submit a trip.",
        variant: "destructive",
      });
      return;
    }

    const combinedAirports = [...(data.departure_airports || [])];
    if (data.other_departure_airport) {
      combinedAirports.push(data.other_departure_airport);
    }

    const destination = data.destination_airport || data.destination_other;

    const tripRequest = {
      user_id: userId,
      earliest_departure: data.earliestDeparture,
      latest_departure: data.latestDeparture,
      min_duration: data.min_duration,
      max_duration: data.max_duration,
      budget: data.budget,
      departure_airports: combinedAirports,
      destination_airport: destination,
    };

    const { data: inserted, error } = await supabase
      .from("trip_requests")
      .insert([tripRequest])
      .select()
      .single();

    if (error || !inserted) {
      toast({
        title: "Error submitting trip",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    // Generate mock offers
    const offers = generateMockOffers(inserted.id);

    const { error: offersError } = await supabase
      .from("flight_offers")
      .insert(offers);

    if (offersError) {
      toast({
        title: "Failed to generate offers",
        description: offersError.message,
        variant: "destructive",
      });
      return;
    }

    router.push(`/trip/offers?id=${inserted.id}`);
  } catch (err: any) {
    toast({
      title: "Unexpected error",
      description: err.message || "Something went wrong.",
      variant: "destructive",
    });
  } finally {
    setIsSubmitting(false);
  }
};
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label>Earliest Departure</label>
        <input type="date" {...register("earliestDeparture")} />
        {errors.earliestDeparture && <p>{errors.earliestDeparture.message}</p>}
      </div>
      <div>
        <label>Latest Departure</label>
        <input type="date" {...register("latestDeparture")} />
        {errors.latestDeparture && <p>{errors.latestDeparture.message}</p>}
      </div>
      <div>
        <label>Minimum Duration (days)</label>
        <input type="number" {...register("min_duration", { valueAsNumber: true })} />
        {errors.min_duration && <p>{errors.min_duration.message}</p>}
      </div>
      <div>
        <label>Maximum Duration (days)</label>
        <input type="number" {...register("max_duration", { valueAsNumber: true })} />
        {errors.max_duration && <p>{errors.max_duration.message}</p>}
      </div>
      <div>
        <label>Budget ($)</label>
        <input type="number" {...register("budget", { valueAsNumber: true })} />
        {errors.budget && <p>{errors.budget.message}</p>}
      </div>
      <div>
        <label>Departure Airports (NYC)</label>
        <div className="flex flex-col gap-1">
          <label><input type="checkbox" value="JFK" {...register("departure_airports")} /> JFK</label>
          <label><input type="checkbox" value="LGA" {...register("departure_airports")} /> LGA</label>
          <label><input type="checkbox" value="EWR" {...register("departure_airports")} /> EWR</label>
        </div>
        {errors.departure_airports && <p>{errors.departure_airports.message}</p>}
      </div>
      <div>
        <label>Other Departure Airport</label>
        <select {...register("other_departure_airport")}>  
          <option value="">-- Select --</option>
          {departureOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Or type another code (e.g. BNA)"
          {...register("other_departure_airport")}
        />
      </div>
      <div>
        <label>Destination Airport</label>
        <select {...register("destination_airport")}>  
          <option value="">-- Select a popular destination --</option>
          {destinationOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Or type another destination code"
          {...register("destination_other")}
        />
      </div>
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
}
