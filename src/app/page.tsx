import Calculator from "@/components/calculator";

// Worked out once when the static site is built
const YEAR = new Date().getFullYear();

export default function Home() {
  return <Calculator year={YEAR} />;
}
