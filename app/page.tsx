import Header from "./components/Header";
import AuthOrSearchSection from "./components/AuthOrSearchSection";
import DogResults from "./components/DogResults";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-purple-100 dark:bg-gray-900 transition-colors duration-200 flex flex-col">
      <Header />
      <main className="w-full max-w-screen-xl mx-auto py-8 flex-grow">
        <AuthOrSearchSection />
        <DogResults />
      </main>
      <Footer />
    </div>
  );
}
