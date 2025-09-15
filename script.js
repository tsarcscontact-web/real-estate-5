let portfolioShown = false;
let activeVideo = null;
let videoTime = 0;

const fadeIn = (el) => {
    el.classList.remove("fade-out", "hidden");
    el.classList.add("fade-in");
};

const fadeOut = (el) => {
    if (!el.classList.contains("hidden")) {
        el.classList.remove("fade-in");
        el.classList.add("fade-out");
        setTimeout(() => {
            el.classList.add("hidden");
        }, 600);
    }
};

const showInfo = () => {
    const profileButton = document.querySelector("#profile-button");
    const emailButton = document.querySelector("#email-button");
    const locationButton = document.querySelector("#location-button");
    const webButton = document.querySelector("#web-button");
    const ytButton = document.querySelector("#youtube-button");
    const ttButton = document.querySelector("#tiktok-button");

    profileButton.setAttribute("visible", true);
    setTimeout(() => { emailButton.setAttribute("visible", true); }, 300);
    setTimeout(() => { locationButton.setAttribute("visible", true); }, 600);
    setTimeout(() => { webButton.setAttribute("visible", true); }, 900);
    setTimeout(() => { ytButton.setAttribute("visible", true); }, 1200);
    setTimeout(() => { ttButton.setAttribute("visible", true); }, 1500);

    webButton.addEventListener('click', () => window.location.href = "https://www.instagram.com/arthur.ambarchyan/");
    emailButton.addEventListener('click', () => window.location.href = "tel:818-230-3228");
    profileButton.addEventListener('click', () => window.location.href = "https://www.ateamla.com/");
    locationButton.addEventListener('click', () => window.location.href = "https://www.facebook.com/national.propertiesla");
    ytButton.addEventListener('click', () => window.location.href = "https://www.youtube.com/@arthur.ambarchyan");
    ttButton.addEventListener('click', () => window.location.href = "https://www.linkedin.com/company/arthur-ambarchyan-re/");
}

const showPortfolio = (done) => {
    const portfolio = document.querySelector("#portfolio-panel");
    const portfolio2 = document.querySelector("#portfolio-panel-2");
    const portfolioLeftButton = document.querySelector("#portfolio-left-button");
    const portfolioRightButton = document.querySelector("#portfolio-right-button");
    const paintandquestPreviewButton = document.querySelector("#paintandquest-preview-button");

    let y = 0, yx = 0, currentItem = 0;
    portfolio.setAttribute("visible", true);
    portfolio2.setAttribute("visible", true);

    const showPortfolioItem = (item) => {
        for (let i = 0; i <= 2; i++) {
            document.querySelector("#portfolio-item" + i).setAttribute("visible", i === item);
        }
    }

    const id = setInterval(() => {
        y += 0.008;
        yx += -0.008;

        if (y >= 0.6) {
            clearInterval(id);
            portfolioLeftButton.setAttribute("visible", true);
            portfolioRightButton.setAttribute("visible", true);

            portfolioLeftButton.addEventListener('click', () => {
                currentItem = (currentItem + 1) % 3;
                showPortfolioItem(currentItem);
            });
            portfolioRightButton.addEventListener('click', () => {
                currentItem = (currentItem - 1 + 3) % 3;
                showPortfolioItem(currentItem);
            });

            let videoIsPlaying = false;

            paintandquestPreviewButton.addEventListener("click", () => {
                const testVideo = document.createElement("video");
                const canplayWebm = testVideo.canPlayType('video/webm; codecs="vp8, vorbis"');
                const paintVideo = document.querySelector("#paintandquest-video-link");
                const mp4Video = document.querySelector("#paintandquest-video-mp4");
                const webmVideo = document.querySelector("#paintandquest-video-webm");

                // Select correct video format
                if (canplayWebm === "") {
                    paintVideo.setAttribute("src", "#paintandquest-video-mp4");
                    activeVideo = mp4Video;
                } else {
                    paintVideo.setAttribute("src", "#paintandquest-video-webm");
                    activeVideo = webmVideo;
                }

                if (!videoIsPlaying) {
                    // ▶️ Play
                    activeVideo.play();
                    videoIsPlaying = true;
                    paintandquestPreviewButton.setAttribute("visible", false);
                } else {
                    // ⏸ Pause
                    activeVideo.pause();
                    videoIsPlaying = false;
                    paintandquestPreviewButton.setAttribute("visible", true);
                }
            });

            setTimeout(() => { done(); }, 100);
        }

        portfolio.setAttribute("position", "0 " + y + " -0.01");
        portfolio2.setAttribute("position", "0 " + yx + " -0.01");
    }, 10);
}

AFRAME.registerComponent('mytarget', {
    init: function () {
        const overlay = document.getElementById("example-scanning-overlay");
        const hideDetails = document.getElementById("hide-details");
        const button = document.getElementById('save-btn');
        const scene = document.querySelector("a-scene");

        const paintVideo = document.querySelector("#paintandquest-video-link");
        const previewButton = document.querySelector("#paintandquest-preview-button");

        overlay.classList.remove("hidden");
        hideDetails.classList.add("hidden");
        hideDetails.classList.remove("fade-in", "fade-out");

        this.el.addEventListener('targetFound', () => {
            button.style.display = "flex";

            // Pause fallback background video
            const hiderVideo = document.querySelector(".hider-video");
            if (hiderVideo && !hiderVideo.paused) {
                hiderVideo.pause();
            }

            console.log("target found");

            // fade animations
            fadeOut(hideDetails);
            fadeOut(overlay);

            // Fade-in effect on scene
            scene.classList.remove("fade-out");
            scene.classList.add("fade-in");

            // Resume AR video if exists
            if (activeVideo) {
                activeVideo.currentTime = videoTime;
                activeVideo.play();

                // Hide thumbnail automatically
                if (previewButton) {
                    previewButton.setAttribute("visible", false);
                }
            }

            if (!portfolioShown) {
                portfolioShown = true;
                setTimeout(() => {
                    showPortfolio(() => {
                        setTimeout(() => {
                            showInfo();
                        }, 300);
                    });
                }, 300);
            } else {
                document.querySelector("#portfolio-panel").setAttribute("visible", true);
                document.querySelector("#portfolio-panel-2").setAttribute("visible", true);
                showInfo();
            }
        });

        this.el.addEventListener('targetLost', () => {
            console.log("target lost");

            // fade animations
            fadeIn(hideDetails);

            // Fade-out effect on scene
            scene.classList.remove("fade-in");
            scene.classList.add("fade-out");

            // Pause AR video
            if (activeVideo) {
                videoTime = activeVideo.currentTime;
                activeVideo.pause();
            }
        });

        // Clicking on video → pause + show preview
        if (paintVideo) {
            paintVideo.addEventListener("click", () => {
                if (activeVideo && !activeVideo.paused) {
                    activeVideo.pause();
                    previewButton.setAttribute("visible", true); // show thumbnail again
                }
            });
        }
    }
});

// Fake progress animation until scene is ready
let progress = 0;
const bar = document.getElementById("loader-bar");
const loader = document.getElementById("loader");

const fakeLoading = setInterval(() => {
    progress += 10;
    if (progress > 90) progress = 90;
    bar.style.width = progress + "%";
}, 300);

// When A-Frame + MindAR are ready
document.querySelector("a-scene").addEventListener("loaded", () => {
    clearInterval(fakeLoading);
    bar.style.width = "100%";
    setTimeout(() => {
        loader.style.display = "none";
    }, 500);
});





const saveBtn = document.getElementById('save-btn');

saveBtn.addEventListener('click', () => {
    const imagePath = "https://github.com/tsarcscontact-web/real-estate-5/blob/main/assets/NP-LOGO-Navy-H.png?raw=true"; // <-- put your file path or URL here

    const vCard = `
BEGIN:VCARD
VERSION:3.0
N:Ambarchyan;Arthur;;;
FN:Arthur Ambarchyan
TEL;TYPE=CELL:8182303228
TEL;TYPE=WHATSAPP:8182303228
EMAIL:arthur@example.com
PHOTO;VALUE=URI;TYPE=PNG:${imagePath}  // <-- add your image path here
END:VCARD
    `.trim();

    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

    if (isIOS) {
        const vcfData = 'data:text/vcard;charset=utf-8,' + encodeURIComponent(vCard);
        window.location.href = vcfData;
    } else {
        const blob = new Blob([vCard], { type: 'text/vcard' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'ArthurAmbarchyan.vcf';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
});





