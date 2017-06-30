import { Component, ElementRef} from '@angular/core';
import $ from "jquery";
import 'slick-carousel';


@Component({
  selector: 'slick-carousel',
  template: `<ng-content></ng-content>`
})
export class SlickCarouselComponent {
  constructor(private el: ElementRef) {
  }

  $carousel: any;

  ngAfterViewInit() {
    this.$carousel = $(this.el.nativeElement).slick({
        autoplay: false,
        // infinite: true,
        slidesToShow: 4,
        slidesToScroll: 1,
        // variableWidth: true,
        dots: true,
        centerMode: true
    });
  }
}