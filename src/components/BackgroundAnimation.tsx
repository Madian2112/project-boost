import { useCallback } from "react";
import Particles from "react-tsparticles";
import type { Container, Engine } from "tsparticles-engine";
import { loadSlim } from "tsparticles-slim";

export const BackgroundAnimation = () => {
    const particlesInit = useCallback(async (engine: Engine) => {
        await loadSlim(engine);
    }, []);

    const particlesLoaded = useCallback(async (container: Container | undefined) => {
        await console.log(container);
    }, []);

    return (
        <Particles
            id="tsparticles"
            init={particlesInit}
            loaded={particlesLoaded}
            options={{
                fullScreen: {
                    enable: true,
                    zIndex: -1,
                },
                background: {
                    color: {
                        value: "#000000",
                    },
                },
                particles: {
                    number: {
                        value: 40,
                        density: {
                            enable: true,
                            value_area: 800,
                        },
                    },
                    color: {
                        value: "#8e2de2",
                    },
                    shape: {
                        type: "circle",
                    },
                    opacity: {
                        value: 0.15,
                        random: true,
                        anim: {
                            enable: true,
                            speed: 0.2,
                            opacity_min: 0.05,
                            sync: false,
                        },
                    },
                    size: {
                        value: 2,
                        random: true,
                    },
                    links: {
                        enable: true,
                        distance: 150,
                        color: "#8e2de2",
                        opacity: 0.1,
                        width: 1,
                    },
                    move: {
                        enable: true,
                        speed: 0.5,
                        direction: "none",
                        out_mode: "out",
                    },
                },
                interactivity: {
                    events: {
                        onhover: {
                            enable: false,
                        },
                        onclick: {
                            enable: false,
                        },
                        resize: true,
                    },
                },
                detectRetina: true,
            }}
        />
    );
};
