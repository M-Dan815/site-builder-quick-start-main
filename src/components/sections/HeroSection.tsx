
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto text-center max-w-4xl">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          The Ultimate Developer Database for Tech Recruiters
        </h1>
        <p className="text-xl text-gray-300 mb-8 leading-relaxed">
          Access a comprehensive, automatically updated database of software developers. 
          Save time and resources while finding the perfect candidates for your clients.
        </p>
        <div className="flex justify-center">
          <Button 
            size="lg" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
            onClick={scrollToContact}
          >
            Get Started Today
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
