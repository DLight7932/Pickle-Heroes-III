import React from 'react';
import "../styles/Canvas.css";

export default class Field extends React.Component {

    constructor(props) {
        super(props);
        this.handleMouseMove = this.handleMouseMove.bind(this);
    }

    gridColor = "black";
    fieldWidth = 15;
    fieldHeight = 10;
    hexSize = 100;
    hexHeight = 1.1547;
    ySize = 1;
    fieldX = 0;
    fieldY = -this.hexHeight / 4 * this.hexSize * this.ySize;
    currHex = this.Point(0, 0);

    DrawGrid() {
        for (let i = 0; i < this.fieldHeight; i++) {
            for (let j = 0; j < this.fieldWidth; j++) {
                this.DrawHex(this.canvasHex, this.Point(j, i), this.gridColor);
            }
        }
    }

    DrawHex(canvasID, index, color) {
        let coord = this.IndexToPixel(index);

        let start = this.Point(coord.x, coord.y - (this.hexHeight / 2) * this.hexSize * this.ySize);
        let end = this.Point(coord.x - this.hexSize / 2, coord.y - (this.hexHeight / 4) * this.hexSize * this.ySize);
        this.drawLine(canvasID, start, end, color);

        start = end;
        end = this.Point(coord.x - this.hexSize / 2, coord.y + (this.hexHeight / 4) * this.hexSize * this.ySize);
        this.drawLine(canvasID, start, end, color);

        start = end;
        end = this.Point(coord.x, coord.y + (this.hexHeight / 2) * this.hexSize * this.ySize);
        this.drawLine(canvasID, start, end, color);

        start = end;
        end = this.Point(coord.x + this.hexSize / 2, coord.y + (this.hexHeight / 4) * this.hexSize * this.ySize);
        this.drawLine(canvasID, start, end, color);

        start = end;
        end = this.Point(coord.x + this.hexSize / 2, coord.y - (this.hexHeight / 4) * this.hexSize * this.ySize);
        this.drawLine(canvasID, start, end, color);

        start = end;
        end = this.Point(coord.x, coord.y - (this.hexHeight / 2) * this.hexSize * this.ySize);
        this.drawLine(canvasID, start, end, color);
    }

    Point(x, y) {
        return { x: x, y: y }
    }

    PixelToIndex(p) {
        return this.Point(Math.floor(p.x / this.hexSize), Math.floor(p.y / this.hexHeight));
    }

    IndexToPixel(i) {
        return this.Point(
            this.fieldX + this.hexSize * 0.5 + i.x * this.hexSize + (i.y % 2) * this.hexSize / 2,
            this.fieldY + (this.hexSize * (3 * this.hexHeight / 4) + i.y * this.hexSize * (3 * this.hexHeight / 4)) * this.ySize
        );;
    }

    drawLine(canvasID, start, end, color) {
        const ctx = canvasID.getContext("2d");
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.strokeStyle = color;
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
        ctx.closePath();
    }

    drawImage(img, canvasID, coord, size) {
        const ctx = canvasID.getContext("2d");
        ctx.drawImage(img, coord.x, coord.y, size.x, size.y);
    }

    componentWillMount() {
        this.setState({
            canvasSize: { canvasWidth: 1600, canvasHeight: 900 }
        })
    }

    componentDidMount() {
        const { canvasWidth, canvasHeight } = this.state.canvasSize;
        this.canvasHex.width = canvasWidth;
        this.canvasHex.height = canvasHeight;
        this.DrawGrid();
        let coord = this.Point(500, 500);
        let size = this.Point(500, 500);
        let img = new Image();
        //img.src = 'logo192.gif';
        //img.src = "https://drive.google.com/file/d/1u1Q0DcH4KSxizeFUR0_Zx1JMniccLjWq/view?usp=sharing";
        //img.src = "https://drive.google.com/file/d/1QXFSK2yrl74_FmaUK5bO2927ovr4oA6R/view?usp=sharing";
        //img.src = "Z8X2VMCx.jpg";
        //img.src = "smile.jpg";

        //img.src = "https://img.rosbalt.ru/photobank/1/c/a/0/Z8X2VMCx.jpg";
        //img.onload = () => this.drawImage(img, this.canvasHex, coord, size);
    }

    Distance(p1, p2) {
        return Math.sqrt(Math.pow(Math.abs(p1.x - p2.x), 2) + Math.pow(Math.abs(p1.y - p2.y), 2));
    }

    MouseIndex(mouse) {
        let base = this.Point(0, 0);
        base.y = Math.floor(mouse.y / (this.hexHeight * this.hexSize * 3 / 4));
        base.x = Math.floor((mouse.x - ((base.y % 2) * (this.hexSize / 2))) / this.hexSize);

        let px;
        let py1;
        let py2;

        if (mouse.x > this.IndexToPixel(base).x) {
            px = this.Point(base.x + 1, base.y);
        }
        else {
            px = this.Point(base.x - 1, base.y);
        }
        if (mouse.y > this.IndexToPixel(base).y) {
            py1 = this.Point(base.x, base.y + 1);
            py2 = this.Point(base.x + 1, base.y + 1);
        }
        else {
            py1 = this.Point(base.x, base.y - 1);
            py2 = this.Point(base.x + 1, base.y - 1);
        }
        if (base.y % 2 == 0) {
            py1.x--;
            py2.x--;
        }

        let point = base;
        if (this.Distance(this.IndexToPixel(px), mouse) < this.Distance(this.IndexToPixel(point), mouse))
            point = px;
        if (this.Distance(this.IndexToPixel(py1), mouse) < this.Distance(this.IndexToPixel(point), mouse))
            point = py1;
        if (this.Distance(this.IndexToPixel(py2), mouse) < this.Distance(this.IndexToPixel(point), mouse))
            point = py2;
        return point;
    }

    handleMouseMove(e) {
        let newHex = this.MouseIndex(this.Point(e.pageX, e.pageY));
        if (this.currHex !== this.newHex)
        {
            this.DrawHex(this.canvasHex, this.currHex, this.gridColor);
            this.currHex = newHex;
            this.DrawHex(this.canvasHex, this.currHex, "red");
        }
    }

    render() {
        return (
            <div>
                <canvas ref={canvasHex => this.canvasHex = canvasHex} onMouseMove={this.handleMouseMove}></canvas>
            </div>
        );
    }
}