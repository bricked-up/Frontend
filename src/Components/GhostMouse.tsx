import { useEffect } from "react";

const GhostMouse: React.FC = () => {
  useEffect(() => {
    const pageX = window.innerWidth;
    const pageY = window.innerHeight;

    const handleMouseMove = (event: MouseEvent) => {
      const mouseY = event.pageY;
      const yAxis = ((pageY / 2 - mouseY) / pageY) * 300;

      const mouseX = event.pageX / -pageX;
      const xAxis = -mouseX * 100 - 100;

      const eyes = document.querySelector(".box__ghost-eyes") as HTMLElement;
      if (eyes) {
        eyes.style.transform = `translate(${xAxis}%, -${yAxis}%)`;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return <></>; //empty React fragment cause it doesn't need to render anything
};

export default GhostMouse;
