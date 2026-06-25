/* ==========================================
   TIMESPHERE 3D - UPDATED VERSION
   Drag Rotate + Depth + Live Time
========================================== */

const sphere = document.getElementById("sphere");
const bubbles = document.querySelectorAll(".bubble");

/* ==========================================
   TIMEZONES
========================================== */

const timezones = [
    "Asia/Karachi",
    "America/New_York",
    "Europe/London",
    "Asia/Tokyo",
    "Asia/Shanghai",
    "Europe/Berlin",
    "Europe/Paris",
    "America/Toronto",
    "Australia/Sydney",
    "Asia/Dubai",
    "Asia/Kolkata",
    "Asia/Riyadh",
    "Europe/Istanbul",
    "Asia/Seoul",
    "Asia/Singapore"
];

/* ==========================================
   SETTINGS
========================================== */

const radius = 230;

let rotationX = -10;
let rotationY = 20;

let targetRotationX = rotationX;
let targetRotationY = rotationY;

/* ==========================================
   CREATE 3D SPHERE
========================================== */

const points = [];

function createSphere() {

    const total = bubbles.length;

    bubbles.forEach((bubble, i) => {

        const phi =
            Math.acos(
                -1 + (2 * i) / total
            );

        const theta =
            Math.sqrt(
                total * Math.PI
            ) * phi;

        const x =
            radius *
            Math.cos(theta) *
            Math.sin(phi);

        const y =
            radius *
            Math.sin(theta) *
            Math.sin(phi);

        const z =
            radius *
            Math.cos(phi);

        points.push({
            bubble,
            x,
            y,
            z
        });

    });

}

createSphere();

/* ==========================================
   ROTATE POINT
========================================== */

function rotatePoint(x, y, z) {

    const rx =
        rotationX *
        Math.PI /
        180;

    const ry =
        rotationY *
        Math.PI /
        180;

    let dy =
        y * Math.cos(rx) -
        z * Math.sin(rx);

    let dz =
        y * Math.sin(rx) +
        z * Math.cos(rx);

    y = dy;
    z = dz;

    let dx =
        x * Math.cos(ry) +
        z * Math.sin(ry);

    dz =
        -x * Math.sin(ry) +
        z * Math.cos(ry);

    x = dx;
    z = dz;

    return { x, y, z };
}

/* ==========================================
   RENDER
========================================== */

function renderSphere() {

    points.forEach(point => {

        const pos =
            rotatePoint(
                point.x,
                point.y,
                point.z
            );

        const depth =
            (pos.z + radius) /
            (radius * 2);

        const scale =
            0.45 +
            depth * 1.1;

        const opacity =
            0.25 +
            depth * 0.85;

        const centerX =
            sphere.clientWidth / 2;

        const centerY =
            sphere.clientHeight / 2;

        point.bubble.style.left =
            centerX + pos.x + "px";

        point.bubble.style.top =
            centerY + pos.y + "px";

        point.bubble.style.transform =
            `translate(-50%,-50%) scale(${scale})`;

        point.bubble.style.opacity =
            opacity;

        point.bubble.style.zIndex =
            Math.floor(
                depth * 1000
            );

    });

}

/* ==========================================
   LIVE TIME
========================================== */

function updateTime() {

    bubbles.forEach((bubble, index) => {

        const timeEl =
            bubble.querySelector(".time");

        const now =
            new Date();

        try {

            timeEl.innerText =
                now.toLocaleTimeString(
                    "en-US",
                    {
                        timeZone:
                        timezones[index],
                        hour:
                        "2-digit",
                        minute:
                        "2-digit"
                    }
                );

        }
        catch(err){}

    });

}

updateTime();

setInterval(
    updateTime,
    1000
);

/* ==========================================
   ACTIVE BUBBLE
========================================== */

bubbles.forEach(bubble => {

    bubble.addEventListener(
        "click",
        () => {

            bubbles.forEach(
                b =>
                b.classList.remove(
                    "active"
                )
            );

            bubble.classList.add(
                "active"
            );

        }
    );

});

/* ==========================================
   DRAG ROTATION
========================================== */

let isDragging = false;

let startX = 0;
let startY = 0;

sphere.addEventListener(
    "mousedown",
    e => {

        isDragging = true;

        startX = e.clientX;
        startY = e.clientY;

    }
);

document.addEventListener(
    "mouseup",
    () => {

        isDragging = false;

    }
);

document.addEventListener(
    "mousemove",
    e => {

        if (!isDragging)
            return;

        const deltaX =
            e.clientX - startX;

        const deltaY =
            e.clientY - startY;

        targetRotationY +=
            deltaX * 0.4;

        targetRotationX -=
            deltaY * 0.4;

        startX = e.clientX;
        startY = e.clientY;

    }
);

/* ==========================================
   TOUCH SUPPORT
========================================== */

sphere.addEventListener(
    "touchstart",
    e => {

        startX =
            e.touches[0].clientX;

        startY =
            e.touches[0].clientY;

    }
);

sphere.addEventListener(
    "touchmove",
    e => {

        const deltaX =
            e.touches[0].clientX -
            startX;

        const deltaY =
            e.touches[0].clientY -
            startY;

        targetRotationY +=
            deltaX * 0.25;

        targetRotationX -=
            deltaY * 0.25;

        startX =
            e.touches[0].clientX;

        startY =
            e.touches[0].clientY;

    }
);

/* ==========================================
   AUTO ROTATION
========================================== */

let autoRotate = true;

/* ==========================================
   ANIMATION LOOP
========================================== */

function animate() {

    if (autoRotate) {

        targetRotationY +=
            0.05;

    }

    rotationX +=
        (targetRotationX -
        rotationX) *
        0.08;

    rotationY +=
        (targetRotationY -
        rotationY) *
        0.08;

    renderSphere();

    requestAnimationFrame(
        animate
    );

}

animate();