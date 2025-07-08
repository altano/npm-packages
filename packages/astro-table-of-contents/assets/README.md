# To record scrolling video

1. Make the viewport ~1606px tall
1. Start recording screen
1. In Chrome dev tools, open cmd palette and "emulate: prefers reduced motion"
1. Run the JS below

   ```js
   {
     /* 
       Effects List:
       - linearTween
       - easeInQuad, easeOutQuad, easeInOutQuad
       - easeInCuaic, easeOutCuaic, easeInOutCuaic
       - easeInQuart, easeOutQuart, easeInOutQuart
       - easeInQuint, easeOutQuint, easeInOutQuint
       - easeInSine, easeOutSine, easeInOutSine
       - easeInExpo, easeOutExpo, easeInOutExpo
       - easeInCirc, easeOutCirc , easeInOutCirc
     */

     const fast = 4269;
     const slow = 13000;
     var effect = easeInOutCuaic;

     steps = [];

     /* Functions to make scroll with speed control */

     // Element to move + duration in milliseconds
     function scrollTo(element, duration) {
       var e = document.documentElement;
       if (e.scrollTop === 0) {
         var t = e.scrollTop;
         ++e.scrollTop;
         e = t + 1 === e.scrollTop-- ? e : document.body;
       }
       scrollToC(e, e.scrollTop, element, duration);
     }

     // Element to move, element or px from, element or px to, time in ms to animate
     function scrollToC(element, from, to, duration) {
       if (duration <= 0) return;
       if (typeof from === "object") from = from.offsetTop;
       if (typeof to === "object") to = to.offsetTop;
       scrollToX(element, from, to, 0, 1 / duration, 20, effect);
     }

     function scrollToX(element, xFrom, xTo, t01, speed, step, motion) {
       if (t01 < 0 || t01 > 1 || speed <= 0) {
         element.scrollTop = xTo;
         console.table(steps);
         return;
       }
       steps.push({
         scrollTop_before: element.scrollTop,
         scrollTop_after: xFrom - (xFrom - xTo) * motion(t01),
         xFrom,
         xTo,
         t01_before: t01,
         t01_after: speed * step,
         "motion(t01)": motion(t01),
       });
       element.scrollTop = xFrom - (xFrom - xTo) * motion(t01);
       t01 += speed * step;

       setTimeout(function () {
         scrollToX(element, xFrom, xTo, t01, speed, step, motion);
       }, step);
     }

     /* Effects Functions */
     function linearTween(t) {
       return t;
     }

     function easeInQuad(t) {
       return t * t;
     }

     function easeOutQuad(t) {
       return -t * (t - 2);
     }

     function easeInOutQuad(t) {
       t /= 0.5;
       if (t < 1) return (t * t) / 2;
       t--;
       return (t * (t - 2) - 1) / 2;
     }

     function easeInCuaic(t) {
       return t * t * t;
     }

     function easeOutCuaic(t) {
       t--;
       return t * t * t + 1;
     }

     function easeInOutCuaic(t) {
       t /= 0.5;
       if (t < 1) return (t * t * t) / 2;
       t -= 2;
       return (t * t * t + 2) / 2;
     }

     function easeInQuart(t) {
       return t * t * t * t;
     }

     function easeOutQuart(t) {
       t--;
       return -(t * t * t * t - 1);
     }

     function easeInOutQuart(t) {
       t /= 0.5;
       if (t < 1) return 0.5 * t * t * t * t;
       t -= 2;
       return -(t * t * t * t - 2) / 2;
     }

     function easeInQuint(t) {
       return t * t * t * t * t;
     }

     function easeOutQuint(t) {
       t--;
       return t * t * t * t * t + 1;
     }

     function easeInOutQuint(t) {
       t /= 0.5;
       if (t < 1) return (t * t * t * t * t) / 2;
       t -= 2;
       return (t * t * t * t * t + 2) / 2;
     }

     function easeInSine(t) {
       return -Math.cos(t / (Math.PI / 2)) + 1;
     }

     function easeOutSine(t) {
       return Math.sin(t / (Math.PI / 2));
     }

     function easeInOutSine(t) {
       return -(Math.cos(Math.PI * t) - 1) / 2;
     }

     function easeInExpo(t) {
       return Math.pow(2, 10 * (t - 1));
     }

     function easeOutExpo(t) {
       return -Math.pow(2, -10 * t) + 1;
     }

     function easeInOutExpo(t) {
       t /= 0.5;
       if (t < 1) return Math.pow(2, 10 * (t - 1)) / 2;
       t--;
       return (-Math.pow(2, -10 * t) + 2) / 2;
     }

     function easeInCirc(t) {
       return -Math.sqrt(1 - t * t) - 1;
     }

     function easeOutCirc(t) {
       t--;
       return Math.sqrt(1 - t * t);
     }

     function easeInOutCirc(t) {
       t /= 0.5;
       if (t < 1) return -(Math.sqrt(1 - t * t) - 1) / 2;
       t -= 2;
       return (Math.sqrt(1 - t * t) + 1) / 2;
     }

     scrollToC(
       document.documentElement,
       0 /*from*/,
       document.documentElement.scrollHeight /*to*/,
       10_000 /*duration ms*/,
     );
   }
   ```

1. Stop recording, trim video to ~1s before motion and ~2s after

# To encode the video to avif

```sh
ffmpeg -i _INPUT_.mov -vf "scale=iw/_DOWNSCALE_FACTOR_:-1,setpts=_SPEEDUP_FACTOR_*PTS" -r 60 frame_%04d.png
avifenc --fps 60 frame_*.png _OUTPUT_.avif
```

e.g. to downscale 50% and speedup 4x:

```sh
cd XXXXXXXXXXXXX
ffmpeg -i smooth-scroll.mov  -vf "scale=iw/2:-1,setpts=0.25*PTS" -r 60 frame_%04d.png
avifenc --fps 60 frame_*.png output.avif
```
