const HeroSection = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div className="animate-fade-in">
          <span className="text-secondary font-semibold">Featured</span>
          <h2 className="text-4xl font-serif font-bold mt-2 mb-4">
            Faith and Democracy: The Evolving Role of Religion in Modern Politics
          </h2>
          <p className="text-accent text-lg mb-6">
            An in-depth analysis of how religious values continue to shape political discourse and policy-making in contemporary society.
          </p>
          <button className="bg-primary text-white px-6 py-2 rounded hover:bg-opacity-90 transition-colors">
            Read More
          </button>
        </div>
        <div className="h-[400px] bg-gray-200 rounded-lg">
          {/* Placeholder for hero image */}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;