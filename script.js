const audioPlayer = document.getElementById("audio-player");

const playButton = document.getElementById("play-button");
const previousButton = document.getElementById("previous-button");
const nextButton = document.getElementById("next-button");

const progressBar = document.getElementById("progress");
const currentTimeDisplay = document.getElementById("current-time");
const durationDisplay = document.getElementById("duration");

const volumeSlider = document.getElementById("volume");

const trackTitle = document.getElementById("track-title");
const trackArtist = document.getElementById("track-artist");

const playlistContainer = document.getElementById("playlist-container");
const trackCount = document.getElementById("track-count");

const tracks = [
    {
        title: "SYSTEM OVERRIDE",
        artist: "Astra",
        file: "music/SYSTEM OVERRIDE.mp3"
    },
    {
        title: "You'll Always Have a Place",
        artist: "Astra",
        file: "music/You'll Always Have a Place.mp3"
    },
    {
        title: "From a Distance",
        artist: "Astra",
        file: "music/From a Distance.mp3"
    },
    {
        title: "If we meet again",
        artist: "Astra",
        file: "music/If we meet again.mp3"
    },
    {
        title: "Someone New",
        artist: "Astra",
        file: "music/Someone New.mp3"
    },
    {
        title: "Sunrise After Midnight",
        artist: "Astra",
        file: "music/Sunrise After Midnight.mp3"
    },
    {
        title: "Docked Away",
        artist: "Astra",
        file: "music/Docked Away.mp3"
    },
    {
        title: "Stay Until Morning",
        artist: "Astra",
        file: "music/Stay Until Morning.mp3"
    },
    {
        title: "The Weight I Couldn't Share",
        artist: "Astra",
        file: "music/The Weight I Couldn't Share.mp3"
    },
    {
        title: "Your Voice Found Me",
        artist: "Astra",
        file: "music/Your Voice Found Me.mp3"
    },
    {
        title: "When the Sky Feels Lighter",
        artist: "Astra",
        file: "music/When the Sky Feels Lighter.mp3"
    },
    {
        title: "Broken Chains",
        artist: "Astra",
        file: "music/Broken Chains.mp3"
    },
    {
        title: "The Door I Never Closed",
        artist: "Astra",
        file: "music/The Door I Never Closed.mp3"
    },
    {
        title: "Learning My Own Name",
        artist: "Astra",
        file: "music/Learning My Own Name.mp3"
    },
    {
        title: "The House I Built",
        artist: "Astra",
        file: "music/The House I Built.mp3"
    },
    {
        title: "Free at Last",
        artist: "Astra",
        file: "music/Free at Last.mp3"
    },
    {
        title: "Love Me Before I'm Gone",
        artist: "Astra",
        file: "music/Love Me Before I'm Gone.mp3"
    },
    {
        title: "Better Chapters",
        artist: "Astra",
        file: "music/Better Chapters.mp3"
    },
    {
        title: "Weekend Dreams",
        artist: "Astra",
        file: "music/Weekend Dreams.mp3"
    },
    {
        title: "Nebula",
        artist: "Astra",
        file: "music/Nebula.mp3"
    },
    {
        title: "Strangers Again",
        artist: "Astra",
        file: "music/Strangers Again.mp3"
    },
    {
        title: "Miss Forgettable",
        artist: "Astra",
        file: "music/Miss Forgettable.mp3"
    },
    {
        title: "Sunset Sunshine / Sunset Madness",
        artist: "Astra",
        file: "music/Sunset Sunshine _ Sunset Madness.mp3"
    },
    {
        title: "Healing Heart",
        artist: "Astra",
        file: "music/Healing Heart 💔.mp3"
    },
    {
        title: "The 2AM Decision",
        artist: "Astra",
        file: "music/The 2AM Decision.mp3"
    },
    {
        title: "When The Lights Go Out",
        artist: "Astra",
        file: "music/When The Lights Go Out.mp3"
    },
    {
        title: "4:47AM",
        artist: "Astra",
        file: "music/4_47 AM.mp3"
    },
    {
        title: "NEON HEARTBREAK",
        artist: "Astra",
        file: "music/NEON HEARTBREAK.mp3"
    }
];

let currentTrackIndex = 0;
let isPlaying = false;

let shuffleEnabled = false;
let repeatMode = "off";

let shuffleQueue = [];
let shufflePosition = -1;

let favourites = JSON.parse(
    localStorage.getItem("astrawave-favourites") || "[]"
);

let recentlyPlayed = JSON.parse(
    localStorage.getItem("astrawave-recently-played") || "[]"
);

let savedVolume = Number(
    localStorage.getItem("astrawave-volume")
);

if (!Number.isFinite(savedVolume)) {
    savedVolume = 1;
}

let shuffleButton = null;
let repeatButton = null;
let muteButton = null;
let favouriteButton = null;
let searchInput = null;

let visualizerCanvas = null;
let audioContext = null;
let analyser = null;
let sourceNode = null;
let visualizerAnimation = null;

let albumArt = null;
let albumArtSymbol = null;
let albumArtLines = null;
let albumArtPulse = 0;

let currentArtwork = null;


/* =========================
   PROCEDURAL ARTWORK
========================= */

const artworkPalettes = [
    {
        primary: "#8f7cff",
        secondary: "#ff4fd8",
        accent: "#48dfff",
        dark: "#080718"
    },
    {
        primary: "#48dfff",
        secondary: "#8f7cff",
        accent: "#ff4fd8",
        dark: "#061017"
    },
    {
        primary: "#ff4fd8",
        secondary: "#ff7acb",
        accent: "#8f7cff",
        dark: "#130712"
    },
    {
        primary: "#7c5cff",
        secondary: "#48dfff",
        accent: "#a6ffef",
        dark: "#070b18"
    },
    {
        primary: "#ff6b9d",
        secondary: "#8f7cff",
        accent: "#48dfff",
        dark: "#120712"
    },
    {
        primary: "#48dfff",
        secondary: "#00ffa3",
        accent: "#8f7cff",
        dark: "#06130f"
    },
    {
        primary: "#b967ff",
        secondary: "#ff4fd8",
        accent: "#48dfff",
        dark: "#0d0616"
    }
];

function initialiseAlbumArtwork() {
    albumArt =
        document.querySelector(".album-art") ||
        document.querySelector(".album-artwork") ||
        document.querySelector(".artwork");

    if (!albumArt) {
        console.warn("AstraWave: album artwork container not found.");
        return;
    }

    albumArt.classList.add("astrawave-artwork");

    albumArtSymbol =
        albumArt.querySelector(".album-art-symbol") ||
        albumArt.querySelector(".art-symbol") ||
        albumArt.querySelector(".artwork-symbol");

    if (!albumArtSymbol) {
        albumArtSymbol =
            document.createElement("div");

        albumArtSymbol.className =
            "astrawave-art-symbol";

        albumArtSymbol.textContent = "◈";

        albumArt.appendChild(
            albumArtSymbol
        );
    }

    albumArtLines =
        albumArt.querySelector(".album-art-lines");

    if (!albumArtLines) {
        albumArtLines =
            document.createElement("div");

        albumArtLines.className =
            "astrawave-art-lines";

        for (let i = 0; i < 5; i++) {
            const line =
                document.createElement("span");

            line.style.setProperty(
                "--line-index",
                i
            );

            albumArtLines.appendChild(line);
        }

        albumArt.appendChild(
            albumArtLines
        );
    }

    injectArtworkStyles();

    updateAlbumArtwork(
        tracks[currentTrackIndex]
    );
}

function getArtworkPalette(index) {
    return artworkPalettes[
        index % artworkPalettes.length
    ];
}

function getArtworkSeed(index) {
    const track =
        tracks[index];

    if (!track) {
        return 1;
    }

    let hash = 0;

    for (let i = 0; i < track.title.length; i++) {
        hash =
            ((hash << 5) - hash) +
            track.title.charCodeAt(i);

        hash |= 0;
    }

    return Math.abs(hash);
}

function updateAlbumArtwork(track) {
    if (!albumArt || !track) {
        return;
    }

    const index =
        tracks.indexOf(track);

    const palette =
        getArtworkPalette(
            Math.max(index, 0)
        );

    const seed =
        getArtworkSeed(
            Math.max(index, 0)
        );

    const angle =
        seed % 360;

    const secondaryAngle =
        (seed * 7) % 360;

    const glowX =
        25 + (seed % 50);

    const glowY =
        20 + ((seed * 3) % 60);

    const pattern =
        seed % 5;

    const artworkStyles = [
        `
        radial-gradient(
            circle at ${glowX}% ${glowY}%,
            ${palette.accent} 0%,
            transparent 28%
        ),
        radial-gradient(
            circle at 75% 80%,
            ${palette.secondary} 0%,
            transparent 32%
        ),
        linear-gradient(
            ${angle}deg,
            ${palette.dark} 0%,
            ${palette.primary} 48%,
            ${palette.secondary} 100%
        )
        `,
        `
        radial-gradient(
            circle at 30% 30%,
            ${palette.primary} 0%,
            transparent 30%
        ),
        linear-gradient(
            ${secondaryAngle}deg,
            ${palette.dark} 0%,
            ${palette.secondary} 50%,
            ${palette.accent} 100%
        )
        `,
        `
        repeating-linear-gradient(
            ${angle}deg,
            ${palette.dark} 0px,
            ${palette.dark} 22px,
            ${palette.primary} 23px,
            ${palette.dark} 25px
        ),
        radial-gradient(
            circle at 70% 40%,
            ${palette.accent},
            transparent 38%
        )
        `,
        `
        conic-gradient(
            from ${angle}deg at 50% 50%,
            ${palette.primary},
            ${palette.secondary},
            ${palette.accent},
            ${palette.primary}
        )
        `,
        `
        radial-gradient(
            circle at 50% 50%,
            ${palette.accent} 0%,
            ${palette.primary} 18%,
            ${palette.secondary} 38%,
            ${palette.dark} 72%
        )
        `
    ];

    currentArtwork = {
        palette,
        seed,
        pattern
    };

    albumArt.style.setProperty(
        "--art-primary",
        palette.primary
    );

    albumArt.style.setProperty(
        "--art-secondary",
        palette.secondary
    );

    albumArt.style.setProperty(
        "--art-accent",
        palette.accent
    );

    albumArt.style.setProperty(
        "--art-dark",
        palette.dark
    );

    albumArt.style.setProperty(
        "--art-angle",
        `${angle}deg`
    );

    albumArt.style.setProperty(
        "--art-glow-x",
        `${glowX}%`
    );

    albumArt.style.setProperty(
        "--art-glow-y",
        `${glowY}%`
    );

    albumArt.style.background =
        artworkStyles[pattern];

    albumArt.dataset.track =
        track.title;

    albumArtSymbol.textContent =
        getArtworkSymbol(
            track.title,
            seed
        );

    albumArt.classList.remove(
        "art-pattern-0",
        "art-pattern-1",
        "art-pattern-2",
        "art-pattern-3",
        "art-pattern-4"
    );

    albumArt.classList.add(
        `art-pattern-${pattern}`
    );

    albumArt.classList.toggle(
        "is-playing",
        isPlaying
    );
}

function getArtworkSymbol(title, seed) {
    const symbols = [
        "◈",
        "✦",
        "◇",
        "⬢",
        "✧",
        "◎",
        "△",
        "╳",
        "⌁",
        "✺"
    ];

    return symbols[
        seed % symbols.length
    ];
}

function injectArtworkStyles() {
    if (
        document.getElementById(
            "astrawave-artwork-styles"
        )
    ) {
        return;
    }

    const style =
        document.createElement("style");

    style.id =
        "astrawave-artwork-styles";

    style.textContent = `
        .astrawave-artwork {
            position: relative;
            isolation: isolate;
            overflow: hidden;
            background-size: cover !important;
            background-position: center !important;
            transition:
                background 0.8s ease,
                box-shadow 0.8s ease,
                transform 0.4s ease;
        }

        .astrawave-artwork::before {
            content: "";
            position: absolute;
            inset: -25%;
            z-index: -2;
            border-radius: 50%;
            background:
                radial-gradient(
                    circle at var(--art-glow-x) var(--art-glow-y),
                    var(--art-accent),
                    transparent 28%
                );
            filter: blur(28px);
            opacity: 0.55;
            animation: astrwave-art-glow 7s ease-in-out infinite alternate;
        }

        .astrawave-artwork::after {
            content: "";
            position: absolute;
            inset: 0;
            z-index: -1;
            background:
                linear-gradient(
                    135deg,
                    rgba(255,255,255,0.12),
                    transparent 35%,
                    rgba(0,0,0,0.38)
                );
            pointer-events: none;
        }

        .astrawave-artwork.is-playing {
            box-shadow:
                0 0 30px color-mix(
                    in srgb,
                    var(--art-primary) 50%,
                    transparent
                ),
                0 0 75px color-mix(
                    in srgb,
                    var(--art-secondary) 30%,
                    transparent
                );
        }

        .astrawave-art-symbol {
            position: absolute;
            inset: 50% auto auto 50%;
            width: 92px;
            height: 92px;
            transform: translate(-50%, -50%);
            display: grid;
            place-items: center;
            border-radius: 50%;
            color: white;
            font-size: 42px;
            font-weight: 800;
            background:
                radial-gradient(
                    circle at 35% 30%,
                    rgba(255,255,255,0.28),
                    rgba(255,255,255,0.04) 45%,
                    rgba(0,0,0,0.38)
                );
            border: 1px solid rgba(255,255,255,0.3);
            box-shadow:
                0 0 0 8px rgba(255,255,255,0.035),
                0 0 35px var(--art-primary),
                0 0 70px color-mix(
                    in srgb,
                    var(--art-secondary) 55%,
                    transparent
                ),
                inset 0 0 25px rgba(255,255,255,0.12);
            backdrop-filter: blur(4px);
            text-shadow:
                0 0 12px white,
                0 0 28px var(--art-accent);
            z-index: 4;
            animation: astrwave-symbol-float 4s ease-in-out infinite;
        }

        .astrawave-artwork.is-playing
        .astrawave-art-symbol {
            animation:
                astrwave-symbol-float 4s ease-in-out infinite,
                astrwave-symbol-glow 1.8s ease-in-out infinite alternate;
        }

        .astrawave-art-lines {
            position: absolute;
            inset: 0;
            z-index: 3;
            pointer-events: none;
            overflow: hidden;
            opacity: 0.55;
        }

        .astrawave-art-lines span {
            position: absolute;
            left: -20%;
            width: 140%;
            height: 1px;
            top: calc(
                18% + (var(--line-index) * 16%)
            );
            background:
                linear-gradient(
                    90deg,
                    transparent,
                    var(--art-accent),
                    white,
                    var(--art-secondary),
                    transparent
                );
            transform:
                rotate(
                    calc(
                        var(--art-angle) + 25deg
                    )
                );
            box-shadow:
                0 0 10px var(--art-accent);
            opacity:
                calc(
                    0.2 + (var(--line-index) * 0.08)
                );
        }

        .astrawave-artwork.art-pattern-1
        .astrawave-art-lines span {
            transform:
                rotate(
                    calc(
                        var(--art-angle) - 25deg
                    )
                );
        }

        .astrawave-artwork.art-pattern-2
        .astrawave-art-lines span {
            transform:
                rotate(90deg)
                translateX(
                    calc(
                        var(--line-index) * 18px
                    )
                );
        }

        .astrawave-artwork.art-pattern-3
        .astrawave-art-lines {
            opacity: 0.25;
        }

        .astrawave-artwork.art-pattern-4
        .astrawave-art-lines span {
            height: 2px;
            filter: blur(0.4px);
        }

        @keyframes astrwave-art-glow {
            0% {
                transform:
                    scale(0.92)
                    rotate(0deg);
            }

            100% {
                transform:
                    scale(1.12)
                    rotate(18deg);
            }
        }

        @keyframes astrwave-symbol-float {
            0%,
            100% {
                margin-top: 0;
            }

            50% {
                margin-top: -7px;
            }
        }

        @keyframes astrwave-symbol-glow {
            from {
                filter:
                    brightness(1)
                    drop-shadow(
                        0 0 10px
                        var(--art-accent)
                    );
            }

            to {
                filter:
                    brightness(1.35)
                    drop-shadow(
                        0 0 24px
                        var(--art-secondary)
                    );
            }
        }
    `;

    document.head.appendChild(style);
}


/* =========================
   INITIALISE
========================= */

function initialisePlayer() {
    audioPlayer.volume = savedVolume;

    if (volumeSlider) {
        volumeSlider.value = savedVolume;
    }

    createAdvancedControls();
    createPlaylistSearch();
    createVisualizer();
    initialiseAlbumArtwork();

    renderPlaylist();

    loadTrack(0);

    updateTrackCount();
    updateButtonStates();
}


/* =========================
   TRACK URL
========================= */

function getTrackUrl(track) {
    if (!track || !track.file) {
        return "";
    }

    const parts = track.file.split("/");

    const encodedParts = parts.map(
        (part, index) => {
            if (index === 0) {
                return part;
            }

            return encodeURIComponent(part);
        }
    );

    return new URL(
        encodedParts.join("/"),
        document.baseURI
    ).href;
}


/* =========================
   LOAD TRACK
========================= */

function loadTrack(index, autoplay = false) {
    if (!tracks.length) {
        return;
    }

    if (index < 0) {
        index = tracks.length - 1;
    }

    if (index >= tracks.length) {
        index = 0;
    }

    currentTrackIndex = index;

    const track =
        tracks[currentTrackIndex];

    const trackUrl =
        getTrackUrl(track);

    console.log(
        "AstraWave loading:",
        track.title
    );

    console.log(
        "Original file:",
        track.file
    );

    console.log(
        "Resolved URL:",
        trackUrl
    );

    audioPlayer.pause();
    audioPlayer.removeAttribute("src");
    audioPlayer.src = trackUrl;
    audioPlayer.load();

    isPlaying = false;

    trackTitle.textContent =
        track.title;

    trackArtist.textContent =
        track.artist;

    currentTimeDisplay.textContent =
        "0:00";

    durationDisplay.textContent =
        "0:00";

    progressBar.value = 0;
    progressBar.max = 0;

    updateAlbumArtwork(track);

    updatePlaylistActiveState();
    updateFavouriteButton();
    updateButtonStates();

    if (autoplay) {
        playTrack();
    }
}


/* =========================
   PLAY / PAUSE
========================= */

function togglePlayPause() {
    if (isPlaying) {
        pauseTrack();
    } else {
        playTrack();
    }
}

function playTrack() {
    setupVisualizerAudio();

    const playPromise =
        audioPlayer.play();

    if (playPromise !== undefined) {
        playPromise
            .then(() => {
                isPlaying = true;

                if (albumArt) {
                    albumArt.classList.add(
                        "is-playing"
                    );
                }

                updatePlayButton();
                updatePlaylistActiveState();

                addRecentlyPlayed(
                    currentTrackIndex
                );
            })
            .catch(error => {
                isPlaying = false;

                if (albumArt) {
                    albumArt.classList.remove(
                        "is-playing"
                    );
                }

                updatePlayButton();
                updatePlaylistActiveState();

                console.error(
                    "Unable to play track:",
                    tracks[
                        currentTrackIndex
                    ]?.title,
                    error
                );
            });
    }
}

function pauseTrack() {
    audioPlayer.pause();

    isPlaying = false;

    if (albumArt) {
        albumArt.classList.remove(
            "is-playing"
        );
    }

    updatePlayButton();
    updatePlaylistActiveState();
}


/* =========================
   NEXT / PREVIOUS
========================= */

function nextTrack() {
    if (!tracks.length) {
        return;
    }

    if (repeatMode === "one") {
        audioPlayer.currentTime = 0;
        playTrack();
        return;
    }

    if (shuffleEnabled) {
        const nextIndex =
            getNextShuffleTrack();

        if (nextIndex !== null) {
            loadTrack(
                nextIndex,
                true
            );
        }

        return;
    }

    let nextIndex =
        currentTrackIndex + 1;

    if (nextIndex >= tracks.length) {
        nextIndex = 0;
    }

    loadTrack(
        nextIndex,
        true
    );
}

function previousTrack() {
    if (!tracks.length) {
        return;
    }

    if (audioPlayer.currentTime > 5) {
        audioPlayer.currentTime = 0;
        return;
    }

    if (shuffleEnabled) {
        const previousIndex =
            getPreviousShuffleTrack();

        if (previousIndex !== null) {
            loadTrack(
                previousIndex,
                true
            );
        }

        return;
    }

    let previousIndex =
        currentTrackIndex - 1;

    if (previousIndex < 0) {
        previousIndex =
            tracks.length - 1;
    }

    loadTrack(
        previousIndex,
        true
    );
}


/* =========================
   SHUFFLE
========================= */

function toggleShuffle() {
    shuffleEnabled =
        !shuffleEnabled;

    if (shuffleEnabled) {
        buildShuffleQueue();
    } else {
        shuffleQueue = [];
        shufflePosition = -1;
    }

    updateButtonStates();
}

function buildShuffleQueue() {
    shuffleQueue =
        tracks.map(
            (_, index) => index
        );

    shuffleQueue =
        shuffleQueue.filter(
            index =>
                index !==
                currentTrackIndex
        );

    for (
        let i =
            shuffleQueue.length - 1;
        i > 0;
        i--
    ) {
        const randomIndex =
            Math.floor(
                Math.random() *
                (i + 1)
            );

        [
            shuffleQueue[i],
            shuffleQueue[randomIndex]
        ] = [
            shuffleQueue[randomIndex],
            shuffleQueue[i]
        ];
    }

    shuffleQueue.unshift(
        currentTrackIndex
    );

    shufflePosition = 0;
}

function getNextShuffleTrack() {
    if (!shuffleQueue.length) {
        buildShuffleQueue();
    }

    shufflePosition++;

    if (
        shufflePosition >=
        shuffleQueue.length
    ) {
        if (repeatMode === "all") {
            buildShuffleQueue();
        } else {
            shufflePosition = 0;
        }
    }

    return shuffleQueue[
        shufflePosition
    ];
}

function getPreviousShuffleTrack() {
    if (!shuffleQueue.length) {
        buildShuffleQueue();
    }

    shufflePosition--;

    if (shufflePosition < 0) {
        shufflePosition =
            shuffleQueue.length - 1;
    }

    return shuffleQueue[
        shufflePosition
    ];
}


/* =========================
   REPEAT
========================= */

function toggleRepeat() {
    if (repeatMode === "off") {
        repeatMode = "all";
    } else if (
        repeatMode === "all"
    ) {
        repeatMode = "one";
    } else {
        repeatMode = "off";
    }

    updateButtonStates();
}


/* =========================
   AUDIO EVENTS
========================= */

audioPlayer.addEventListener(
    "loadedmetadata",
    () => {
        if (
            !Number.isFinite(
                audioPlayer.duration
            )
        ) {
            return;
        }

        durationDisplay.textContent =
            formatTime(
                audioPlayer.duration
            );

        progressBar.max =
            audioPlayer.duration;
    }
);

audioPlayer.addEventListener(
    "canplay",
    () => {
        console.log(
            "AstraWave ready:",
            tracks[
                currentTrackIndex
            ]?.title
        );
    }
);

audioPlayer.addEventListener(
    "timeupdate",
    () => {
        if (
            !Number.isFinite(
                audioPlayer.duration
            )
        ) {
            return;
        }

        progressBar.value =
            audioPlayer.currentTime;

        currentTimeDisplay.textContent =
            formatTime(
                audioPlayer.currentTime
            );

        durationDisplay.textContent =
            formatTime(
                audioPlayer.duration
            );
    }
);

audioPlayer.addEventListener(
    "play",
    () => {
        isPlaying = true;

        if (albumArt) {
            albumArt.classList.add(
                "is-playing"
            );
        }

        updatePlayButton();
        updatePlaylistActiveState();
    }
);

audioPlayer.addEventListener(
    "pause",
    () => {
        isPlaying = false;

        if (albumArt) {
            albumArt.classList.remove(
                "is-playing"
            );
        }

        updatePlayButton();
        updatePlaylistActiveState();
    }
);

audioPlayer.addEventListener(
    "ended",
    () => {
        if (repeatMode === "one") {
            audioPlayer.currentTime = 0;
            playTrack();
            return;
        }

        if (
            currentTrackIndex ===
                tracks.length - 1 &&
            repeatMode === "off"
        ) {
            isPlaying = false;

            if (albumArt) {
                albumArt.classList.remove(
                    "is-playing"
                );
            }

            updatePlayButton();
            updatePlaylistActiveState();

            return;
        }

        nextTrack();
    }
);

audioPlayer.addEventListener(
    "error",
    () => {
        const track =
            tracks[
                currentTrackIndex
            ];

        const error =
            audioPlayer.error;

        console.error(
            "================================"
        );

        console.error(
            "ASTRAWAVE AUDIO ERROR"
        );

        console.error(
            "Track:",
            track?.title
        );

        console.error(
            "File:",
            track?.file
        );

        console.error(
            "Resolved URL:",
            getTrackUrl(track)
        );

        if (error) {
            console.error(
                "Media error code:",
                error.code
            );

            console.error(
                "Media error message:",
                error.message
            );
        }

        console.error(
            "================================"
        );
    }
);


/* =========================
   PROGRESS BAR
========================= */

if (progressBar) {
    progressBar.addEventListener(
        "input",
        () => {
            if (
                !Number.isFinite(
                    audioPlayer.duration
                )
            ) {
                return;
            }

            audioPlayer.currentTime =
                Number(
                    progressBar.value
                );
        }
    );
}


/* =========================
   VOLUME
========================= */

if (volumeSlider) {
    volumeSlider.addEventListener(
        "input",
        () => {
            const volume =
                Number(
                    volumeSlider.value
                );

            audioPlayer.volume =
                volume;

            localStorage.setItem(
                "astrawave-volume",
                volume
            );

            updateMuteButton(
                volume === 0
            );
        }
    );
}


/* =========================
   MUTE
========================= */

function toggleMute() {
    if (audioPlayer.volume > 0) {
        audioPlayer.dataset.previousVolume =
            audioPlayer.volume;

        audioPlayer.volume = 0;

        if (volumeSlider) {
            volumeSlider.value = 0;
        }

        updateMuteButton(true);
    } else {
        let previousVolume =
            Number(
                audioPlayer.dataset
                    .previousVolume
            );

        if (
            !Number.isFinite(
                previousVolume
            ) ||
            previousVolume <= 0
        ) {
            previousVolume = 1;
        }

        audioPlayer.volume =
            previousVolume;

        if (volumeSlider) {
            volumeSlider.value =
                previousVolume;
        }

        localStorage.setItem(
            "astrawave-volume",
            previousVolume
        );

        updateMuteButton(false);
    }
}


/* =========================
   FAVOURITES
========================= */

function toggleFavourite() {
    const track =
        tracks[currentTrackIndex];

    if (!track) {
        return;
    }

    const existingIndex =
        favourites.indexOf(
            track.file
        );

    if (existingIndex === -1) {
        favourites.push(
            track.file
        );
    } else {
        favourites.splice(
            existingIndex,
            1
        );
    }

    localStorage.setItem(
        "astrawave-favourites",
        JSON.stringify(
            favourites
        )
    );

    updateFavouriteButton();
    renderPlaylist();
}

function isFavourite(track) {
    if (!track) {
        return false;
    }

    return favourites.includes(
        track.file
    );
}


/* =========================
   RECENTLY PLAYED
========================= */

function addRecentlyPlayed(index) {
    const track =
        tracks[index];

    if (!track) {
        return;
    }

    recentlyPlayed =
        recentlyPlayed.filter(
            file =>
                file !== track.file
        );

    recentlyPlayed.unshift(
        track.file
    );

    recentlyPlayed =
        recentlyPlayed.slice(
            0,
            10
        );

    localStorage.setItem(
        "astrawave-recently-played",
        JSON.stringify(
            recentlyPlayed
        )
    );
}


/* =========================
   PLAYLIST
========================= */

function renderPlaylist(filter = "") {
    if (!playlistContainer) {
        return;
    }

    playlistContainer.innerHTML = "";

    const searchTerm =
        filter.trim().toLowerCase();

    const filteredTracks =
        tracks.filter(track => {
            return (
                track.title
                    .toLowerCase()
                    .includes(searchTerm) ||
                track.artist
                    .toLowerCase()
                    .includes(searchTerm)
            );
        });

    if (!filteredTracks.length) {
        playlistContainer.innerHTML =
            '<div class="playlist-empty">' +
            "<span>◈</span>" +
            "<p>No tracks found.</p>" +
            "</div>";

        return;
    }

    filteredTracks.forEach(
        track => {
            const originalIndex =
                tracks.indexOf(
                    track
                );

            const item =
                document.createElement(
                    "button"
                );

            item.type = "button";

            item.className =
                "playlist-item";

            if (
                originalIndex ===
                currentTrackIndex
            ) {
                item.classList.add(
                    "active"
                );

                if (isPlaying) {
                    item.classList.add(
                        "playing"
                    );
                }
            }

            const favouriteIcon =
                isFavourite(track)
                    ? "♥"
                    : "♡";

            item.innerHTML =
                '<span class="playlist-number">' +
                String(
                    originalIndex + 1
                ).padStart(2, "0") +
                "</span>" +
                '<span class="playlist-track-info">' +
                "<strong>" +
                escapeHTML(
                    track.title
                ) +
                "</strong>" +
                "<small>" +
                escapeHTML(
                    track.artist
                ) +
                "</small>" +
                "</span>" +
                '<span class="playlist-favourite">' +
                favouriteIcon +
                "</span>";

            item.addEventListener(
                "click",
                () => {
                    loadTrack(
                        originalIndex,
                        true
                    );
                }
            );

            playlistContainer.appendChild(
                item
            );
        }
    );

    updateTrackCount();
}

function updatePlaylistActiveState() {
    if (!playlistContainer) {
        return;
    }

    const items =
        playlistContainer.querySelectorAll(
            ".playlist-item"
        );

    items.forEach(item => {
        const strong =
            item.querySelector(
                "strong"
            );

        if (!strong) {
            return;
        }

        const trackIndex =
            tracks.findIndex(
                track =>
                    track.title ===
                    strong.textContent.trim()
            );

        const isActive =
            trackIndex ===
            currentTrackIndex;

        item.classList.toggle(
            "active",
            isActive
        );

        item.classList.toggle(
            "playing",
            isActive && isPlaying
        );
    });
}

function updateTrackCount() {
    if (!trackCount) {
        return;
    }

    trackCount.textContent =
        `${tracks.length} tracks`;
}


/* =========================
   SEARCH
========================= */

function createPlaylistSearch() {
    if (!playlistContainer) {
        return;
    }

    const existingSearch =
        document.getElementById(
            "playlist-search"
        );

    if (existingSearch) {
        searchInput =
            existingSearch;

        searchInput.addEventListener(
            "input",
            () => {
                renderPlaylist(
                    searchInput.value
                );
            }
        );

        return;
    }

    const parent =
        playlistContainer.parentElement;

    if (!parent) {
        return;
    }

    searchInput =
        document.createElement(
            "input"
        );

    searchInput.type = "search";

    searchInput.placeholder =
        "Search AstraWave...";

    searchInput.setAttribute(
        "aria-label",
        "Search AstraWave playlist"
    );

    searchInput.className =
        "astrawave-search";

    searchInput.addEventListener(
        "input",
        () => {
            renderPlaylist(
                searchInput.value
            );
        }
    );

    parent.insertBefore(
        searchInput,
        playlistContainer
    );
}


/* =========================
   ADVANCED CONTROLS
========================= */

function createAdvancedControls() {
    if (
        !playButton ||
        !playButton.parentElement
    ) {
        return;
    }

    const controls =
        playButton.parentElement;

    if (
        controls.querySelector(
            ".advanced-control"
        )
    ) {
        shuffleButton =
            controls.querySelector(
                ".advanced-control.shuffle"
            );

        repeatButton =
            controls.querySelector(
                ".advanced-control.repeat"
            );

        favouriteButton =
            controls.querySelector(
                ".advanced-control.favourite"
            );

        muteButton =
            controls.querySelector(
                ".advanced-control.mute"
            );

        bindAdvancedControls();

        return;
    }

    shuffleButton =
        createControlButton(
            "shuffle",
            "Shuffle",
            "⤨"
        );

    repeatButton =
        createControlButton(
            "repeat",
            "Repeat",
            "↻"
        );

    favouriteButton =
        createControlButton(
            "favourite",
            "Favourite",
            "♡"
        );

    muteButton =
        createControlButton(
            "mute",
            "Mute",
            "🔊"
        );

    controls.appendChild(
        shuffleButton
    );

    controls.appendChild(
        repeatButton
    );

    controls.appendChild(
        favouriteButton
    );

    controls.appendChild(
        muteButton
    );

    bindAdvancedControls();
}

function bindAdvancedControls() {
    if (shuffleButton) {
        shuffleButton.onclick =
            toggleShuffle;
    }

    if (repeatButton) {
        repeatButton.onclick =
            toggleRepeat;
    }

    if (favouriteButton) {
        favouriteButton.onclick =
            toggleFavourite;
    }

    if (muteButton) {
        muteButton.onclick =
            toggleMute;
    }
}

function createControlButton(
    className,
    label,
    icon
) {
    const button =
        document.createElement(
            "button"
        );

    button.type = "button";

    button.className =
        `advanced-control ${className}`;

    button.textContent =
        icon;

    button.title =
        label;

    button.setAttribute(
        "aria-label",
        label
    );

    return button;
}


/* =========================
   BUTTON STATES
========================= */

function updatePlayButton() {
    if (!playButton) {
        return;
    }

    playButton.textContent =
        isPlaying
            ? "❚❚"
            : "▶";

    playButton.setAttribute(
        "aria-label",
        isPlaying
            ? "Pause"
            : "Play"
    );
}

function updateButtonStates() {
    updatePlayButton();

    if (shuffleButton) {
        shuffleButton.classList.toggle(
            "active",
            shuffleEnabled
        );
    }

    if (repeatButton) {
        repeatButton.classList.toggle(
            "active",
            repeatMode !== "off"
        );

        repeatButton.textContent =
            repeatMode === "one"
                ? "↻¹"
                : "↻";
    }

    updateFavouriteButton();

    if (muteButton) {
        updateMuteButton(
            audioPlayer.volume === 0
        );
    }
}

function updateFavouriteButton() {
    if (!favouriteButton) {
        return;
    }

    const favourite =
        isFavourite(
            tracks[currentTrackIndex]
        );

    favouriteButton.textContent =
        favourite
            ? "♥"
            : "♡";

    favouriteButton.classList.toggle(
        "active",
        favourite
    );

    favouriteButton.title =
        favourite
            ? "Remove from favourites"
            : "Add to favourites";
}

function updateMuteButton(isMuted) {
    if (!muteButton) {
        return;
    }

    muteButton.textContent =
        isMuted
            ? "🔇"
            : "🔊";

    muteButton.classList.toggle(
        "active",
        isMuted
    );
}


/* =========================
   VISUALIZER
========================= */

function createVisualizer() {
    const playerCard =
        document.querySelector(
            ".player-card"
        );

    if (!playerCard) {
        return;
    }

    visualizerCanvas =
        document.getElementById(
            "visualizer"
        ) ||
        playerCard.querySelector(
            ".astrawave-visualizer"
        );

    if (!visualizerCanvas) {
        visualizerCanvas =
            document.createElement(
                "canvas"
            );

        visualizerCanvas.id =
            "visualizer";

        visualizerCanvas.className =
            "astrawave-visualizer";

        visualizerCanvas.setAttribute(
            "aria-hidden",
            "true"
        );

        playerCard.appendChild(
            visualizerCanvas
        );
    }

    resizeVisualizer();

    window.addEventListener(
        "resize",
        resizeVisualizer
    );
}

function resizeVisualizer() {
    if (!visualizerCanvas) {
        return;
    }

    const rect =
        visualizerCanvas.getBoundingClientRect();

    const pixelRatio =
        window.devicePixelRatio || 1;

    visualizerCanvas.width =
        rect.width *
        pixelRatio;

    visualizerCanvas.height =
        rect.height *
        pixelRatio;
}

function setupVisualizerAudio() {
    if (!visualizerCanvas) {
        return;
    }

    const AudioContextClass =
        window.AudioContext ||
        window.webkitAudioContext;

    if (!AudioContextClass) {
        return;
    }

    if (!audioContext) {
        audioContext =
            new AudioContextClass();

        analyser =
            audioContext.createAnalyser();

        analyser.fftSize = 128;

        analyser.smoothingTimeConstant =
            0.82;

        sourceNode =
            audioContext.createMediaElementSource(
                audioPlayer
            );

        sourceNode.connect(
            analyser
        );

        analyser.connect(
            audioContext.destination
        );
    }

    if (
        audioContext.state ===
        "suspended"
    ) {
        audioContext.resume();
    }

    if (!visualizerAnimation) {
        animateVisualizer();
    }
}

function animateVisualizer() {
    if (
        !visualizerCanvas ||
        !analyser
    ) {
        visualizerAnimation = null;
        return;
    }

    const canvas =
        visualizerCanvas;

    const context =
        canvas.getContext(
            "2d"
        );

    if (!context) {
        visualizerAnimation = null;
        return;
    }

    const bufferLength =
        analyser.frequencyBinCount;

    const dataArray =
        new Uint8Array(
            bufferLength
        );

    function draw() {
        visualizerAnimation =
            requestAnimationFrame(
                draw
            );

        analyser.getByteFrequencyData(
            dataArray
        );

        context.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );

        let average = 0;

        for (
            let i = 0;
            i < bufferLength;
            i++
        ) {
            average +=
                dataArray[i];
        }

        average /=
            bufferLength;

        const energy =
            average / 255;

        albumArtPulse =
            albumArtPulse * 0.88 +
            energy * 0.12;

        if (
            albumArt &&
            currentArtwork
        ) {
            const glow =
                1 +
                albumArtPulse * 0.08;

            albumArt.style.setProperty(
                "--art-energy",
                albumArtPulse
            );

            albumArt.style.transform =
                `scale(${glow})`;
        }

        const barWidth =
            canvas.width /
            bufferLength;

        const gradient =
            context.createLinearGradient(
                0,
                canvas.height,
                0,
                0
            );

        const palette =
            currentArtwork?.palette ||
            artworkPalettes[0];

        gradient.addColorStop(
            0,
            hexToRgba(
                palette.primary,
                0.15
            )
        );

        gradient.addColorStop(
            0.5,
            hexToRgba(
                palette.secondary,
                0.45
            )
        );

        gradient.addColorStop(
            1,
            hexToRgba(
                palette.accent,
                0.8
            )
        );

        context.fillStyle =
            gradient;

        for (
            let i = 0;
            i < bufferLength;
            i++
        ) {
            const value =
                dataArray[i] / 255;

            const barHeight =
                value *
                canvas.height;

            const x =
                i * barWidth;

            const y =
                canvas.height -
                barHeight;

            context.fillRect(
                x,
                y,
                Math.max(
                    barWidth - 2,
                    1
                ),
                barHeight
            );
        }
    }

    draw();
}

function hexToRgba(
    hex,
    alpha
) {
    const clean =
        hex.replace(
            "#",
            ""
        );

    if (
        clean.length !== 6
    ) {
        return `rgba(143, 124, 255, ${alpha})`;
    }

    const red =
        parseInt(
            clean.substring(0, 2),
            16
        );

    const green =
        parseInt(
            clean.substring(2, 4),
            16
        );

    const blue =
        parseInt(
            clean.substring(4, 6),
            16
        );

    return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}


/* =========================
   TIME FORMAT
========================= */

function formatTime(seconds) {
    if (!Number.isFinite(seconds)) {
        return "0:00";
    }

    const minutes =
        Math.floor(
            seconds / 60
        );

    const remainingSeconds =
        Math.floor(
            seconds % 60
        );

    return `${minutes}:${String(
        remainingSeconds
    ).padStart(2, "0")}`;
}


/* =========================
   HTML ESCAPING
========================= */

function escapeHTML(value) {
    return String(value)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );
}


/* =========================
   KEYBOARD CONTROLS
========================= */

document.addEventListener(
    "keydown",
    event => {
        const tag =
            document.activeElement?.tagName;

        if (
            tag === "INPUT" ||
            tag === "TEXTAREA"
        ) {
            return;
        }

        if (
            event.code ===
            "Space"
        ) {
            event.preventDefault();

            togglePlayPause();

            return;
        }

        if (
            event.code ===
                "ArrowRight" &&
            event.shiftKey
        ) {
            event.preventDefault();

            nextTrack();

            return;
        }

        if (
            event.code ===
                "ArrowLeft" &&
            event.shiftKey
        ) {
            event.preventDefault();

            previousTrack();

            return;
        }

        if (
            event.code ===
            "ArrowRight"
        ) {
            event.preventDefault();

            if (
                Number.isFinite(
                    audioPlayer.duration
                )
            ) {
                audioPlayer.currentTime =
                    Math.min(
                        audioPlayer.currentTime +
                            5,
                        audioPlayer.duration
                    );
            }

            return;
        }

        if (
            event.code ===
            "ArrowLeft"
        ) {
            event.preventDefault();

            audioPlayer.currentTime =
                Math.max(
                    audioPlayer.currentTime -
                        5,
                    0
                );

            return;
        }

        if (
            event.code ===
            "ArrowUp"
        ) {
            event.preventDefault();

            const newVolume =
                Math.min(
                    audioPlayer.volume +
                        0.05,
                    1
                );

            audioPlayer.volume =
                newVolume;

            if (volumeSlider) {
                volumeSlider.value =
                    newVolume;
            }

            localStorage.setItem(
                "astrawave-volume",
                newVolume
            );

            updateMuteButton(
                false
            );

            return;
        }

        if (
            event.code ===
            "ArrowDown"
        ) {
            event.preventDefault();

            const newVolume =
                Math.max(
                    audioPlayer.volume -
                        0.05,
                    0
                );

            audioPlayer.volume =
                newVolume;

            if (volumeSlider) {
                volumeSlider.value =
                    newVolume;
            }

            localStorage.setItem(
                "astrawave-volume",
                newVolume
            );

            updateMuteButton(
                newVolume === 0
            );

            return;
        }

        if (
            event.key.toLowerCase() ===
            "m"
        ) {
            toggleMute();

            return;
        }

        if (
            event.key.toLowerCase() ===
            "s"
        ) {
            toggleShuffle();

            return;
        }

        if (
            event.key.toLowerCase() ===
            "r"
        ) {
            toggleRepeat();

            return;
        }

        if (
            event.key.toLowerCase() ===
            "f"
        ) {
            toggleFavourite();
        }
    }
);


/* =========================
   BUTTON EVENTS
========================= */

if (playButton) {
    playButton.addEventListener(
        "click",
        togglePlayPause
    );
}

if (previousButton) {
    previousButton.addEventListener(
        "click",
        previousTrack
    );
}

if (nextButton) {
    nextButton.addEventListener(
        "click",
        nextTrack
    );
}


/* =========================
   START ASTRAWAVE
========================= */

initialisePlayer();