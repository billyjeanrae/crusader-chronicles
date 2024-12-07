const NewsGrid = () => {
  const articles = [
    {
      title: "Religious Leaders Call for Unity Amid Political Division",
      category: "Faith",
      excerpt: "Interfaith coalition emphasizes common values in joint statement.",
    },
    {
      title: "New Bill Sparks Debate on Religious Freedom",
      category: "Politics",
      excerpt: "Lawmakers discuss implications for faith-based organizations.",
    },
    {
      title: "Global Summit Addresses Faith in Governance",
      category: "World",
      excerpt: "International leaders explore role of religion in policy-making.",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <h3 className="text-2xl font-serif font-bold mb-8">Latest Stories</h3>
      <div className="grid md:grid-cols-3 gap-8">
        {articles.map((article, index) => (
          <article key={index} className="animate-fade-in" style={{ animationDelay: `${index * 0.2}s` }}>
            <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
            <span className="text-secondary text-sm font-semibold">
              {article.category}
            </span>
            <h4 className="text-xl font-serif font-bold mt-2 mb-2">
              {article.title}
            </h4>
            <p className="text-accent">{article.excerpt}</p>
          </article>
        ))}
      </div>
    </div>
  );
};

export default NewsGrid;