const Newsletter = () => {
  return (
    <div className="bg-primary text-white py-12">
      <div className="container mx-auto px-4 text-center">
        <h3 className="text-3xl font-serif font-bold mb-4">
          Stay Informed with National Crusader
        </h3>
        <p className="text-lg mb-8 max-w-2xl mx-auto">
          Get daily updates on the intersection of faith and politics delivered straight to your inbox.
        </p>
        <form className="max-w-md mx-auto flex gap-4">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 px-4 py-2 rounded text-primary"
          />
          <button className="bg-secondary text-primary px-6 py-2 rounded font-semibold hover:bg-opacity-90 transition-colors">
            Subscribe
          </button>
        </form>
      </div>
    </div>
  );
};

export default Newsletter;