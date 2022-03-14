import {ExcelComponent} from '@core/ExcelComponent';
import {createTable} from './table.template';
import {resizeHandler} from './table.resize';
import {shouldResize} from './table.functions';

export class Table extends ExcelComponent {
    static className = 'excel__table'

    constructor($root) {
        super($root, {
            listeners: ['mousedown', 'mousemove', 'mouseup'],
        })
    }

    toHTML() {
        return createTable(20)
    }

    onMousedown(event) {
        if (shouldResize(event)) {
            return resizeHandler(this.$root, event)
        }
    }

    onMousemove() {
        // console.log('mousemove')
    }

    onMouseup() {
        // console.log('mouseup')
    }
}
