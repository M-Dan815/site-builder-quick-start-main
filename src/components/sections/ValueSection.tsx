
const ValueSection = () => {
  return (
    <section id="value" className="py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-4xl font-bold text-center mb-12">Your Competitive Advantage</h2>
        <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
          <blockquote className="text-lg text-gray-300 italic leading-relaxed">
            "As a tech recruitment agency, you understand the importance of having access to the best and most talented software developers. 
            Our database provides you with a competitive advantage by enabling you to quickly and efficiently find suitable candidates for your clients, 
            saving you time and resources while providing them with the best talent available."
          </blockquote>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 mt-12">
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold text-blue-400">Save Time & Money</h3>
            <p className="text-gray-300">
              Stop manually searching and vetting candidates. Our curated database eliminates the time-consuming process of finding qualified developers.
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold text-green-400">Increase Success Rate</h3>
            <p className="text-gray-300">
              With verified contact information and up-to-date profiles, you'll have higher response rates and better candidate quality.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ValueSection;
