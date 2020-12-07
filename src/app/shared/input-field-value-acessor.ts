import { Provider, forwardRef, Type } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { BaseInput } from './base-input';

export function INPUT_FIELD_VALUE_ACCESSOR<T extends BaseInput>(type:Type<T>):Provider {
    return {
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => type),
        multi:true
    }
}