const NewsTicker = () => {
  const news = [
    "Breaking: Senate Passes New Religious Freedom Bill",
    "Supreme Court to Hear Major Case on Prayer in Schools",
    "New Poll Shows Shifting Religious Demographics in Key States",
  ];

  return (
    <div className="bg-primary text-white py-2 overflow-hidden">
      <div className="news-ticker whitespace-nowrap">
        {news.map((item, index) => (
          <span key={index} className="mx-8">
            {item} •
          </span>
        ))}
      </div>
    </div>
  );
};

export default NewsTicker;