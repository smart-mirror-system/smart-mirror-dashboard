const COCO_CONNECTIONS = [
    [5, 6], [5, 7], [7, 9], [6, 8], [8, 10], [5, 11], [6, 12], [11, 12],
    [11, 13], [13, 15], [12, 14], [14, 16]
];

export function drawSkeleton(canvas, skeletonPoints) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw keypoints
    skeletonPoints.forEach(p => {
        if (p[0] !== 0 || p[1] !== 0) {
            ctx.beginPath();
            ctx.arc(p[0], p[1], 4, 0, 2 * Math.PI);
            ctx.fillStyle = "#00ffff";
            ctx.fill();
        }
    });

    // Draw connections
    COCO_CONNECTIONS.forEach(([start, end]) => {
        const p1 = skeletonPoints[start];
        const p2 = skeletonPoints[end];
        if ((p1[0] !== 0 || p1[1] !== 0) && (p2[0] !== 0 || p2[1] !== 0)) {
            ctx.beginPath();
            ctx.moveTo(p1[0], p1[1]);
            ctx.lineTo(p2[0], p2[1]);
            ctx.strokeStyle = "rgba(255,255,255,0.5)";
            ctx.stroke();
        }
    });
}