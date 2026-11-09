import '../index.css';
import {numToPx, calculateNewSize} from '../utils';
import {YMapResizerVuefyOptions} from './vue';
import {YMapResizerControl} from './YMapResizerControl';

export type YMapResizerDirection = 'both' | 'horizontal' | 'vertical';
export type YMapResizerProps = {
    direction?: YMapResizerDirection;
    minWidth?: number;
    maxWidth?: number;
    minHeight?: number;
    maxHeight?: number;
    showOnlyOnHover?: boolean;
};

const defaultProps = Object.freeze({direction: 'both', showOnlyOnHover: false});
type DefaultProps = typeof defaultProps;

export class YMapResizer extends ymaps3.YMapComplexEntity<YMapResizerProps, DefaultProps> {
    static defaultProps = defaultProps;
    static [ymaps3.optionsKeyVuefy] = YMapResizerVuefyOptions;
    private _isResizing: boolean = false;
    private _activeDirection: YMapResizerDirection | null = null;
    private _bottomControl: YMapResizerControl;
    private _rightControl: YMapResizerControl;
    private _bottomRightControl: YMapResizerControl;

    constructor(props: YMapResizerProps) {
        super(props);
    }

    private get _containerParent() {
        return this.root.container.parentElement;
    }

    private get _controlsList() {
        return [this._bottomControl, this._rightControl, this._bottomRightControl];
    }

    protected _onAttach() {
        const {showOnlyOnHover, direction} = this._props;
        this._setContainerRestrictions();
        this._containerParent.classList.add('ymaps3x0-resize', direction);

        const [verticalControl, horizontalControl, bothControl] = (
            ['vertical', 'horizontal', 'both'] as YMapResizerDirection[]
        ).map(
            (direction) =>
                new YMapResizerControl({
                    direction,
                    onMouseDown: (event) => this._onControlMouseDown(direction, event),
                    onMouseEnter: () => this._onControlMouseEnter(),
                    onMouseLeave: () => this._onControlMouseLeave(),
                    show: !showOnlyOnHover,
                    showArrow: false
                })
        );
        this._bottomControl = verticalControl;
        this._rightControl = horizontalControl;
        this._bottomRightControl = bothControl;

        // Add bottom control
        if (['both', 'vertical'].includes(direction)) {
            this.addChild(this._bottomControl);
        }
        // Add right control
        if (['both', 'horizontal'].includes(direction)) {
            this.addChild(this._rightControl);
        }
        // Add bottom-right control
        if (direction === 'both') {
            this.addChild(this._bottomRightControl);
        }
    }

    private _setContainerRestrictions() {
        this._containerParent.style.minWidth = numToPx(this._props.minWidth);
        this._containerParent.style.maxWidth = numToPx(this._props.maxWidth);
        this._containerParent.style.minHeight = numToPx(this._props.minHeight);
        this._containerParent.style.maxHeight = numToPx(this._props.maxHeight);
    }

    protected _onUpdate(props: Partial<YMapResizerProps>, oldProps: YMapResizerProps) {
        this._setContainerRestrictions();

        if (props.direction !== undefined) {
            this._containerParent.classList.replace(oldProps.direction, props.direction);
            // Add bottom control
            if (props.direction === 'vertical') {
                this.addChild(this._bottomControl);
                this.removeChild(this._rightControl);
                this.removeChild(this._bottomRightControl);
            }
            // Add right control
            if (props.direction === 'horizontal') {
                this.addChild(this._rightControl);
                this.removeChild(this._bottomControl);
                this.removeChild(this._bottomRightControl);
            }
            // Add bottom-right control
            if (props.direction === 'both') {
                this.addChild(this._bottomControl);
                this.addChild(this._rightControl);
                this.addChild(this._bottomRightControl);
            }
        }

        if (props.showOnlyOnHover !== undefined) {
            this._controlsList.forEach((control) => control.update({show: !props.showOnlyOnHover}));
        }
    }

    protected _onDetach(): void {
        this._controlsList.forEach((control) => this.removeChild(control));
    }

    private _onControlMouseEnter() {
        // show all controls
        if (this._props.showOnlyOnHover) {
            const show = true;
            this._controlsList.forEach((control) => control.update({show}));
        }
    }

    private _onControlMouseLeave() {
        // hide all controls
        if (this._props.showOnlyOnHover && !this._isResizing) {
            const show = false;
            this._controlsList.forEach((control) => control.update({show}));
        }
    }

    private _onControlMouseDown(direction: YMapResizerDirection, event: MouseEvent) {
        // start resize
        this._containerParent.classList.add('active');

        this._isResizing = true;
        this._activeDirection = direction;
        // Prevent text selection
        event.preventDefault();
        window.addEventListener('mousemove', this._resize);
        window.addEventListener('mouseup', this._stopResize);
    }

    private _resize = (event: MouseEvent) => {
        const rect = this._containerParent.getBoundingClientRect();
        const newSize = calculateNewSize(event, rect);

        if (this._activeDirection === 'vertical') {
            this._bottomControl.update({showArrow: true});
            this._containerParent.style.height = numToPx(newSize.height);
        } else if (this._activeDirection === 'horizontal') {
            this._rightControl.update({showArrow: true});
            this._containerParent.style.width = numToPx(newSize.width);
        } else if (this._activeDirection === 'both') {
            this._bottomRightControl.update({showArrow: true});
            this._containerParent.style.width = numToPx(newSize.width);
            this._containerParent.style.height = numToPx(newSize.height);
        }
    };

    private _stopResize = () => {
        this._containerParent.classList.remove('active');

        const showArrow = false;
        this._controlsList.forEach((control) => control.update({showArrow}));

        this._isResizing = false;
        this._activeDirection = null;

        if (this._props.showOnlyOnHover) {
            const show = false;
            this._controlsList.forEach((control) => control.update({show}));
        }

        window.removeEventListener('mousemove', this._resize);
        window.removeEventListener('mouseup', this._stopResize);
    };
}
