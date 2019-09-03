export default class QRDot {
    constructor({ context, type }) {
        this.context = context;
        this.type = type;
    }

    draw(x, y, size, getNeighbor) {
        const context = this.context;
        const type = this.type;

        if (type === "dots") {
            context.beginPath();
            context.arc(x + size / 2, y + size / 2,size / 2,0,Math.PI*2);
            context.fill();
        } else if (type === "rounded") {
            context.beginPath();
            context.moveTo(x, y + size / 2);

            if (getNeighbor(-1, 0) || getNeighbor(0, -1)) {
                context.lineTo(x, y);
                context.lineTo(x + size / 2, y);
            } else {
                context.arc(x + size / 2, y + size / 2,size / 2, - Math.PI,- Math.PI / 2);
            }

            if (getNeighbor(0, -1) || getNeighbor(1, 0)) {
                context.lineTo(x + size, y);
                context.lineTo(x + size, y + size / 2);
            } else {
                context.arc(x + size / 2, y + size / 2,size / 2,- Math.PI / 2, 0);
            }

            if (getNeighbor(1, 0) || getNeighbor(0, 1)) {
                context.lineTo(x + size, y + size);
                context.lineTo(x + size / 2, y + size);
            } else {
                context.arc(x + size / 2, y + size / 2,size / 2, 0, Math.PI / 2);
            }

            if (getNeighbor(0, 1) || getNeighbor(-1, 0)) {
                context.lineTo(x, y + size);
                context.lineTo(x, y + size / 2);
            } else {
                context.arc(x + size / 2, y + size / 2,size / 2, Math.PI / 2, Math.PI);
            }

            context.fill();
        } else {
            context.fillRect(x, y, size, size);
        }
    }
};