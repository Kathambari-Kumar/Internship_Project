
import Image from "next/image";
import { Lora } from "next/font/google";
const lora = Lora({ subsets: ["latin"], weight: ["400", "700"] });

export default function LensesInfoPage() {
    return (
        <div className="flex flex-col">
            <div className="flex justify-center items-center">
                <Image 
                    src="/informationPageImages/LenseImage.jpg" 
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
                 Linsor
              </h1>
            <hr className="my-4 mt-3 border-t border-teal-700" />
            <div>
          
              <div className="p-6 max-w-4xl mx-auto text-black">
                <h2 className="text-2xl font-semibold mb-2 text-teal-700">Linser – Precision för alla synbehov</h2>
                <p className="text-black px-4">
                  Vi tillhandahåller linser av hög kvalitet designade för klarhet, komfort och hållbarhet.
                  Oavsett om du behöver enkelseende, bifokala eller högindexlinser har vi det perfekta alternativet.
                </p>
              </div>

              <div className="p-6 max-w-4xl mx-auto text-black">
                <h3 className="text-xl font-semibold mb-3 text-teal-700">Typer av linser vi erbjuder:</h3>
                <div className="space-y-3 text-black">
                  <div> <strong className="px-4">Single-Vision linser : </strong> Idealiska för distans eller läsning.</div>
                  <div> <strong className="px-4">Bifokala linser : </strong> Två recept i ett för när- och fjärrseende.</div>
                  <div> <strong className="px-4">Trifokala linser : </strong> Tre fokuspunkter för nära, mellanliggande och långa avstånd.</div>
                  <div> <strong className="px-4">Högindexlinser : </strong> Tunnare och lättare för starkare recept.</div>
                  <div> <strong className="px-4">Fotokromatiska linser : </strong> Adaptiva linser som mörknar i solljus.</div>
                  <div> <strong className="px-4">Polariserade linser : </strong> Minska bländning och förbättra kontrasten, perfekt för utomhusaktiviteter.</div>
                </div>
              </div>
            </div>
          <hr className="my-4 mt-3 border-t border-teal-700" />               
          </div>
    );
}
