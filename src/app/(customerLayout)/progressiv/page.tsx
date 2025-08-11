
import Image from "next/image";
import { Lora } from "next/font/google";
const lora = Lora({ subsets: ["latin"], weight: ["400", "700"] });

export default function ProgressiveInfoPage() {

    return (
        <div className="flex flex-col">

            <div className="flex justify-center items-center">
                <Image 
                    src="/informationPageImages/Progressiv.jpg" 
                    alt="Glasses"
                    width={0} 
                    height={0} 
                    sizes="1000vw" 
                    style={{ width: '100%', height: 'auto' }} 
                    className="pb-5 max-w-full border border-gray-300 shadow-lg rounded" 
                />
            </div> 
            <hr className="my-4 mt-3 border-t border-teal-700" />
            <h1 className={`${lora.className} text-3xl font-bold text-center text-primary`}>
                  Progressiv</h1>

            <hr className="my-4 mt-3 border-t border-teal-700" />
            <div className="p-6 max-w-4xl mx-auto text-black">
            
            <h2 className="text-2xl font-semibold mb-3 text-teal-700">Progressiva glasögon - 
                  Seamless Vision på alla avstånd</h2>          
            <p className="mb-4 px-3">
              Progressiva glasögon erbjuder en mjuk och naturlig övergång mellan nära-, mellan- och fjärrseende – allt i en lins!
              Till skillnad från bifokala glasögon har dessa glasögon inga synliga linjer, vilket gör dem mer eleganta, funktionella
              och bekväma för dagligt bruk.
            </p>

  
            <h3 className="text-xl text-teal-700 font-semibold mb-2">Varför välja progressiva glasögon?</h3>
            <ul className="list-disc ml-5 mb-6 px-4 text-black space-y-2">
              <li>Inga synliga glasögon – Njut av en elegant, modern look.</li>
              <li>Smidig synövergång – Inga plötsliga hopp mellan avstånden.</li>
              <li>Perfekt för dagliga aktiviteter - Perfekt för läsning, datorarbete och bilkörning.</li>
              <li>Anpassningsbara mönster - Skräddarsydda efter ditt recept och din livsstil.</li>
            </ul>

  
            <h3 className="text-xl font-semibold mb-2 text-teal-700">Typer av progressiva glasögon:</h3>
            <ul className="list-disc px-4 ml-5 text-black space-y-2">
              <li>Standard progressiva glasögon – Prisvärda och idealiska för förstagångsanvändare.</li>
              <li>Premium Digital Progressives – Bredare, distorsionsfri syn med avancerad teknik.</li>
              <li>Office/Computer Progressives – Optimerad för skärmarbete och skrivbordsjobb.</li>
              <li>Short-Corridor Progressives – Designad för mindre ramar och aktiv livsstil.</li>
            </ul>
          </div>
        <hr className="my-4 mt-3 border-t border-teal-700" />
        </div>
    )};