const Footer = () => {
  return (
    <footer className="bg-primary text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h4 className="font-serif font-bold text-xl mb-4">National Crusader</h4>
            <p className="text-gray-300">
              Delivering thoughtful coverage at the intersection of faith and politics.
            </p>
          </div>
          <div>
            <h5 className="font-bold mb-4">Sections</h5>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-secondary">Politics</a></li>
              <li><a href="#" className="hover:text-secondary">Faith</a></li>
              <li><a href="#" className="hover:text-secondary">Nation</a></li>
              <li><a href="#" className="hover:text-secondary">World</a></li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold mb-4">Company</h5>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-secondary">About Us</a></li>
              <li><a href="#" className="hover:text-secondary">Contact</a></li>
              <li><a href="#" className="hover:text-secondary">Careers</a></li>
              <li><a href="#" className="hover:text-secondary">Ethics Policy</a></li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold mb-4">Follow Us</h5>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-secondary">Twitter</a></li>
              <li><a href="#" className="hover:text-secondary">Facebook</a></li>
              <li><a href="#" className="hover:text-secondary">LinkedIn</a></li>
              <li><a href="#" className="hover:text-secondary">Instagram</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
          <p>&copy; 2024 National Crusader. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;