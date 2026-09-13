import { ClockLab, DataLab, LengthLab, NumberGarden, ShapeLab, SharingLab } from "./cycle-two-labs";
import { AlgorithmLab, AngleLab, AreaLab, BalanceLab, DecimalGridLab, FractionLineLab, ProbabilityLab, ProportionLab } from "./cycle-three-labs";
import { FractionSlicer } from "./fraction-slicer";
import { CalculationLab, MeasureLab, MoneyLab, NumberLineLab, PlaceValueLab, StoryLab } from "./number-labs";
import { FunctionLab, SolidLab, SymmetryLab, TriangleLab, VectorLab } from "./geometry-labs";
import type { LabId } from "@/lib/labs";
import type { Locale } from "@/lib/site";

export function LessonLab({ id, locale }: { id: LabId; locale: Locale }) {
  switch (id) {
    case "garden": return <NumberGarden locale={locale} />;
    case "place": return <PlaceValueLab locale={locale} />;
    case "largePlace": return <PlaceValueLab locale={locale} large />;
    case "line": return <NumberLineLab locale={locale} />;
    case "signedLine": return <NumberLineLab locale={locale} signed />;
    case "calculation": return <CalculationLab locale={locale} />;
    case "multiplication": return <CalculationLab locale={locale} multiply />;
    case "story": return <StoryLab locale={locale} />;
    case "sharing": return <SharingLab locale={locale} />;
    case "pizza": return <FractionSlicer locale={locale} />;
    case "length": return <LengthLab locale={locale} />;
    case "measure": return <MeasureLab locale={locale} />;
    case "money": return <MoneyLab locale={locale} />;
    case "clock": return <ClockLab locale={locale} />;
    case "shape": return <ShapeLab locale={locale} />;
    case "solid": return <SolidLab locale={locale} />;
    case "symmetry": return <SymmetryLab locale={locale} />;
    case "data": return <DataLab locale={locale} />;
    case "fraction": return <FractionLineLab locale={locale} />;
    case "decimal": return <DecimalGridLab locale={locale} />;
    case "balance": return <BalanceLab locale={locale} />;
    case "area": return <AreaLab locale={locale} />;
    case "angle": return <AngleLab locale={locale} />;
    case "probability": return <ProbabilityLab locale={locale} />;
    case "proportion": return <ProportionLab locale={locale} />;
    case "robot": return <AlgorithmLab locale={locale} />;
    case "triangle": return <TriangleLab locale={locale} />;
    case "function": return <FunctionLab locale={locale} />;
    case "vector": return <VectorLab locale={locale} />;
  }
}
