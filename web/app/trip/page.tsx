import Link from "next/link";

export default function TripIndexPage() {
  return (
    <main className="p-8">
      <h1 className="text-2xl mb-4">Trip Section</h1>
      <ul className="list-disc list-inside space-y-2">
        <li><Link href="/trip/new">Create a new trip</Link></li>
        <li><Link href="/trip/offers">See offers</Link></li>
      </ul>
    </main>
  );
}

