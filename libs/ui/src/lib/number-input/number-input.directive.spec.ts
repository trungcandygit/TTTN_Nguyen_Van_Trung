import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { GfNumberInputDirective } from './number-input.directive';

@Component({
  imports: [GfNumberInputDirective, ReactiveFormsModule],
  template: `<input gfNumberInput [formControl]="control" />`
})
class HostComponent {
  public control = new FormControl<number | null>(null);
}

describe('GfNumberInputDirective', () => {
  let fixture: ComponentFixture<HostComponent>;
  let input: HTMLInputElement;
  let host: HostComponent;

  const type = (text: string) => {
    input.value = text;
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
  };

  beforeEach(() => {
    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
    input = fixture.debugElement.query(By.css('input')).nativeElement;
  });

  it('shows the model value with dot thousands separators', () => {
    host.control.setValue(1234567.5);
    fixture.detectChanges();

    expect(input.value).toBe('1.234.567,5');
  });

  it('groups digits with dots while typing and updates the model', () => {
    type('1000000');

    expect(input.value).toBe('1.000.000');
    expect(host.control.value).toBe(1000000);
  });

  it('accepts a decimal comma', () => {
    type('1234,56');

    expect(input.value).toBe('1.234,56');
    expect(host.control.value).toBeCloseTo(1234.56);
  });

  it('sets the model to null when the field is emptied', () => {
    type('5');
    type('');

    expect(host.control.value).toBeNull();
  });

  it('clears the text when the model is reset', () => {
    type('99');
    host.control.setValue(null);
    fixture.detectChanges();

    expect(input.value).toBe('');
  });

  it('marks the control as touched on blur', () => {
    input.dispatchEvent(new Event('blur'));

    expect(host.control.touched).toBe(true);
  });

  it('disables the field with the control', () => {
    host.control.disable();
    fixture.detectChanges();

    expect(input.disabled).toBe(true);
  });
});
