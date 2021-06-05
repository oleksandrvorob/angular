import { Directive, ElementRef, forwardRef, HostListener, Renderer2 } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

const ONLY_NUMBER_CONTROL_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => OnlyNumberDirective),
    multi: true
};

@Directive({
    selector: '[onlyNumber]',
    providers: [ONLY_NUMBER_CONTROL_VALUE_ACCESSOR]
})
export class OnlyNumberDirective implements ControlValueAccessor {
    private onChange: (val: string) => void;
    private onTouched: () => void;


    constructor(
        private elementRef: ElementRef,
        private renderer: Renderer2
    ) {
    }

    @HostListener('input')
    onInputChange() {
        this.updateTextInput(this.elementRef.nativeElement.value);
    }

    @HostListener('blur')
    onBlur() {
        this.onTouched();
    }


    private updateTextInput(value) {
        if(value!==null && value!==''){
            const filteredValue = value.toString().replace(/[^0-9]*/g, '');
            this.renderer.setProperty(this.elementRef.nativeElement, 'value', filteredValue);
            this.onChange(filteredValue);
        }        
    }

    // ControlValueAccessor Interface
    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.renderer.setProperty(this.elementRef.nativeElement, 'disabled', isDisabled);
    }

    writeValue(value: string): void {
        if (value) {
            this.updateTextInput(value);
        }
    }
}
