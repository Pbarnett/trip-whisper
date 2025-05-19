import { TablesInsert } from "@/integrations/supabase/types"

const newTrip: TablesInsert<"trip_requests"> = {
  user_id,
  earliest_departure,
  latest_departure,
  duration,
  budget,
}

const { data, error } = await supabase
  .from("trip_requests")
  .insert(newTrip)
  .select()

