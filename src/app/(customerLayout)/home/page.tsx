import Image from "next/image";
import { Lora } from "next/font/google";
const lora = Lora({ subsets: ["latin"], weight: ["400", "700"] });

export default function About() {

  return (

    <div className="flex flex-col">
        <div className="flex justify-center items-center">
            <Image 
            src="/informationPageImages/CoverImage.png" 
            alt="OvesOptik"
            width={0} 
            height={0} 
            sizes="1000vw" 
            style={{ width: '100%', height: 'auto' }} 
            className="pb-5 max-w-full border border-gray-300 shadow-lg rounded" 
            />
        </div>
        <hr className="my-4 mt-3 border-t border-teal-700" />
            <h1 className={`${lora.className} text-3xl font-bold text-center text-primary`}>
            Om Oves optik
            </h1>
        <hr className="my-4 mt-3 border-t border-teal-700" />
        <div className="p-6 max-w-4xl mx-auto text-black">
            
            <p className="text-base sm:text-lg mb-10">Oves Optik är ett familjeägt företag dedikerat till att 
            ge exceptionell ögonvård och snygga glasögon till våra kunder. I många år har vi varit stolta över att erbjuda personlig service, bygga varaktiga relationer med våra kunder och se till att 
            varje kund går ut med glasögon som passar perfekt och passar deras unika stil</p>
            
            <h1 className="text-2xl sm:text-3xl font-bold my-4 text-teal-700">Vår vision och värderingar</h1>

            <p className="text-base sm:text-lg">På Oves Optik tror vi att 
            glasögon inte bara är en funktionell nödvändighet, 
            utan ett sätt att uttrycka din personlighet och stil. 
            Vår passion för optik driver oss att tillhandahålla högkvalitativa 
            produkter och expertråd, så att du kan fatta välgrundade beslut 
            om din ögonhälsa. Med fokus på komfort, kvalitet och design ser vi till 
            att våra kunder får det bästa värdet för sin investering</p>
        </div>

        <div className="p-6 max-w-4xl mx-auto text-black">
            <h1 className="text-2xl sm:text-3xl font-bold my-4 text-teal-700">Vårt urval</h1>
            <p className="text-base sm:text-lg mb-5">Vi erbjuder ett stort och mångsidigt 
            urval av glasögon från pålitliga och välkända varumärken. 
            Oavsett om du letar efter snygga, professionella bågar, 
            trendig design eller klassiska, tidlösa stilar, har vi något för alla. 
            Vårt lager inkluderar ramar gjorda av en mängd olika material som lätt titan, 
            hållbart acetat och miljövänliga alternativ.</p>
            <p className="text-base sm:text-lg mb-5">På Oves Optik tror vi att bra glasögon 
            ska vara tillgängliga för alla, och vårt uppdrag 
            är att ge varje kund den perfekta kombinationen av kvalitet, stil och komfort.</p>
        </div>
        <hr className="my-4 mt-3 border-t border-teal-700" />
    </div>
  )};