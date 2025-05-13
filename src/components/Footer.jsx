import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <>
      {/* Footer */}
      <footer className="bg-background border-t h-24 border-background py-4 px-4 flex items-center">
        <div className="container  mx-auto">
          <div className="flex flex-col items-center sm:gap-3 justify-center text-sm">
            {/* Logo and Copyright */}
            <div className="flex  items-center  sm:mb-4 md:mb-0 ">
              <img src="/offerSectionImage34.png" alt="Habib Catering" className="h-6 mr-2" />
              <span className="text-text">
                Habib Catering Copyright © {currentYear}. All Rights Reserved.
              </span>
            </div>
            
            {/* Links */}
            <div className="text-sm sm:text-base  space-x-4 text-text hidden sm:flex ">
              <Link to="/terms" className="hover:text-text/50 transition-colors">
                TERMS & CONDITIONS
              </Link>
              <span>|</span>
              <Link to="/privacy" className="hover:text-text/50 transition-colors">
                PRIVACY POLICY
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;