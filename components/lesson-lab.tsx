"use client";

import dynamic from "next/dynamic";
import type { LabId } from "@/lib/labs";

const NumberGarden = dynamic(() => import("./cycle-two-labs").then((m) => m.NumberGarden));
const SharingLab = dynamic(() => import("./cycle-two-labs").then((m) => m.SharingLab));
const ClockLab = dynamic(() => import("./cycle-two-labs").then((m) => m.ClockLab));
const ShapeLab = dynamic(() => import("./cycle-two-labs").then((m) => m.ShapeLab));
const LengthLab = dynamic(() => import("./cycle-two-labs").then((m) => m.LengthLab));
const DataLab = dynamic(() => import("./cycle-two-labs").then((m) => m.DataLab));

const FractionLineLab = dynamic(() => import("./cycle-three-labs").then((m) => m.FractionLineLab));
const DecimalGridLab = dynamic(() => import("./cycle-three-labs").then((m) => m.DecimalGridLab));
const BalanceLab = dynamic(() => import("./cycle-three-labs").then((m) => m.BalanceLab));
const AreaLab = dynamic(() => import("./cycle-three-labs").then((m) => m.AreaLab));
const AngleLab = dynamic(() => import("./cycle-three-labs").then((m) => m.AngleLab));
const ProbabilityLab = dynamic(() => import("./cycle-three-labs").then((m) => m.ProbabilityLab));
const ProportionLab = dynamic(() => import("./cycle-three-labs").then((m) => m.ProportionLab));
const AlgorithmLab = dynamic(() => import("./cycle-three-labs").then((m) => m.AlgorithmLab));

const FractionSlicer = dynamic(() => import("./fraction-slicer").then((m) => m.FractionSlicer));

const PlaceValueLab = dynamic(() => import("./number-labs").then((m) => m.PlaceValueLab));
const CalculationLab = dynamic(() => import("./number-labs").then((m) => m.CalculationLab));
const NumberLineLab = dynamic(() => import("./number-labs").then((m) => m.NumberLineLab));
const MeasureLab = dynamic(() => import("./number-labs").then((m) => m.MeasureLab));
const StoryLab = dynamic(() => import("./number-labs").then((m) => m.StoryLab));
const MoneyLab = dynamic(() => import("./number-labs").then((m) => m.MoneyLab));

const SolidLab = dynamic(() => import("./geometry-labs").then((m) => m.SolidLab));
const SymmetryLab = dynamic(() => import("./geometry-labs").then((m) => m.SymmetryLab));
const TriangleLab = dynamic(() => import("./geometry-labs").then((m) => m.TriangleLab));

export function LessonLab({ id }: { id: LabId }) {
  switch (id) {
    case "garden": return <NumberGarden />;
    case "place": return <PlaceValueLab />;
    case "largePlace": return <PlaceValueLab large />;
    case "line": return <NumberLineLab />;
    case "signedLine": return <NumberLineLab signed />;
    case "calculation": return <CalculationLab />;
    case "multiplication": return <CalculationLab multiply />;
    case "story": return <StoryLab />;
    case "sharing": return <SharingLab />;
    case "pizza": return <FractionSlicer />;
    case "length": return <LengthLab />;
    case "measure": return <MeasureLab />;
    case "money": return <MoneyLab />;
    case "clock": return <ClockLab />;
    case "shape": return <ShapeLab />;
    case "solid": return <SolidLab />;
    case "symmetry": return <SymmetryLab />;
    case "data": return <DataLab />;
    case "fraction": return <FractionLineLab />;
    case "decimal": return <DecimalGridLab />;
    case "balance": return <BalanceLab />;
    case "area": return <AreaLab />;
    case "angle": return <AngleLab />;
    case "probability": return <ProbabilityLab />;
    case "proportion": return <ProportionLab />;
    case "robot": return <AlgorithmLab />;
    case "triangle": return <TriangleLab />;
  }
}
