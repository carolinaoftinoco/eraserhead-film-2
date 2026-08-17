const menu = document.getElementById("menu");
const video = document.querySelector(".capa-video");
const capa = document.querySelector(".capa");
const capaConteudo = document.querySelector(".capa-conteudo");
const capaBarra = document.querySelector(".capa-barra");
const capaSeta = document.querySelector(".capa-seta");
const capaImagem = document.querySelector(".capa-imagem");

if (menu) {
    window.addEventListener("scroll", function () {
        if (window.scrollY > 50) {
            menu.classList.add("menu-rolado");
        } else {
            menu.classList.remove("menu-rolado");
        }
    });
}

if (window.gsap && window.ScrollTrigger && video && capa && capaConteudo) {
    gsap.registerPlugin(ScrollTrigger);

    video.muted = true;
    video.playsInline = true;
    video.setAttribute("playsinline", "true");

    const tocarVideo = function () {
        const playPromise = video.play();

        if (playPromise && typeof playPromise.catch === "function") {
            playPromise.catch(function () {
            });
        }
    };

    if (video.readyState >= 2) {
        tocarVideo();
    } 
    else {
        video.addEventListener("loadeddata", tocarVideo, { 
            once: true 
        });
    }

    gsap.timeline ({
        scrollTrigger: {
            trigger: capa,
            start: "top top",
            end: "+=2500",
            scrub: 1,
            pin: true,
        }
    })

        .to(video, { opacity: 1, ease: "none" }, 0)
        .to(".capa-conteudo, .capa-barra, .capa-seta", {
            opacity: 0,
            y: -40,
            scale: 0.6,
            duration: 0.1,
            ease: "none",
        }, 0.02)

    gsap.to (video, {
        currentTime: function () {
            if (!video.duration || Number.isNaN(video.duration)) {
                return 0;
            }
            return video.duration;
        },

        ease: "none",
        scrollTrigger: {
            trigger: capa,
            start: "top top",
            end: "+=1200",
            scrub: 1.2,
            invalidateOnRefresh: true,
        }
    });

    if (capaImagem) {
        gsap.to(capaImagem, {
            attr: { src: "assets/video-capa.mp4" },
            scrollTrigger: {
                trigger: capa,
                start: "top top",
                end: "+=800",
                scrub: 0.5,
            }
        });
    }
}
