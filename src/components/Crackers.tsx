import React, { useRef, useEffect, useState } from "react";
import { create } from "canvas-confetti";

interface Props {
	gameOver?: boolean;
}

function Crackers({ gameOver }: Props) {
	const [showConfetti, setShowConfetti] = useState<boolean>(gameOver === true);
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => setShowConfetti(gameOver === true), [gameOver]);

	useEffect(() => {
		if (canvasRef.current !== null && showConfetti) {
			const confetti = create(canvasRef.current, {
				resize: true,
			});
			confetti({
				particleCount: 500,
				spread: 200,
			});
			setTimeout(() => setShowConfetti(false), 4000);

			return () => {
				confetti.reset();
			};
		}
	}, [showConfetti, canvasRef]);

	if (!showConfetti) return null;
	return <canvas ref={canvasRef}></canvas>;
}

export { Crackers };
