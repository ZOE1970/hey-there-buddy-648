import React from 'react'; 
 
interface FooterProps { 
  companyName?: string; 
  year?: number; 
} 
 
const Footer: React.FC<FooterProps> = ({ 
  companyName = "Data Protection Office", 
  year = 2025 
}) => { 
  return ( 
    <footer className="bg-primary text-primary-foreground py-4 mt-auto"> 
      <div className="container mx-auto px-4"> 
        <div className="text-center"> 
          <p className="text-primary-foreground/80 text-sm"> 
            © {year} {companyName}. All rights reserved. 
          </p> 
        </div> 
      </div> 
    </footer> 
  ); 
};

export default Footer;