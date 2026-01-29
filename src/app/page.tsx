import MapWrapper from '@/components/MapWrapper';

export default function Home() {
  return (
    <div className="flex flex-col h-screen w-full bg-gray-50">
      <header className="bg-white border-b px-4 py-3 shadow-sm z-10 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">Library Pass Finder 🌲</h1>
        <div className="text-xs text-gray-500">Bay Area, CA</div>
      </header>

      <main className="flex-1 relative">
        <MapWrapper />
      </main>
    </div>
  );
}
