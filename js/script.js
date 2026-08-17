const menu = document.getElementById("menu");
const blocos = document.querySelectorAll(".aparecer");
const video = document.querySelector(".capa-video");
const capa = document.querySelector(".capa");
const capaConteudo = document.querySelector(".capa-conteudo");
const capaBarra = document.querySelector(".capa-barra");
const capaSeta = document.querySelector(".capa-seta");

if (menu) {
    window.addEventListener("scroll", function () {
        if (window.scrollY > 50) {
            menu.classList.add("menu-rolado");
        } else {
            menu.classList.remove("menu-rolado");
        }
    });
}

if (blocos.length) {
    const observador = new IntersectionObserver(function (entradas) {
        entradas.forEach(function (entrada) {
            if (entrada.isIntersecting) {
                entrada.target.classList.add("visivel");
            }
        });
    });

    blocos.forEach(function (bloco) {
        observador.observe(bloco);
    });
}

if (window.gsap && window.ScrollTrigger && video && capa && capaConteudo) {
    gsap.registerPlugin(ScrollTrigger);

    const DISTANCIA_PIN = 2500;
    const MARGEM_FINAL = 0.05;
    const ATIVAR_VIDEO_SCROLL = 80;

    video.muted = true;
    video.playsInline = true;
    video.setAttribute("playsinline", "true");
    video.setAttribute("autoplay", "true");
    video.removeAttribute("loop");
    video.loop = false;

    let duracao = 0;
    let videoLiberado = false;

    const guardarDuracao = function () {
        if (video.duration && Number.isFinite(video.duration)) {
            duracao = video.duration;
            ScrollTrigger.refresh();
        }
    };

    if (video.readyState >= 1) {
        guardarDuracao();
    } else {
        video.addEventListener("loadedmetadata", guardarDuracao, { once: true });
    }

    const iniciarVideo = function () {
        if (videoLiberado) {
            return;
        }

        if (window.scrollY > ATIVAR_VIDEO_SCROLL || video.getBoundingClientRect().top < window.innerHeight) {
            videoLiberado = true;

            const playPromise = video.play();

            if (playPromise && typeof playPromise.then === "function") {
                playPromise.catch(function () {
                    videoLiberado = false;
                });
            }
        }
    };

    const pausarVideo = function () {
        videoLiberado = false;

        if (!video.paused) {
            video.pause();
        }

        if (video.duration && Number.isFinite(video.duration)) {
            video.currentTime = 0;
        }
    };

    const estado = { tempo: 0 };

    const aplicarTempo = function () {
        if (!duracao || video.readyState < 1) {
            return;
        }

        if (Math.abs(video.currentTime - estado.tempo) > 0.01) {
            video.currentTime = estado.tempo;
        }
    };

    window.addEventListener("scroll", function () {
        if (window.scrollY > ATIVAR_VIDEO_SCROLL) {
            iniciarVideo();
        } else if (window.scrollY <= ATIVAR_VIDEO_SCROLL && !video.paused) {
            pausarVideo();
        }
    }, { passive: true });

    const timelineVideo = gsap.timeline({
        scrollTrigger: {
            trigger: capa,
            start: "top top",
            end: "+=" + DISTANCIA_PIN,
            scrub: 1,
            pin: true,
            invalidateOnRefresh: true,
            onUpdate: function () {
                if (window.scrollY > ATIVAR_VIDEO_SCROLL && video.paused && !videoLiberado) {
                    iniciarVideo();
                }
            },
            onLeave: pausarVideo,
            onLeaveBack: pausarVideo,
        }
    });

    timelineVideo
        .to(video, {
            opacity: 1,
            scale: 1.05,
            filter: "brightness(0.8) saturate(0.9) contrast(1.15)",
            duration: 0.15,
            ease: "none"
        }, 0)
        .to(".capa-conteudo, .capa-barra, .capa-seta", {
            opacity: 0,
            y: -40,
            scale: 0.6,
            duration: 0.1,
            ease: "none",
        }, 0.02)
        .fromTo(estado, { tempo: 0 }, {
            tempo: function () {
                return Math.max(duracao - MARGEM_FINAL, 0);
            },
            duration: 1,
            ease: "none",
            onUpdate: aplicarTempo,
        }, 0);

}
