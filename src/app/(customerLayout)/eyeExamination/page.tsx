import Image from "next/image";
import { Lora } from "next/font/google";
const lora = Lora({ subsets: ["latin"], weight: ["400", "700"] });

export default function EyeExaminationInfoPage() {
    return (
        <div className="flex flex-col">
            <div className="flex justify-center items-center">
                <Image 
                    src="/informationPageImages/EyeExam.jpg" 
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
            Ögonundersökning</h1>
        <hr className="my-4 mt-3 border-t border-teal-700" />
        <div className="p-6 max-w-4xl mx-auto text-black">
            
        <p className="mb-4">
          Regelbundna ögonundersökningar är viktiga för att upptäcka synproblem tidigt och förhindra allvarliga ögonsjukdomar.
          En standard synundersökning inkluderar:
        </p>

        <div className="space-y-4">
          <div className="flex">
            <h3 className="text-xl text-teal-700 font-semibold">Synskärpa Test :  </h3>
            <p className="mt-1 px-1"> Mäter hur tydligt du kan se bokstäver eller symboler på olika avstånd.</p>
          </div>

          <div className="flex">
            <h3 className="text-xl text-teal-700 font-semibold">Refraktionstest : </h3>
            <p className="mt-1 px-1">Avgör om du behöver glasögon eller kontaktlinser.</p>
          </div>

          <div className="flex">
            <h3 className="text-xl text-teal-700 font-semibold">Ögontryckstest (tonometri) : </h3>
            <p className="mt-1 px-1">Kontrollerar efter tecken på glaukom, ett tillstånd som kan leda till synförlust.</p>
          </div>

          <div className="flex">
            <h3 className="text-xl text-teal-700 font-semibold">Färgblindhetstest : </h3>
            <p className="mt-1 px-1">Identifierar eventuella svårigheter att urskilja vissa färger.</p>
          </div>

          <div className="flex">
            <h3 className="text-xl text-teal-700 font-semibold">Djupuppfattning och ögonrörelsetest : </h3>
            <p className="mt-1 px-1">Mäter hur väl dina ögon koordinerar och spårar rörelser.</p>
          </div>
        </div>


        <h2 className="text-2xl text-teal-700 font-semibold mt-8 mb-3">Hur ofta bör du göra en synundersökning?</h2>
        <ul className="list-disc ml-6 px-4 space-y-2 text-black">
          <li><strong>Barn och tonåringar:</strong> Minst en gång vartannat år eller enligt rekommendationerna.</li>
          <li><strong>Vuxna (18–39):</strong> Vartannat år om du inte har synproblem.</li>
          <li><strong>Vuxna (40+):</strong> Vart 1–2 år, eftersom åldrande ökar risken för ögonsjukdomar.</li>
          <li><strong>Seniorer (60+):</strong> Årligen för att kontrollera glaukom, grå starr och makuladegeneration.</li>
        </ul>
      </div>
      <hr className="my-4 mt-3 border-t border-teal-700" />
      </div>
            
    );
}