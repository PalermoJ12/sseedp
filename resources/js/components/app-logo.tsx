import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
    return (
        <div className="flex items-center gap-2">
            {/* DepED Logo */}
            <img 
                src="/images/deped.png" 
                alt="Department of Education" 
                className="h-8 w-auto object-contain"
            />
            
            {/* BLSS Logo */}
            <img 
                src="/images/blss.png" 
                alt="Bureau of Learner Support Services" 
                className="h-8 w-auto object-contain"
            />
            
            {/* SSD Logo */}
            <img 
                src="/images/ssd.png" 
                alt="School Sports Division" 
                className="h-8 w-auto object-contain"
            />
            
            {/* Sports Club Logo */}
            <img 
                src="/images/school_sports_club.png" 
                alt="Inclusive Active Enjoyable School Sports Club" 
                className="h-8 w-auto object-contain"
            />
            
           
        </div>
    );
}