import {
  formatNumberForInput,
  formatTypedNumber,
  parseNumberInput
} from '@ghostfolio/common/number-input.helper';

import { Directive, ElementRef, forwardRef, inject } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

/**
 * Number input in Vietnamese format: dots group the thousands while the user
 * types (1.000.000) and the comma is the decimal separator. The bound model
 * value is a plain number (or null when the field is empty or invalid).
 */
@Directive({
  host: {
    '(blur)': 'onTouched?.()',
    '(input)': 'handleInput()',
    inputmode: 'decimal',
    type: 'text'
  },
  providers: [
    {
      multi: true,
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GfNumberInputDirective)
    }
  ],
  selector: 'input[gfNumberInput]'
})
export class GfNumberInputDirective implements ControlValueAccessor {
  private readonly elementRef =
    inject<ElementRef<HTMLInputElement>>(ElementRef);

  private onChange: ((value: number | null) => void) | undefined;

  protected onTouched: (() => void) | undefined;

  public registerOnChange(fn: (value: number | null) => void) {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void) {
    this.onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean) {
    this.elementRef.nativeElement.disabled = isDisabled;
  }

  public writeValue(value: number | string | null | undefined) {
    const numeric =
      typeof value === 'string' ? parseNumberInput(value) : (value ?? null);

    this.elementRef.nativeElement.value = formatNumberForInput(numeric);
  }

  protected handleInput() {
    const element = this.elementRef.nativeElement;
    const caret = element.selectionStart ?? element.value.length;
    const significantBefore = this.countSignificant(
      element.value.slice(0, caret)
    );
    const formatted = formatTypedNumber(element.value);

    if (formatted !== element.value) {
      element.value = formatted;
      this.restoreCaret(element, formatted, significantBefore);
    }

    this.onChange?.(parseNumberInput(formatted));
  }

  /** Digits and the decimal comma: what stays stable when dots are re-grouped. */
  private countSignificant(text: string) {
    return (text.match(/[\d,]/g) ?? []).length;
  }

  private restoreCaret(
    element: HTMLInputElement,
    text: string,
    significantBefore: number
  ) {
    let position = 0;
    let seen = 0;

    while (position < text.length && seen < significantBefore) {
      if (/[\d,]/.test(text[position])) {
        seen++;
      }

      position++;
    }

    element.setSelectionRange(position, position);
  }
}
