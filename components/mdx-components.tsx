import { Callout, QuickCheck } from "./lesson-components";
import { FractionSlicer } from "./fraction-slicer";
import { ClockLab, DataLab, LengthLab, NumberGarden, ShapeLab, SharingLab } from "./cycle-two-labs";
import { AlgorithmLab, AngleLab, AreaLab, BalanceLab, DecimalGridLab, FractionLineLab, ProbabilityLab, ProportionLab } from "./cycle-three-labs";

export function mdxComponents(locale: "fr" | "en") {
  return {
    AlgorithmLab: () => <AlgorithmLab locale={locale} />,
    AngleLab: () => <AngleLab locale={locale} />,
    AreaLab: () => <AreaLab locale={locale} />,
    BalanceLab: () => <BalanceLab locale={locale} />,
    Callout,
    ClockLab: () => <ClockLab locale={locale} />,
    DataLab: () => <DataLab locale={locale} />,
    DecimalGridLab: () => <DecimalGridLab locale={locale} />,
    FractionSlicer: () => <FractionSlicer locale={locale} />,
    FractionLineLab: () => <FractionLineLab locale={locale} />,
    LengthLab: () => <LengthLab locale={locale} />,
    NumberGarden: () => <NumberGarden locale={locale} />,
    ProbabilityLab: () => <ProbabilityLab locale={locale} />,
    ProportionLab: () => <ProportionLab locale={locale} />,
    QuickCheck: (props: { answer: string }) => <QuickCheck {...props} locale={locale} />,
    ShapeLab: () => <ShapeLab locale={locale} />,
    SharingLab: () => <SharingLab locale={locale} />,
  };
}
