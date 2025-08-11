import Image from "next/image";
import { Lora } from "next/font/google";
const lora = Lora({ subsets: ["latin"], weight: ["400", "700"] });

export default function EyeCareTipsInfoPage() {
    return (
        <div className="flex flex-col">
            <div className="flex justify-center items-center">
                <Image 
                    src="/informationPageImages/EyeTips.jpg" 
                    alt="Glasses"
                    width={0} 
                    height={0} 
                    sizes="1000vw" 
                    style={{ width: '100%', height: 'auto' }}
                    className="border border-gray-300 shadow-lg rounded"
                />
            </div>
        <hr className="my-4 ,t-3 border-t border-teal-700" />
        <h1 className={`${lora.className} mt-2 text-3xl font-bold text-center text-primary`}>
            Ögonvårdstips</h1>
        <hr className="my-4 mt-3 border-t border-teal-700" />
        <div className="p-6 max-w-4xl mx-auto text-black">
        
        <p className="mb-4 mt-2">
          Att ta hand om dina ögon är avgörande för att bibehålla god syn och förebygga framtida problem. Följ dessa viktiga ögonvårdstips:
        </p>
        <h3 className="text-xl text-teal-700 font-semibold mt-4 mb-2"> 1. Behåll en hälsosam kost</h3>
        <div className="px-6">
        <p>En kost rik på vitaminer och näringsämnen kan hjälpa till att upprätthålla ögonhälsan:</p>
        <ul className="list-disc ml-5 text-black mt-1 space-y-1">
          <li>Vitamin A: Finns i morötter, sötpotatis och spenat och stödjer ett gott nattseende.</li>
          <li>Vitamin C & E: Finns i citrusfrukter, nötter och frön och hjälper till att förhindra åldersrelaterad synförlust.</li>
          <li>Omega-3-fettsyror: Finns i fisk som lax och tonfisk, de stödjer näthinnans funktion och minskar torra ögon.</li>
        </ul>
        </div>
        
        <h3 className="text-xl text-teal-700 font-semibold mt-4 mb-2">2. Skydda dina ögon från UV-strålar</h3>
        <div className="px-6">
        <ul className="list-disc ml-5 text-black space-y-1">
          <li>Bär solglasögon med 100 % UVA- och UVB-skydd.</li>
          <li>Använd bredbrättade hattar för extra skugga på soliga dagar.</li>
          <li>Undvik direkt exponering för starkt solljus, särskilt mellan 10:00 och 16:00.</li>
        </ul>
        </div>
       
        <h3 className="text-xl text-teal-700 font-semibold mt-4 mb-2">3. Minska skärmbelastningen</h3>
        <div className="px-6">
          <ul className="list-disc ml-5 text-black space-y-1">
            <li>Följ 20-20-20-regeln: Var 20:e minut, titta på något 20 fot bort i 20 sekunder.</li>
            <li>Justera skärmens ljusstyrka och håll den på armlängds avstånd.</li>
            <li>Använd blåljusfilter på dina enheter.</li>
          </ul>
        </div>
      
        <h3 className="text-xl text-teal-700 font-semibold mt-4 mb-2">4. Håll ögonen fuktiga</h3>
        <div className="px-6">
          <ul className="list-disc ml-5 text-black space-y-1">
            <li>Drick mycket vatten för att förhindra torrhet.</li>
            <li>Använd konstgjorda tårar om du upplever torra ögon.</li>
            <li>Undvik överdriven luftkonditionering eller uppvärmning, som kan torka ut dina ögon.</li>
          </ul>
        </div>
      
        <h3 className="text-xl text-teal-700 font-semibold mt-4 mb-2">5. Få tillräckligt med sömn</h3>
        <div className="px-6">
          <ul className="list-disc ml-5 text-black space-y-1">
            <li>Sömnbrist kan leda till trötthet i ögonen, rodnad och svullnad.</li>
            <li>Sikta efter 7-9 timmars sömn per natt.</li>
          </ul>
        </div>
       
        <h3 className="text-xl text-teal-700 font-semibold mt-4 mb-2">6. Öva korrekt ögonhygien</h3>
        <div className="px-6"> 
        <ul className="list-disc ml-5 text-black space-y-1">
          <li>Tvätta alltid händerna innan du rör vid ögonen eller hanterar kontaktlinser.</li>
          <li>Ta bort smink innan du sover för att förhindra ögoninfektioner.</li>
          <li>Undvik att gnugga ögonen, eftersom det kan sprida bakterier.</li>
        </ul>
        </div>

        
        <h3 className="text-xl text-teal-700 font-semibold mt-4 mb-2">7. Sluta röka</h3>
        <div className="px-6"> 
          <ul className="list-disc ml-5 text-black space-y-1">
            <li>Rökning ökar risken för grå starr, makuladegeneration och skador på synnerven.</li>
            <li>Om du röker, sök hjälp att sluta för din allmänna hälsa och ögonhälsa.</li>
          </ul>
        </div>
      </div>
      <hr className="my-4 border-t border-teal-700" />
    </div>
            
    );
}