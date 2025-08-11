import Image from "next/image";
import { Lora } from "next/font/google";
const lora = Lora({ subsets: ["latin"], weight: ["400", "700"] });

export default function WhenToVisitDoctortInfoPage() {
    return (
        <div className="flex flex-col">

            <div className="flex justify-center items-center">
                <Image 
                    src="/informationPageImages/VisitDoctor.jpg" 
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
              När man ska träffa en ögonläkare</h1>
            <hr className="my-4 mt-3 border-t border-teal-700" />
            <div className="p-6 max-w-4xl mx-auto text-black">
            
            <p className="mb-4">
              Om du upplever något av följande symtom, schemalägg en synundersökning omedelbart:
            </p>

            <ul className="list-disc ml-6 space-y-2 px-4 text-black">
              <li>Plötsliga synförändringar (suddig syn, dubbelseende eller synförlust)</li>
              <li>Frekvent huvudvärk relaterad till ansträngda ögon</li>
              <li>Ögonsmärta, rodnad eller svullnad</li>
              <li>Svårigheter att se på natten eller i svag belysning</li>
              <li>Ökad ljuskänslighet</li>
              <li>Flytare eller blinkande lampor (kan indikera problem med näthinnan)</li>
              <li>Överdriven rivning eller torrhet</li>
              <li>Svårigheter att läsa eller fokusera på nära eller avlägsna föremål</li>
            </ul>

            <p className="mt-6 font-medium text-black">
              Även om du inte har symtom hjälper regelbundna ögonundersökningar att förhindra framtida problem!
            </p>
          </div>
          <hr className="my-4 mt-3 border-t border-teal-700" />
      </div>
            
    );
}