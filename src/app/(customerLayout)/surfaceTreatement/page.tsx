import Image from "next/image";
import { Lora } from "next/font/google";
const lora = Lora({ subsets: ["latin"], weight: ["400", "700"] });

export default function SurfaceTreatmentInfoPage() {
    return (
        <div className="flex flex-col">
           
            <div className="flex justify-center items-center">
                <Image 
                    src="/informationPageImages/SurfaceTreatement.jpg" 
                    alt="Glasses"
                    width={0} 
                    height={0} 
                    sizes="1000vw" 
                    style={{ width: '100%', height: 'auto' }}
                    className="border border-gray-300 mb-2 shadow-lg rounded"
                />
            </div>
            <hr className="my-4 mt-3 border-t border-teal-700" />
              <h1 className={`${lora.className} text-3xl font-bold text-center text-primary`}>
              Ytbehandling - Förbättra dina linser</h1>
            <hr className="my-4 mt-3 border-t border-teal-700" />
            <div className="p-6 max-w-4xl mx-auto text-black">
  
            <p className="mb-4 text-black">
              Förbättra hållbarheten, klarheten och funktionaliteten hos dina linser med våra toppmoderna ytbehandlingar.
              Dessa specialiserade beläggningar skyddar inte bara dina glasögon från dagligt slitage utan förbättrar också visuella prestanda
              genom att minska bländning, stöta bort damm och vatten och filtrera bort skadligt ljus.
              Oavsett om du vill ha skarpare mörkerseende, skydd mot digital ansträngning av ögonen eller linser som håller sig renare längre,
              säkerställer våra avancerade behandlingar att dina glasögon förblir så effektiva och bekväma som möjligt i alla miljöer.
            </p>

  
          <h3 className="text-xl font-semibold mb-2 text-teal-700">Våra alternativ för ytbehandling:</h3>

          <div className="space-y-6">
            
            <div className="px-4">
              <p className="font-semibold">Anti-reflekterande beläggning (AR-beläggning):</p>
              <ul className="list-disc ml-5 px-4 text-black">
                <li>Minskar bländning från skärmar och strålkastare.</li>
                <li>Förbättrar mörkerseendet och minskar belastningen på ögonen.</li>
              </ul>
            </div>

            <div className="px-4">
              <p className="font-semibold">Reptålig beläggning:</p>
              <ul className="list-disc px-4 ml-5 text-black">
                <li>Förlänger linsens livslängd och förhindrar mindre repor.</li>
                <li>Perfekt för dagligt bruk och aktiv livsstil.</li>
              </ul>
            </div>

            <div className="px-4">
              <p className="font-semibold">Blåljusblockerande beläggning:</p>
              <ul className="list-disc px-4 ml-5 text-black">
                <li>Filtrerar skadligt blått ljus från skärmar.</li>
                <li>Minskar digital ögonbelastning och förbättrar sömnkvaliteten.</li>
              </ul>
            </div>

            <div className="px-4">
              <p className="font-semibold">UV-skyddsbeläggning:</p>
              <ul className="list-disc px-4 ml-5 text-black">
                <li>Skyddar dina ögon från 100% UV-strålar.</li>
                <li>Förhindrar långvariga ögonskador som grå starr.</li>
              </ul>
            </div>

            <div className="px-4">
              <p className="font-semibold">Vatten- och kladdsäker beläggning:</p>
              <ul className="list-disc px-4 ml-5 text-black">
                <li>Avvisar vatten, damm och fingeravtryck.</li>
                <li>Håller linserna klarare längre.</li>
              </ul>
            </div>
        </div>
      </div>
      <hr className="my-4 mt-3 border-t border-teal-700" />
    </div>
            
    );
}