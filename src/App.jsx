import { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
    const cells = Array.from({ length: 100 }, (_, i) => i);

    // 1) поправим баг с таймаутом
    // 2) нажимаем кнопку - начинается игра (после гейм овер)
    // 3) чтобы змейка могла выходить с другой стороны экрана


    const [snake, setSnake] = useState([55]);
    const [direction, setDirection] = useState(null);
    const [food, setFood] = useState(5);

    const intervalRef = useRef(null);
    const gameOverRef = useRef(false); // флаг для одного Game Over

    function randomEmptyCell(occupiedCells) {
        const emptyCells = Array.from({ length: 100 }, (_, i) => i).filter(
            (i) => !occupiedCells.includes(i)
        );
        return emptyCells[Math.floor(Math.random() * emptyCells.length)];
    }

    // Обработка клавиш
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "ArrowUp" && direction !== "down") setDirection("up");
            if (e.key === "ArrowDown" && direction !== "up") setDirection("down");
            if (e.key === "ArrowLeft" && direction !== "right") setDirection("left");
            if (e.key === "ArrowRight" && direction !== "left") setDirection("right");
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [direction]);

    // Движение змейки
    useEffect(() => {
        if (intervalRef.current) clearInterval(intervalRef.current);

        intervalRef.current = setInterval(() => {
            setSnake((prev) => {
                if (!direction) {
                    return prev;
                }

                const head = prev[0];
                let newHead = head;

                if (direction === "up") newHead = head - 10;
                if (direction === "down") newHead = head + 10;
                if (direction === "left") newHead = head - 1;
                if (direction === "right") newHead = head + 1;

                // Еда
                if (newHead === food) {
                    setFood(randomEmptyCell([newHead, ...prev]));
                    return [newHead, ...prev];
                } else {
                    return [newHead, ...prev.slice(0, -1)];
                }
            });
        }, 100);

        return () => clearInterval(intervalRef.current);
    }, [direction, food]);

    // Проверка столкновений
    useEffect(() => {
        const head = snake[0];
        if (
            head < 0 ||
            head >= 100 ||
            (direction === "left" && head % 10 === 0) ||
            (direction === "right" && head % 10 === 9) ||
            snake.slice(1).includes(head)
        ) {
            if (!gameOverRef.current) {
                gameOverRef.current = true;
                clearInterval(intervalRef.current);
                setTimeout(() => {
                    alert("Game Over!");
                    // авто-ресет
                    setSnake([55]);
                    setDirection(null);
                    setFood(randomEmptyCell([55]));
                    gameOverRef.current = false;
                }, 0);
            }
        }
    }, [snake, direction]);

    return (
        <div className="grid">
            {cells.map((cell) => {
                const isSnake = snake.includes(cell);
                const isFood = cell === food;
                return (
                    <div
                        key={cell}
                        className="cell"
                        style={{
                            backgroundColor: isSnake ? "#059669" : isFood ? "#e11d48" : "#34d399",
                        }}
                    ></div>
                );
            })}
        </div>
    );
}

export default App;