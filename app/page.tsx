import Header from "./components/Header";
import AuthOrSearchSection from "./components/AuthOrSearchSection";
import DogResults from "./components/DogResults";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <div className="bg-[radial-gradient(circle_at_15%_0%,#412c63_-10%,#9b4ed9_75%)] dark:bg-[radial-gradient(circle_at_15%_0%,#2d1c47_-10%,#412c63_75%)] min-h-screen transition-colors duration-200 flex flex-col">
      <Header />
      <main className="w-full max-w-screen-xl mx-auto py-8 flex-grow">
        <AuthOrSearchSection />
        <DogResults />
      </main>
      <Footer />
    </div>
  );
}
