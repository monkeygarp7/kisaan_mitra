import { Leaf, Sprout, Wheat, Sun, Cloud, Flower2 } from "lucide-react";

function FarmingMotion() {
  const leaves = Array.from({ length: 18 }, (_, i) => i + 1);
  const fireflies = Array.from({ length: 12 }, (_, i) => i + 1);
  return (
    <div className="farming-motion" aria-hidden="true">
      <div className="farming-orb orb-one" />
      <div className="farming-orb orb-two" />
      <div className="farm-horizon" />
      <Leaf className="farm-float farm-leaf-one" />
      <Leaf className="farm-float farm-leaf-two" />
      <Sprout className="farm-float farm-sprout" />
      <Wheat className="farm-float farm-wheat" />
      <Sun className="farm-float farm-sun" />
      <Cloud className="farm-float farm-cloud" />
      <Flower2 className="farm-float farm-flower" />
      <div className="falling-leaves">
        {leaves.map((n) => <span key={n} className={`falling-leaf leaf-${n}`}><Leaf size={12 + (n % 4) * 3} /></span>)}
      </div>
      <div className="firefly-field">
        {fireflies.map((n) => <span key={n} className={`firefly firefly-${n}`} />)}
      </div>
      <span className="farm-particle particle-one" />
      <span className="farm-particle particle-two" />
      <span className="farm-particle particle-three" />
      <span className="farm-particle particle-four" />
      <span className="farm-particle particle-five" />
    </div>
  );
}
export default FarmingMotion;
