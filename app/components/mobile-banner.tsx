import { Smartphone, X } from 'lucide-react';
import { useState } from 'react';

export function MobileBanner() {
    const [isVisible, setIsVisible] = useState(true);

    const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.yourapp.cosflow'; // Remplacez par votre lien

    if (!isVisible) return null;

    return (
        <div className="md:hidden fixed top-16 left-0 right-0 z-40 bg-gradient-to-r from-primary to-tertiary p-3 shadow-lg">
            <div className="flex items-center gap-3">
                {/* Icon */}
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Smartphone className="w-5 h-5 text-white" />
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-semibold">Téléchargez l'app mobile</p>
                    <p className="text-white/80 text-xs truncate">Meilleure expérience sur mobile</p>
                </div>

                {/* CTA Button */}
                <a
                    href={PLAY_STORE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white text-primary px-4 py-2 rounded-lg text-sm font-semibold hover:bg-white/90 transition-all flex-shrink-0"
                >
                    Ouvrir
                </a>

                {/* Close button */}
                <button
                    onClick={() => setIsVisible(false)}
                    className="w-8 h-8 flex items-center justify-center text-white/80 hover:text-white flex-shrink-0"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}