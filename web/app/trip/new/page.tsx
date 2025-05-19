import TripRequestForm from "@/components/trip/TripRequestForm";

export default function TripNewPage() {
  return (
    <div className="max-w-xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold mb-6">Create a New Trip</h1>
      <TripRequestForm />
    </div>
  );
}
