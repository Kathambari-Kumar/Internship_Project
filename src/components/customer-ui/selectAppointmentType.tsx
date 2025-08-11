"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

// prps is a callback function that takes a value and returns nothing
type Props = {
  onComplete: (value: { isAdult: boolean; isGlasses: boolean }) => void;
};

export default function SelectAppointmentType({ onComplete }: Props) {
  const [ageGroup, setAgeGroup] = useState<"adult" | "child" | undefined>(
    undefined
  );
  const [product, setProduct] = useState<"glasses" | "linser" | undefined>(
    undefined
  );
  const handleNext = () => {
    if (ageGroup && product) {
      onComplete({
        isAdult: ageGroup === "adult",
        isGlasses: product === "glasses",
      });
    }
  };

  return (
    <div className="flex flex-col item-center mt-6 gap-8">
      <div>    
        <h2 className="text-2xl mb-2">Välj Åldersgrupp</h2>
        <ToggleGroup
          type="single"
          value={ageGroup}
          onValueChange={(val) => {
            if (val) setAgeGroup(val as "adult" | "child");
          }}
          className="flex gap-4"
        >
          <ToggleGroupItem className="text-1xl" value="adult" aria-label="Adult">
            👤 Vuxen
          </ToggleGroupItem>
          <ToggleGroupItem className="text-1xl" value="child" aria-label="Child">
            👶 Barn
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div>
        <h2 className="text-2xl  mb-2">Välj Undersökning</h2>
        <ToggleGroup
          type="single"
          value={product}
          onValueChange={(val) => {
            if (val) setProduct(val as "glasses" | "linser");
          }}
          className="flex gap-4"
        >
          <ToggleGroupItem className="text-1xl" value="glasses" aria-label="Glasses">
            👓 Glasögon
          </ToggleGroupItem>
          <ToggleGroupItem className="text-1xl" value="linser" aria-label="Linser">
            👁️ Kontaktlinser
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <Button
        disabled={!ageGroup || !product}
        onClick={handleNext} // Call the onComplete function with the selected values
        className="mt-4"
      >
        Nästa
      </Button>
    </div>
  );
}
