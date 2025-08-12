import { useCallback } from "react";
import { loadFull } from "tsparticles";
import Particles from "react-particles";

const ModernParticlesBackground = () => {
  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  const particlesLoaded = useCallback(async (container) => {
    console.log("Modern particles loaded", container);
  }, []);

  return (
    <Particles
      id="modern-tsparticles"
      init={particlesInit}
      loaded={particlesLoaded}
      options={{
        background: {
          color: {
            value: "transparent",
          },
        },
        fpsLimit: 120,
        interactivity: {
          events: {
            onClick: {
              enable: true,
              mode: ["push", "bubble"],
            },
            onHover: {
              enable: true,
              mode: ["grab", "bubble"],
            },
            resize: true,
          },
          modes: {
            push: {
              quantity: 3,
            },
            grab: {
              distance: 150,
              links: {
                opacity: 0.8,
                color: "#00D4FF",
              },
            },
            bubble: {
              distance: 200,
              size: 8,
              duration: 2,
              opacity: 0.8,
              speed: 3,
            },
          },
        },
        particles: {
          color: {
            value: ["#00D4FF", "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FECA57", "#FF9FF3", "#54A0FF"],
          },
          links: {
            color: {
              value: ["#00D4FF", "#FF6B6B", "#4ECDC4"],
            },
            distance: 100,
            enable: true,
            opacity: 0.15,
            width: 1.5,
            triangles: {
              enable: true,
              color: "#00D4FF",
              opacity: 0.05,
            },
          },
          collisions: {
            enable: false,
          },
          move: {
            direction: "none",
            enable: true,
            outModes: {
              default: "out",
            },
            random: true,
            speed: {
              min: 0.5,
              max: 2,
            },
            straight: false,
            attract: {
              enable: true,
              rotateX: 600,
              rotateY: 1200,
            },
          },
          number: {
            density: {
              enable: true,
              area: 800,
            },
            value: 40,
          },
          opacity: {
            value: {
              min: 0.2,
              max: 0.8,
            },
            animation: {
              enable: true,
              speed: 1.5,
              minimumValue: 0.1,
              sync: false,
            },
          },
          shape: {
            type: ["circle", "triangle", "polygon"],
            options: {
              polygon: {
                sides: 6,
              },
            },
          },
          size: {
            value: {
              min: 2,
              max: 6,
            },
            animation: {
              enable: true,
              speed: 3,
              minimumValue: 1,
              sync: false,
            },
          },
          twinkle: {
            particles: {
              enable: true,
              frequency: 0.05,
              opacity: 1,
              color: {
                value: "#FFFFFF",
              },
            },
          },
          life: {
            duration: {
              sync: false,
              value: 30,
            },
            count: 0,
          },
        },
        detectRetina: true,
        smooth: true,
        motion: {
          disable: false,
          reduce: {
            factor: 4,
            value: true,
          },
        },
      }}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: -1,
        pointerEvents: "none",
      }}
    />
  );
};

export default ModernParticlesBackground;