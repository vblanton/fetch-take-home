import Header from "./components/Header";
import AuthOrSearchSection from "./components/AuthOrSearchSection";
import DogResults from "./components/DogResults";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <div className="bg-[radial-gradient(circle_at_15%_0%,#5d4180_-10%,#b76df2_75%)] dark:bg-[radial-gradient(circle_at_15%_0%,#432961_-10%,#9544bd_75%)] min-h-screen transition-colors duration-200 flex flex-col">
      <Header />
      <main className="w-full max-w-screen-xl mx-auto py-8 flex-grow">
        <AuthOrSearchSection />
        <DogResults />
      </main>
      <Footer />
    </div>
  );
}
