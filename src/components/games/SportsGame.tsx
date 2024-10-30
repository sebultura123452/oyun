import React, { useRef, useEffect, useState } from 'react';
import { Trophy, Gamepad2 } from 'lucide-react';

interface GameState {
  ball: {
    x: number;
    y: number;
    dx: number;
    dy: number;
    radius: number;
    rotation: number;
  };
  players: {
    x: number;
    y: number;
    width: number;
    height: number;
    speed: number;
    score: number;
    power: number;
    isJumping: boolean;
    jumpPower: number;
  }[];
  goals: {
    x: number;
    y: number;
    width: number;
    height: number;
  }[];
  particles: {
    x: number;
    y: number;
    dx: number;
    dy: number;
    life: number;
    color: string;
  }[];
}

const SportsGame: React.FC<{ gameType: 'football' | 'basketball' | 'volleyball' }> = ({ gameType }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [gameState, setGameState] = useState<GameState>(() => createInitialState());
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<number | null>(null);
  const [showControls, setShowControls] = useState(true);

  function createInitialState(): GameState {
    return {
      ball: {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        dx: 0,
        dy: 0,
        radius: 15,
        rotation: 0
      },
      players: [
        { x: 100, y: window.innerHeight / 2, width: 40, height: 80, speed: 8, score: 0, power: 0, isJumping: false, jumpPower: 15 },
        { x: window.innerWidth - 140, y: window.innerHeight / 2, width: 40, height: 80, speed: 8, score: 0, power: 0, isJumping: false, jumpPower: 15 }
      ],
      goals: [
        { x: 50, y: window.innerHeight / 2 - 75, width: 20, height: 150 },
        { x: window.innerWidth - 70, y: window.innerHeight / 2 - 75, width: 20, height: 150 }
      ],
      particles: []
    };
  }

  // Resize handler
  useEffect(() => {
    const handleResize = () => {
      if (!canvasRef.current) return;
      
      canvasRef.current.width = window.innerWidth;
      canvasRef.current.height = window.innerHeight;
      
      setGameState(createInitialState());
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Game loop
  useEffect(() => {
    if (!isPlaying || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let lastTime = 0;
    const fps = 60;
    const frameInterval = 1000 / fps;

    const gameLoop = (timestamp: number) => {
      if (timestamp - lastTime >= frameInterval) {
        // Update game state
        setGameState(prevState => {
          const newState = { ...prevState };
          
          // Update ball physics
          newState.ball.x += newState.ball.dx;
          newState.ball.y += newState.ball.dy;
          newState.ball.rotation += newState.ball.dx * 0.1;

          // Ball collision with walls
          if (newState.ball.y - newState.ball.radius <= 0 || 
              newState.ball.y + newState.ball.radius >= canvas.height) {
            newState.ball.dy *= -0.8;
            addBounceParticles(newState, newState.ball.x, newState.ball.y);
          }

          // Ball collision with goals
          newState.goals.forEach((goal, index) => {
            if (newState.ball.x >= goal.x && 
                newState.ball.x <= goal.x + goal.width &&
                newState.ball.y >= goal.y &&
                newState.ball.y <= goal.y + goal.height) {
              // Score!
              const scoringTeam = index === 0 ? 1 : 0;
              newState.players[scoringTeam].score += 1;
              addGoalParticles(newState, goal.x + goal.width / 2, goal.y + goal.height / 2);

              // Reset ball
              newState.ball.x = canvas.width / 2;
              newState.ball.y = canvas.height / 2;
              newState.ball.dx = 0;
              newState.ball.dy = 0;

              // Check for game over
              if (newState.players[scoringTeam].score >= 5) {
                setGameOver(true);
                setWinner(scoringTeam);
                setIsPlaying(false);
              }
            }
          });

          // Update player physics
          newState.players.forEach(player => {
            if (player.isJumping) {
              player.y -= player.jumpPower;
              player.jumpPower -= 1;
              
              if (player.y + player.height >= canvas.height) {
                player.y = canvas.height - player.height;
                player.isJumping = false;
                player.jumpPower = 15;
              }
            }
          });

          // Apply gravity (for basketball and volleyball)
          if (gameType !== 'football') {
            newState.ball.dy += 0.5;
          }

          // Ball friction
          newState.ball.dx *= 0.99;
          newState.ball.dy *= 0.99;

          // Update particles
          newState.particles = newState.particles
            .map(particle => ({
              ...particle,
              x: particle.x + particle.dx,
              y: particle.y + particle.dy,
              life: particle.life - 1
            }))
            .filter(particle => particle.life > 0);

          return newState;
        });

        // Render game
        render(ctx, canvas.width, canvas.height);

        lastTime = timestamp;
      }

      animationFrameId = requestAnimationFrame(gameLoop);
    };

    animationFrameId = requestAnimationFrame(gameLoop);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPlaying, gameType]);

  // Handle keyboard input
  useEffect(() => {
    if (!isPlaying) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      
      setGameState(prevState => {
        const newState = { ...prevState };

        switch (e.key) {
          case 'w':
            if (!newState.players[0].isJumping) {
              newState.players[0].isJumping = true;
            }
            break;
          case 's':
            newState.players[0].y = Math.min(
              newState.players[0].y + newState.players[0].speed,
              window.innerHeight - newState.players[0].height
            );
            break;
          case 'a':
            newState.players[0].x = Math.max(
              newState.players[0].x - newState.players[0].speed,
              0
            );
            break;
          case 'd':
            newState.players[0].x = Math.min(
              newState.players[0].x + newState.players[0].speed,
              window.innerWidth / 2 - newState.players[0].width
            );
            break;
          case 'ArrowUp':
            if (!newState.players[1].isJumping) {
              newState.players[1].isJumping = true;
            }
            break;
          case 'ArrowDown':
            newState.players[1].y = Math.min(
              newState.players[1].y + newState.players[1].speed,
              window.innerHeight - newState.players[1].height
            );
            break;
          case 'ArrowLeft':
            newState.players[1].x = Math.max(
              newState.players[1].x - newState.players[1].speed,
              window.innerWidth / 2
            );
            break;
          case 'ArrowRight':
            newState.players[1].x = Math.min(
              newState.players[1].x + newState.players[1].speed,
              window.innerWidth - newState.players[1].width
            );
            break;
          case ' ':
            // Shoot/kick the ball with power
            const player = newState.players[0];
            const dx = newState.ball.x - player.x;
            const dy = newState.ball.y - player.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
              const power = 0.3;
              newState.ball.dx = dx * power;
              newState.ball.dy = dy * power;
              addKickParticles(newState, player.x + player.width, player.y + player.height / 2);
            }
            break;
        }

        return newState;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying]);

  const render = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw field/court
    drawField(ctx, width, height, gameType);

    // Draw particles
    gameState.particles.forEach(particle => {
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = particle.color;
      ctx.fill();
      ctx.closePath();
    });

    // Draw ball with shadow and rotation
    ctx.save();
    ctx.translate(gameState.ball.x, gameState.ball.y);
    ctx.rotate(gameState.ball.rotation);
    
    // Ball shadow
    ctx.beginPath();
    ctx.arc(5, 5, gameState.ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.fill();
    ctx.closePath();

    // Ball
    ctx.beginPath();
    ctx.arc(0, 0, gameState.ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = gameType === 'basketball' ? '#ff6b00' : '#ffffff';
    ctx.fill();
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.closePath();

    // Ball details
    if (gameType === 'basketball') {
      drawBasketballLines(ctx, gameState.ball.radius);
    } else if (gameType === 'football') {
      drawFootballPattern(ctx, gameState.ball.radius);
    }

    ctx.restore();

    // Draw players with shadows
    gameState.players.forEach((player, index) => {
      // Player shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fillRect(player.x + 5, player.y + 5, player.width, player.height);

      // Player body
      ctx.fillStyle = index === 0 ? '#ff0000' : '#0000ff';
      ctx.fillRect(player.x, player.y, player.width, player.height);

      // Player details
      drawPlayerDetails(ctx, player, index);
    });

    // Draw score
    drawScore(ctx, width, gameState.players[0].score, gameState.players[1].score);
  };

  const startGame = () => {
    setGameState(createInitialState());
    setIsPlaying(true);
    setGameOver(false);
    setWinner(null);
    setShowControls(false);
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full bg-gray-900"
      style={{ cursor: 'none' }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full"
      />

      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-lg text-center max-w-md">
            {gameOver ? (
              <>
                <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                <h2 className="text-3xl font-bold mb-4">Oyun Bitti!</h2>
                <p className="text-xl mb-6">
                  Kazanan: {winner === 0 ? 'Kırmızı Takım' : 'Mavi Takım'}!
                </p>
              </>
            ) : (
              <>
                <Gamepad2 className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
                <h2 className="text-3xl font-bold mb-4">
                  {gameType === 'football' ? 'Futbol' : 
                   gameType === 'basketball' ? 'Basketbol' : 'Voleybol'}
                </h2>
              </>
            )}
            
            <button
              onClick={startGame}
              className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-lg font-semibold"
            >
              {gameOver ? 'Tekrar Oyna' : 'Oyunu Başlat'}
            </button>

            {showControls && (
              <div className="mt-6 text-left">
                <h3 className="font-bold mb-2 text-center">Kontroller:</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="font-semibold">Kırmızı Takım:</p>
                    <ul className="text-sm">
                      <li>W - Zıpla</li>
                      <li>A/D - Sol/Sağ</li>
                      <li>S - Aşağı</li>
                      <li>Boşluk - Şut/Atış</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold">Mavi Takım:</p>
                    <ul className="text-sm">
                      <li>↑ - Zıpla</li>
                      <li>←/→ - Sol/Sağ</li>
                      <li>↓ - Aşağı</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Helper functions for drawing
function drawField(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  gameType: 'football' | 'basketball' | 'volleyball'
) {
  // Field gradient
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  
  if (gameType === 'football') {
    gradient.addColorStop(0, '#2d8a2d');
    gradient.addColorStop(1, '#1a661a');
  } else {
    gradient.addColorStop(0, '#b97023');
    gradient.addColorStop(1, '#8b5419');
  }
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Field lines
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.lineWidth = 2;

  // Center line
  ctx.beginPath();
  ctx.moveTo(width / 2, 0);
  ctx.lineTo(width / 2, height);
  ctx.stroke();

  // Center circle
  ctx.beginPath();
  ctx.arc(width / 2, height / 2, 100, 0, Math.PI * 2);
  ctx.stroke();

  if (gameType === 'basketball') {
    // Three-point lines
    ctx.beginPath();
    ctx.arc(150, height / 2, 200, -Math.PI / 2, Math.PI / 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(width - 150, height / 2, 200, Math.PI / 2, -Math.PI / 2);
    ctx.stroke();
  } else if (gameType === 'volleyball') {
    // Net
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width / 2, height);
    ctx.stroke();

    // Net pattern
    ctx.lineWidth = 1;
    for (let y = 0; y < height; y += 20) {
      ctx.beginPath();
      ctx.moveTo(width / 2 - 10, y);
      ctx.lineTo(width / 2 + 10, y);
      ctx.stroke();
    }
  }
}

function drawBasketballLines(ctx: CanvasRenderingContext2D, radius: number) {
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 1;

  // Horizontal line
  ctx.beginPath();
  ctx.moveTo(-radius, 0);
  ctx.lineTo(radius, 0);
  ctx.stroke();

  // Vertical line
  ctx.beginPath();
  ctx.moveTo(0, -radius);
  ctx.lineTo(0, radius);
  ctx.stroke();
}

function drawFootballPattern(ctx: CanvasRenderingContext2D, radius: number) {
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 1;

  // Pentagon pattern
  for (let i = 0; i < 5; i++) {
    const angle = (i * 2 * Math.PI) / 5;
    const x = radius * 0.7 * Math.cos(angle);
    const y = radius * 0.7 * Math.sin(angle);
    
    ctx.beginPath();
    ctx.arc(x, y, radius * 0.3, 0, Math.PI * 2);
    ctx.stroke();
  }
}

function drawPlayerDetails(
  ctx: CanvasRenderingContext2D,
  player: GameState['players'][0],
  index: number
) {
  // Head
  ctx.beginPath();
  ctx.arc(
    player.x + player.width / 2,
    player.y - 10,
    15,
    0,
    Math.PI * 2
  );
  ctx.fillStyle = index === 0 ? '#ff0000' : '#0000ff';
  ctx.fill();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.stroke();
}

function drawScore(
  ctx: CanvasRenderingContext2D,
  width: number,
  score1: number,
  score2: number
) {
  ctx.font = 'bold 48px Arial';
  ctx.textAlign = 'center';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(`${score1} - ${score2}`, width / 2, 60);
}

function addBounceParticles(state: GameState, x: number, y: number) {
  for (let i = 0; i < 10; i++) {
    state.particles.push({
      x,
      y,
      dx: (Math.random() - 0.5) * 5,
      dy: -Math.random() * 5,
      life: 20,
      color: '#ffffff'
    });
  }
}

function addGoalParticles(state: GameState, x: number, y: number) {
  for (let i = 0; i < 30; i++) {
    state.particles.push({
      x,
      y,
      dx: (Math.random() - 0.5) * 10,
      dy: (Math.random() - 0.5) * 10,
      life: 50,
      color: '#ffdd00'
    });
  }
}

function addKickParticles(state: GameState, x: number, y: number) {
  for (let i = 0; i < 15; i++) {
    state.particles.push({
      x,
      y,
      dx: Math.random() * 5,
      dy: (Math.random() - 0.5) * 5,
      life: 30,
      color: '#ffffff'
    });
  }
}

export default SportsGame;