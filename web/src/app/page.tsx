import Compiler from "./_components/Compiler";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-100 to-white">
      <div className="container mx-auto py-8">
        <Compiler />
      </div>
    </main>
  );
}
