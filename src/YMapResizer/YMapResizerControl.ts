import {YMapResizerDirection} from './YMapResizer';

export type YMapResizerControlProps = {
    direction: YMapResizerDirection;
    show: boolean;
    showArrow: boolean;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
    onMouseDown: (event: MouseEvent) => void;
};

type Cursors = 'ns-resize' | 'ew-resize' | 'nwse-resize';

const CURSORS: Record<YMapResizerDirection, Cursors> = {
    horizontal: 'ew-resize',
    vertical: 'ns-resize',
    both: 'nwse-resize'
};

export class YMapResizerControl extends ymaps3.YMapComplexEntity<YMapResizerControlProps> {
    private _controlElement: HTMLElement;
    private _arrowElements: HTMLElement[];

    protected _onAttach(): void {
        this._controlElement = this._createControl();

        this._controlElement.addEventListener('mousedown', this._onMouseDown);
        this._controlElement.addEventListener('mouseenter', this._onMouseEnter);
        this._controlElement.addEventListener('mouseleave', this._onMouseLeave);

        this._updateControlOpacity();
        this._updateArrowsOpacity();

        this.root.container.appendChild(this._controlElement);
    }

    protected _onUpdate(props: Partial<YMapResizerControlProps>): void {
        if (props.direction !== undefined) {
            throw new Error("Can't change the direction for the control. You must create a new element.");
        }

        if (props.show !== undefined) {
            this._updateControlOpacity();
        }

        if (props.showArrow !== undefined) {
            this._updateArrowsOpacity();
        }
    }

    protected _onDetach(): void {
        this._controlElement.removeEventListener('mousedown', this._onMouseDown);
        this._controlElement.removeEventListener('mouseenter', this._onMouseEnter);
        this._controlElement.removeEventListener('mouseleave', this._onMouseLeave);

        this.root.container.removeChild(this._controlElement);
    }

    private _updateControlOpacity() {
        this._controlElement.style.opacity = this._props.show ? '1' : '0';
    }
    private _updateArrowsOpacity() {
        this._arrowElements.forEach((arrowEl) => {
            arrowEl.style.opacity = this._props.showArrow ? '1' : '0';
        });
    }

    private _onMouseEnter = () => {
        this._props.onMouseEnter();
    };
    private _onMouseLeave = () => {
        this._props.onMouseLeave();
    };
    private _onMouseDown = (event: MouseEvent) => {
        this._props.onMouseDown(event);
    };

    private _createControl(): HTMLElement {
        const control = document.createElement('div');
        control.style.cursor = CURSORS[this._props.direction];
        control.classList.add('ymaps3x0-resize-control', this._props.direction);

        switch (this._props.direction) {
            case 'horizontal':
                const rightArrow = this._createArrow(this._props.direction, 'right');
                const leftArrow = this._createArrow(this._props.direction, 'left');
                this._arrowElements = [rightArrow, leftArrow];
                control.appendChild(rightArrow);
                control.appendChild(leftArrow);
                return control;
            case 'vertical':
                const bottomArrow = this._createArrow(this._props.direction, 'bottom');
                const topArrow = this._createArrow(this._props.direction, 'top');
                this._arrowElements = [bottomArrow, topArrow];
                control.appendChild(bottomArrow);
                control.appendChild(topArrow);
                return control;
            case 'both':
                const nwArrow = this._createArrow(this._props.direction, 'nw');
                const seArrow = this._createArrow(this._props.direction, 'se');
                this._arrowElements = [nwArrow, seArrow];
                control.appendChild(nwArrow);
                control.appendChild(seArrow);
                return control;
        }
    }

    private _createArrow(...classList: string[]) {
        const arrowElement = document.createElement('div');
        arrowElement.classList.add('ymaps3x0-resize-arrow', ...classList);
        return arrowElement;
    }
}
