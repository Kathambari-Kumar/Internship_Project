
import Image from "next/image";
import { Lora } from "next/font/google";
const lora = Lora({ subsets: ["latin"], weight: ["400", "700"] });
export default function GlassesInfoPage() {
    
    return (

        <div className="flex flex-col">
            <div className="flex justify-center items-center">
                <Image 
                    src="/informationPageImages/GlassImage.jpg" 
                    alt="Glasses"
                    width={0} 
                    height={0} 
                    sizes="1000vw" 
                    style={{ width: '100%', height: 'auto' }}
                    className="border border-gray-300 shadow-lg rounded"
                />
            </div>
        <hr className="my-4 mt-3 border-t border-teal-700" />
        <h1 className={`${lora.className} text-3xl font-bold text-center text-primary`}>
            Glasögon
        </h1>
        
        <div>
        <hr className="my-4 mt-3 border-t border-teal-700" />
        <div className="p-6 max-w-4xl mx-auto text-black">
        <h2 className="text-2xl font-semibold text-teal-700 mb-2">Hitta ditt perfekta par glasögon</h2>
        <p className="text-black mb-4">
            Upptäck de perfekta glasögonen som passar din stil, personlighet och synbehov.
            Oavsett om du letar efter receptbelagda glasögon, läsglasögon, blå ljusblockerande
            linser eller de senaste modeglasögonen, har vi ett brett urval att välja mellan.
        </p>
        <p className="text-lg font-semibold mb-2 text-teal-700">
            Vår kollektion innehåller : </p>
            <ul className="list-disc pl-6 text-black space-y-2">
                <li><strong>Receptbelagda glasögon:</strong> Skräddarsydda för dina synbehov med linser av hög kvalitet.</li>
                <li><strong>Läsglasögon:</strong> Snygga och bekväma alternativ för tydlig, närbildsläsning.</li>
                <li><strong>Solglasögon:</strong> UV-skydd med trendiga och klassiska bågstilar.</li>
                <li><strong>Blåljusglasögon:</strong> Minska ögonbelastningen från digitala skärmar.</li>
                <li><strong>Designerbågar:</strong> Premiummärken och eleganta stilar för att lyfta din look.</li>
            </ul>
        </div>

        <div className="p-6 max-w-4xl mx-auto text-black">
        <p className="text-black">
            Välj bland en mängd olika former, färger och material för att matcha din personliga
            smak och komfort. Oavsett om du föredrar snygga metallbågar, hållbara acetatdesigner
            eller lätta kantlösa stilar, har vi något för alla!
        </p>
        </div>

        <div className="p-6 max-w-4xl mx-auto text-black">
        <h3 className="text-2xl font-semibold text-teal-700 mt-8">
            Förbättra din vision och stil idag!
        </h3>
        </div>
    </div>
    </div>
    );
}


