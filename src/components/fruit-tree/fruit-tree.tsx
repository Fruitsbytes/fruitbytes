import { Component, Host, h, Prop, Element, Watch, State } from '@stencil/core';
import { animateCSS, getRandomArbitrary, getRandomInt } from '../../utils';
import { DEFAULT_FOLIAGE_RATIOS, FoliageRatio, StemPoint } from './fruit';
import memo from 'memo-decorator';

@Component({
  tag: 'fruit-tree',
  styleUrl: 'fruit-tree.scss',
  shadow: true,
})
export class FruitTree {
  @Prop() fruit = 0;
  @Prop() fruitSize = 16;
  @Prop() filter: string = 'inherit';
  @Prop() transform: string = 'inherit';
  @Prop() scale = 1;
  @Prop() debug: boolean = false;
  @Prop() numberOfFruits = 8;
  @Prop() ratios: FoliageRatio = DEFAULT_FOLIAGE_RATIOS;
  @Prop() image = '../../assets/images/tree.png';
  @Element() el!: HTMLElement;

  @State() fruits: Array<{
    style: { [key: string]: string | undefined; };
    type: number;
    flavor: number;
    top: string;
    left: string;
  }> = [];
  stems: StemPoint[] = [];
  foliageStyle: Record<string, string> = {};

  connectedCallback() {
    this.el.style.setProperty('--tree-url', `url("${this.image}")`);
    this.el.style.setProperty('--tree-filter', this.filter);
    this.generateFruitsOnTreeElement();
  }

  /**
   *  Check if point is inside the ellipsis in a cartesian  plan
   *  https://math.stackexchange.com/questions/76457/check-if-a-point-is-within-an-ellipse/76463#76463?newreg=db8df23ed12542d4bbe628b7876bbb3e
   *
   * @param {number} x - x coordinate of the point being evaluated
   * @param {number} y -  y coordinate of the point being evaluated
   * @param {number} ex - x coordinate of the ellipsis
   * @param {number} ey - y coordinate of the ellipsis
   * @param {number} rx - semi-major axis of the ellipsis (horizontal)
   * @param {number} ry - semi-minor axis of the ellipsis (vertical)
   */
  isInsideEllipsis(x: number, y: number, ex: number, ey: number, rx: number, ry: number) {

    /** Quick elimination , reject points outside bounding rectangle **/
    if (Math.abs(x - ex) > rx || Math.abs(y - ey) > rx) {
      return false;
    }

    return (((x - ex) * ry) ** 2) + (((y - ey) * rx) ** 2) <= ((rx * ry) ** 2);
  }

  /**
   * Generate a good enough approximation of an array of possible fruit stem positions in an elliptic foliage.
   * We suppose that the stem is at the top center of the bounding rectangle of the fruit
   * We also suppose the fruit is approximated to a circle
   *
   * @param {number} a - width of bounding rectangle - major axis of the ellipsis
   * @param {number} b - height of  bounding rectangle - minor axis of the ellipsis
   * @param {number} fd - fruit diameter
   * @param {number} ex - x coordinate of the ellipsis
   * @param {number} ey - y coordinate of the ellipsis
   */
  @memo()
  generateStemPointsInsideEllipticFoliage(a: number, b: number, fd: number, ex: number, ey: number) {
    /**
     * @const {number} maxI -  max number of fruits in a row
     */
    const maxI = Math.ceil(a / fd);
    /**
     * @const  {number} maxJ - max number of fruits  in a column
     */
    const maxJ = Math.ceil(b / fd);

    const points: { x: number; y: number }[] = [];

    for (let i = 0; i < maxI; i++) {
      for (let j = 0; j < maxJ; j++) {

        const x = fd / 2 + i * fd;
        const y = j * fd;

        if (this.isInsideEllipsis(x, y, ex, ey, a / 2, b / 2)) {
          points.push({
            x,
            y,
          });
        }
      }
    }

    return points;
  }

  /**
   * Randomly try to blossom **n** fruits from already  generated stem array
   */
  getRandomFruitsOnTree(): StemPoint[] {

    const points = [];
    const positions = this.stems.map(s => {
      return { ...s, inseminated: false };
    });

    for (let i = 0; i < Math.min(this.numberOfFruits, this.stems.length) - 1; i++) {
      let found = false;
      while (!found) {
        const i = getRandomInt(0, this.stems.length - 1);
        const selected = positions[i];
        if (!selected.inseminated) {
          positions[i].inseminated = true;
          found = true;
          points.push({
            x: positions[i].x * this.scale,
            y: positions[i].y * this.scale,
          });
        }
      }
    }

    return points;
  }

  componentDidRender() {
    this.el.shadowRoot?.querySelectorAll('.fruit-bubble').forEach(value => {
      animateCSS(value as HTMLElement, ['swing']).catch(e => {
        console.warn(e);
      });
    });

  }

  @Watch('fruit')
  @Watch('fruitSize')
  @Watch('scale')
  @Watch('debug')
  @Watch('numberOfFruits')
  @Watch('ratios')
  @Watch('image')
  generateFruitsOnTreeElement() {
    const tree: HTMLElement = this.el.shadowRoot?.host as HTMLElement;
    const { width: w, height: h } = tree.getBoundingClientRect();

    const width = w * this.ratios.width * this.scale;
    const height = h * this.ratios.height * this.scale;

    this.foliageStyle.position = 'absolute';
    this.foliageStyle.zIndex = '1';
    this.foliageStyle.top = `${(w * this.ratios.top)}px`;
    this.foliageStyle.left = `${(h * this.ratios.left)}px`;
    this.foliageStyle.width = `${width}px`;
    this.foliageStyle.height = `${height}px`;

    if (this.debug) {
      this.foliageStyle.backgroundColor = 'rgba(255,0,0,0.6)';
    }

    //https://stackoverflow.com/a/59882642/1427338
    const hue = tree.style.filter.match(/hue-rotate\((\d+)([^)]+)\)/);

    if (hue) {
      const [num, unit] = hue.slice(1);
      this.foliageStyle.filter += `hue-rotate(${-num}${unit})`;
    }
    const rotateY = tree.style.transform.match(/rotateY\((\d+)([^)]+)\)/);
    if (rotateY) {
      const [num, unit] = rotateY.slice(1);  // slice is needed since first element contains entire match
      this.foliageStyle.transform += ` rotateY(${num}${unit})`;
    }
    const rotateZ = tree.style.transform.match(/rotateZ\((\d+)([^)]+)\)/);
    if (rotateZ) {
      const [num, unit] = rotateZ.slice(1);  // slice is needed since first element contains entire match
      this.foliageStyle.transform += ` rotateZ(${num}${unit})`;
    }
    this.stems = this.generateStemPointsInsideEllipticFoliage(width, height, this.fruitSize, width / 2, height / 2);
    this.fruits = this.getRandomFruitsOnTree().map((value, _index) => {
      return {
        type: this.fruit,
        flavor: getRandomInt(0, 1),
        top: `${value.y}px`,
        left: `${value.x}px`,
        style: {
          transform: 'scale(1.8)',
        },
      };
    });

  }

  render() {

    return (
      <Host>
        <div id='foliage' style={this.foliageStyle}>
          {
            this.fruits.map((v, _i) => {
              return <div class='absolute animate__animated animate__swing fruit-bubble'
                          style={{
                            top: v.top,
                            left: v.left,
                            // animationDelay: getRandomArbitrary(0, 1) + 's',
                            animationDuration: getRandomArbitrary(.8, 1.4) + 's',
                          }}>
                <fruit-item crystal={true} {...v}></fruit-item>
              </div>;
            })
          }
        </div>
      </Host>
    );
  }

}
