import { Directive, ElementRef } from "@angular/core";

@Directive({
  selector: "[appResize]"
})
export class ResizeDirective {
  private textArea;
  private parentNode;
  private dragging = false;
  constructor(private el: ElementRef) {
    const resizeSupported = el.nativeElement.style.resize !== undefined;
    if (resizeSupported) {
      return;
    }
    this.textArea = el.nativeElement;
    this.parentNode = this.textArea.parentElement;
    this.parentNode.classList.add("resizableContainer");
    const self = this;
    const EventListenerMode = { capture: true };
    let original_width = 0;
    let original_height = 0;
    let original_x = 0;
    let original_y = 0;
    let original_mouse_x = 0;
    let original_mouse_y = 0;
    function preventGlobalMouseEvents() {
      document.body.style["pointer-events"] = "none";
    }

    function restoreGlobalMouseEvents() {
      document.body.style["pointer-events"] = "auto";
    }

    const newWidth = wid => {
      this.textArea.style.width = wid + "px";
    };
    const newHeight = hei => {
      this.textArea.style.height = hei + "px";
    };

    const mouseMoveG = evt => {
      if (!this.dragging) {
        return;
      }
      if (evt.pageX !== original_mouse_x) {
        newWidth(evt.clientX - this.textArea.offsetLeft);
      }
      if (evt.pageY !== original_mouse_y) {
        newHeight(
          evt.clientY - (this.textArea.offsetTop + this.textArea.offsetHeight)
        );
      }
      //console.log(this.textArea.offsetTop);
      evt.stopPropagation();
    };

    const mouseUpG = evt => {
      if (!this.dragging) {
        return;
      }
      restoreGlobalMouseEvents();
      this.dragging = false;
      original_width = parseFloat(
        getComputedStyle(this.textArea, null)
          .getPropertyValue("width")
          .replace("px", "")
      );
      original_height = parseFloat(
        getComputedStyle(this.textArea, null)
          .getPropertyValue("height")
          .replace("px", "")
      );
      original_x = this.textArea.getBoundingClientRect().left;
      original_y = this.textArea.getBoundingClientRect().top;
      original_mouse_x = evt.pageX;
      original_mouse_y = evt.pageY;
      evt.stopPropagation();
    };

    const mouseDown = evt => {
      if (this.inDragRegion(evt)) {
        this.dragging = true;
        original_width = parseFloat(
          getComputedStyle(this.textArea, null)
            .getPropertyValue("width")
            .replace("px", "")
        );
        original_height = parseFloat(
          getComputedStyle(this.textArea, null)
            .getPropertyValue("height")
            .replace("px", "")
        );
        original_x = this.textArea.getBoundingClientRect().left;
        original_y = this.textArea.getBoundingClientRect().top;
        original_mouse_x = evt.pageX;
        original_mouse_y = evt.pageY;
        preventGlobalMouseEvents();
        evt.stopPropagation();
      }
    };

    const mouseMove = evt => {
      //if (this.inDragRegion(evt) || this.dragging) {
      //el.nativeElement.style.cursor = "col-resize";
      //} else {
      //  el.nativeElement.style.cursor = "default";
      //}
    };

    document.addEventListener("mousemove", mouseMoveG, true);
    document.addEventListener("mouseup", mouseUpG, true);
    this.parentNode.addEventListener("mousedown", mouseDown, true);
    this.parentNode.addEventListener("mousemove", mouseMove, true);
  }

  inDragRegion(evt) {
    return (
      this.el.nativeElement.clientWidth -
        evt.clientX +
        this.el.nativeElement.offsetLeft <
      1
    );
  }
}
