
// ========================================
// TUSHAR GOLD - PREMIUM SPIN WHEEL
// VIOLET TEXT - NO GLOW
// FIXED 100 SPIN PRIZE SYSTEM
// ========================================

const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");

const spinBtn = document.getElementById("spinBtn");
const resultBox = document.getElementById("result");


// ========================================
// PRIZES
// ========================================

const prizes = [
    {
        name: "20% OFF",
        message: "আপনি পেয়েছেন 20% OFF!",
        className: "prize-gold"
    },
    {
        name: "10% OFF",
        message: "আপনি পেয়েছেন 10% OFF!",
        className: "prize-gold"
    },
    {
        name: "ALSO TRY",
        message: "আবার চেষ্টা করুন!",
        className: "prize-try"
    },
    {
        name: "NEXT TIME",
        message: "পরের বার ভাগ্য পরীক্ষা করুন!",
        className: "prize-next"
    }
];


// ========================================
// 100 SPIN FIXED DISTRIBUTION
// ========================================

const TOTAL_SPINS = 100;

const DISTRIBUTION = [
    10, // 20% OFF
    15, // 10% OFF
    15, // ALSO TRY
    60  // NEXT TIME
];


// ========================================
// LOCAL STORAGE KEYS
// ========================================

const CYCLE_KEY = "tusharGoldPrizeCycle";
const INDEX_KEY = "tusharGoldPrizeIndex";


// ========================================
// SHUFFLE
// ========================================

function shuffle(array) {

    const arr = [...array];

    for (let i = arr.length - 1; i > 0; i--) {

        const j =
            Math.floor(
                Math.random() * (i + 1)
            );

        [arr[i], arr[j]] =
            [arr[j], arr[i]];
    }

    return arr;
}


// ========================================
// CREATE NEW 100 SPIN CYCLE
// ========================================

function createNewCycle() {

    let cycle = [];

    for (
        let prizeIndex = 0;
        prizeIndex < DISTRIBUTION.length;
        prizeIndex++
    ) {

        for (
            let i = 0;
            i < DISTRIBUTION[prizeIndex];
            i++
        ) {

            cycle.push(prizeIndex);
        }
    }

    cycle = shuffle(cycle);

    localStorage.setItem(
        CYCLE_KEY,
        JSON.stringify(cycle)
    );

    localStorage.setItem(
        INDEX_KEY,
        "0"
    );

    return cycle;
}


// ========================================
// GET CURRENT CYCLE
// ========================================

function getCycle() {

    try {

        const savedCycle =
            localStorage.getItem(CYCLE_KEY);

        if (!savedCycle) {

            return createNewCycle();
        }

        const cycle =
            JSON.parse(savedCycle);

        if (
            !Array.isArray(cycle) ||
            cycle.length !== TOTAL_SPINS
        ) {

            return createNewCycle();
        }

        return cycle;

    } catch (error) {

        console.log(
            "Cycle error:",
            error
        );

        return createNewCycle();
    }
}


// ========================================
// GET CURRENT SPIN NUMBER
// ========================================

function getCurrentIndex() {

    let index =
        parseInt(
            localStorage.getItem(INDEX_KEY),
            10
        );

    if (
        isNaN(index) ||
        index < 0 ||
        index >= TOTAL_SPINS
    ) {

        index = 0;

        localStorage.setItem(
            INDEX_KEY,
            "0"
        );
    }

    return index;
}


// ========================================
// GET NEXT PRIZE
// ========================================

function getNextPrizeIndex() {

    let cycle = getCycle();

    let index = getCurrentIndex();

    if (index >= TOTAL_SPINS) {

        cycle = createNewCycle();

        index = 0;
    }

    const selectedPrize =
        cycle[index];

    index++;

    localStorage.setItem(
        INDEX_KEY,
        index.toString()
    );

    return selectedPrize;
}


// ========================================
// WHEEL SETTINGS
// ========================================

const centerX =
    canvas.width / 2;

const centerY =
    canvas.height / 2;

const radius = 185;

const sectionAngle =
    (Math.PI * 2) / prizes.length;


// ========================================
// DRAW WHEEL
// ========================================

function drawWheel() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    // ====================================
    // OUTER GOLD RING
    // ====================================

    ctx.beginPath();

    ctx.arc(
        centerX,
        centerY,
        radius + 8,
        0,
        Math.PI * 2
    );

    const outerGradient =
        ctx.createLinearGradient(
            100,
            80,
            300,
            320
        );

    outerGradient.addColorStop(
        0,
        "#fff0a5"
    );

    outerGradient.addColorStop(
        0.25,
        "#b87908"
    );

    outerGradient.addColorStop(
        0.5,
        "#ffe27a"
    );

    outerGradient.addColorStop(
        0.75,
        "#8c5a06"
    );

    outerGradient.addColorStop(
        1,
        "#fff0a5"
    );

    ctx.fillStyle =
        outerGradient;

    ctx.fill();


    // ====================================
    // INNER WHEEL
    // ====================================

    const colors = [
        "#f5d77a",
        "#e8b84c",
        "#d8a938",
        "#f1cf69"
    ];


    for (
        let i = 0;
        i < prizes.length;
        i++
    ) {

        const startAngle =
            -Math.PI / 2 +
            i * sectionAngle;

        const endAngle =
            startAngle +
            sectionAngle;


        // =================================
        // WHEEL SECTION
        // =================================

        ctx.beginPath();

        ctx.moveTo(
            centerX,
            centerY
        );

        ctx.arc(
            centerX,
            centerY,
            radius,
            startAngle,
            endAngle
        );

        ctx.closePath();


        const gradient =
            ctx.createLinearGradient(
                centerX,
                centerY - radius,
                centerX,
                centerY + radius
            );

        gradient.addColorStop(
            0,
            "#fff1a8"
        );

        gradient.addColorStop(
            0.45,
            colors[i]
        );

        gradient.addColorStop(
            1,
            "#c28b19"
        );

        ctx.fillStyle =
            gradient;

        ctx.fill();


        // =================================
        // SECTION BORDER
        // =================================

        ctx.strokeStyle =
            "#fff4c7";

        ctx.lineWidth = 3;

        ctx.stroke();


        // =================================
        // VIOLET PRIZE TEXT
        // NO GLOW
        // =================================

        const textAngle =
            startAngle +
            sectionAngle / 2;

        const textRadius = 112;

        const textX =
            centerX +
            Math.cos(textAngle) *
            textRadius;

        const textY =
            centerY +
            Math.sin(textAngle) *
            textRadius;


        ctx.save();

        ctx.translate(
            textX,
            textY
        );

        ctx.rotate(
            textAngle +
            Math.PI / 2
        );

        ctx.textAlign =
            "center";

        ctx.textBaseline =
            "middle";


        // Premium font
        ctx.font =
            "900 19px Georgia, 'Times New Roman', serif";


        // NO SHADOW / NO GLOW
        ctx.shadowColor =
            "transparent";

        ctx.shadowBlur = 0;

        ctx.shadowOffsetX = 0;

        ctx.shadowOffsetY = 0;


        // Bright violet
        ctx.fillStyle =
            "#7B00D4";

        ctx.fillText(
            prizes[i].name,
            0,
            0
        );


        ctx.restore();
    }


    // ====================================
    // CENTER CIRCLE
    // ====================================

    ctx.beginPath();

    ctx.arc(
        centerX,
        centerY,
        43,
        0,
        Math.PI * 2
    );


    const centerGradient =
        ctx.createRadialGradient(
            centerX - 10,
            centerY - 10,
            4,
            centerX,
            centerY,
            45
        );

    centerGradient.addColorStop(
        0,
        "#f0c85a"
    );

    centerGradient.addColorStop(
        0.45,
        "#9a6008"
    );

    centerGradient.addColorStop(
        1,
        "#5d3500"
    );

    ctx.fillStyle =
        centerGradient;

    ctx.fill();


    // ====================================
    // CENTER BORDER
    // ====================================

    ctx.strokeStyle =
        "#ffe49a";

    ctx.lineWidth = 4;

    ctx.stroke();


    // ====================================
    // VIOLET SPIN TEXT
    // NO GLOW
    // ====================================

    ctx.save();

    ctx.textAlign =
        "center";

    ctx.textBaseline =
        "middle";

    ctx.font =
        "900 14px Georgia, 'Times New Roman', serif";


    // NO SHADOW / NO GLOW
    ctx.shadowColor =
        "transparent";

    ctx.shadowBlur = 0;

    ctx.shadowOffsetX = 0;

    ctx.shadowOffsetY = 0;


    // Bright violet
    ctx.fillStyle =
        "#B000FF";

    ctx.fillText(
        "SPIN",
        centerX,
        centerY
    );


    ctx.restore();
}


// ========================================
// INITIAL DRAW
// ========================================

drawWheel();


// ========================================
// ROTATION
// ========================================

let currentRotation = 0;

let isSpinning = false;


// ========================================
// SPIN WHEEL
// ========================================

function spinWheel() {

    if (isSpinning) {
        return;
    }


    isSpinning = true;

    spinBtn.disabled = true;

    spinBtn.innerHTML =
        "🎡 SPINNING...";


    // ====================================
    // GET FIXED PRIZE
    // ====================================

    const prizeIndex =
        getNextPrizeIndex();

    const prize =
        prizes[prizeIndex];


    // ====================================
    // TARGET ANGLES
    // POINTER = TOP
    // ====================================

    const targetAngles = [

        315, // 20% OFF

        225, // 10% OFF

        135, // ALSO TRY

        45   // NEXT TIME

    ];


    const target =
        targetAngles[prizeIndex];


    // ====================================
    // CURRENT ROTATION
    // ====================================

    const current =
        (
            (currentRotation % 360) +
            360
        ) % 360;


    // ====================================
    // DIFFERENCE
    // ====================================

    let difference =
        target - current;


    if (difference < 0) {

        difference += 360;
    }


    // ====================================
    // 6 FULL ROTATIONS
    // ====================================

    const fullSpins =
        360 * 6;


    const finalRotation =
        currentRotation +
        fullSpins +
        difference;


    currentRotation =
        finalRotation;


    // ====================================
    // ROTATE WHEEL
    // ====================================

    canvas.style.transform =
        `rotate(${finalRotation}deg)`;


    // ====================================
    // SHOW RESULT
    // ====================================

    setTimeout(() => {

        showResult(prize);

        isSpinning = false;

        spinBtn.disabled = false;

        spinBtn.innerHTML =
            "🎡 SPIN NOW";

    }, 4300);
}


// ========================================
// BUTTON CLICK
// ========================================

spinBtn.addEventListener(
    "click",
    spinWheel
);


// ========================================
// SHOW PREMIUM RESULT
// ========================================

function showResult(prize) {

    resultBox.innerHTML = `

        <div class="premium-result ${prize.className}">

            <div class="result-glow"></div>

            <div class="result-crown">
                ✨
            </div>

            <div class="result-heading">
                CONGRATULATIONS
            </div>

            <div class="result-line"></div>

            <div class="result-subheading">
                YOUR PRIZE
            </div>

            <div class="result-prize">
                ${prize.name}
            </div>

            <div class="result-message">
                ${prize.message}
            </div>

        </div>

    `;


    resultBox.classList.add(
        "show-result"
    );
}


// ========================================
// CLOSE RESULT
// ========================================

function closeResult() {

    resultBox.classList.remove(
        "show-result"
    );
}


// ========================================
// CLICK OUTSIDE RESULT
// ========================================

resultBox.addEventListener(
    "click",
    function (event) {

        if (
            event.target === resultBox
        ) {

            closeResult();
        }
    }
);


// ========================================
// ESC KEY
// ========================================

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape"
        ) {

            closeResult();
        }
    }
);

