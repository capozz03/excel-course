import {ExcelComponent} from '@core/ExcelComponent';
import {createTable} from './table.template';
import {resizeHandler} from './table.resize';
import {isCell, matrix, shouldResize} from './table.functions';
import {TableSelection} from './TableSelection';
import {$} from '../../core/dom';
import {nextSelector} from '../../core/utils';
export class Table extends ExcelComponent {
    static className = 'excel__table'

    constructor($root, options) {
        super($root, {
            name: 'Table',
            listeners: [
                'mousedown',
                'mousemove',
                'mouseup',
                'keydown',
                'input',
            ],
            ...options,
        })
    }

    toHTML() {
        return createTable(20)
    }

    prepare() {
        this.selection = new TableSelection();
    }

    init() {
        super.init()
        const $cell = this.$root.find('[data-id="0:2"]')
        this.selectCell($cell)

        this.$on('formula:input', (text) => {
            this.selection.current.text(text)
        })

        this.$on('formula:done', () => {
            this.selection.current.focus()
        })
    }

    selectCell($cell) {
        this.selection.select($cell)
        this.$emit('table:select', $cell)
    }

    onMousedown(event) {
        if (shouldResize(event)) {
            return resizeHandler(this.$root, event)
        } else if (isCell(event)) {
            const $target = $(event.target);
            if (event.ctrlKey) {
                this.selection.selectCtrl($target);
            } else if (event.shiftKey) {
                const $cells = matrix($target, this.selection.current)
                    .map((id) =>
                        this.$root.find(`[data-id="${id}"`))
                this.selection.selectGroup($cells);
            } else {
                this.selection.select($target);
            }
        }
    }

    onMousemove() {

    }

    onMouseup() {

    }

    onKeydown(event) {
        const keys = [
            'Enter',
            'Tab',
            'ArrowUp',
            'ArrowDown',
            'ArrowLeft',
            'ArrowRight',
        ];
        const {key} = event;
        if (keys.includes(key) && !event.shiftKey) {
            event.preventDefault();
            const id = this.selection.current.id(true);
            const $next = this.$root.find(nextSelector(key, id));
            this.selectCell($next)
        }
    }

    onInput(event) {
        this.$emit('table:input', $(event.target))
    }

    destroy() {
        super.destroy()
        this.unsubs.forEach((unsub) => unsub())
    }
}
