(()=>{"use strict";var t=document.querySelector(".image"),e=document.querySelector(".cursor"),n=document.querySelector(".button-clear"),o=document.querySelector(".button_type_redo"),i=document.querySelector(".button_type_undo"),c=document.querySelector(".button_type_save"),u=document.querySelectorAll(".input-box"),r=document.querySelector(".input-color"),a=document.querySelector(".input-range_type_opasity"),l=document.querySelector(".input-range_type_weight"),s=document.querySelector(".input-box__option_type_color"),d=document.querySelector(".input-box__option_type_opasity"),f=document.querySelector(".input-box__option_type_weight"),p=document.querySelector(".button_type_eraser"),v=document.querySelector(".button_type_brash"),h=document.querySelectorAll(".button_tool"),b=document.querySelector(".canvas"),g=b.getContext("2d"),_=!1,y=[],m=[],x=0,E=0,L="brash",S=10,q=100,w="#55AFE2",A="rgba(85,175,226, ".concat(q,")"),k=0,C="#ffffff";s.textContent=w,d.textContent=q+" %",f.textContent=S+" px",b.style.background=C,r.setAttribute("value",w),a.setAttribute("value",q),l.setAttribute("value",S);var I=function(){return window.innerHeight-2*t.offsetTop},R=function(){return t.offsetWidth};function T(){b.setAttribute("width",R()),b.setAttribute("height",I()),P()}function W(t,e,n,o){g.lineWidth=n,g.lineCap="round",g.strokeStyle=o,g.lineTo(t,e),g.stroke(),g.beginPath(),g.moveTo(t,e),g.beginPath()}function H(t){var e=function(t){t=t.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i,(function(t,e,n){return t+t+e+e+n+n}));var e=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(t);return e?{r:parseInt(e[1],16),g:parseInt(e[2],16),b:parseInt(e[3],16)}:null}(t);A="rgba(".concat(null==e?void 0:e.r,", ").concat(null==e?void 0:e.g,", ").concat(null==e?void 0:e.b,", ").concat(q/100,")")}function P(){g.clearRect(0,0,R(),I()),y.slice(0,k).forEach((function(t){t.forEach((function(t){W(t.x,t.y,t.weight,t.color)}))}))}function X(){0===y.length?D(c,"button-save_active"):z(c,"button-save_active")}function Y(){(y.length>0||y.length===k)&&z(i,"button-action_active"),0!==y.length&&0!==k||D(i,"button-action_active")}function $(){y.length>0&&k<y.length&&z(o,"button-action_active"),y.length===k&&D(o,"button-action_active")}function z(t,e){t.classList.add(e)}function D(t,e){t.classList.remove(e)}function F(t,e){L=e,function(t){h.forEach((function(e){e.classList.contains("button_active")&&D(e,"button_active"),z(t.currentTarget,"button_active")}))}(t),Y(),"eraser"===L?u.forEach((function(t){t.classList.contains("input-box_type_weight")||z(t,"input-box_hide")})):u.forEach((function(t){t.classList.contains("input-box_type_weight")||D(t,"input-box_hide")}))}T(),g.save(),g.globalCompositeOperation="destination-over",g.fillStyle=C,g.fillRect(0,0,b.width,b.height),g.restore(),window.addEventListener("resize",(function(){return T()})),b.addEventListener("mousedown",(function(){_=!0})),b.addEventListener("mouseup",(function(){_=!1,y.push(m),m=[],k=y.length,X(),Y()})),b.addEventListener("mousemove",(function(e){return function(e){if(_){y=y.slice(0,k),x=e.offsetX,E=e.offsetY;var n="brash"===L?A:C;W(x,E,S,n),m.push({x,y:E,weight:S,color:n}),(x+10>t.offsetWidth||x<=0||E+10>t.offsetHeight||E<10)&&(_=!1)}}(e)})),b.addEventListener("mousemove",(function(t){return function(t){e.setAttribute("style","\n    top: ".concat(t.offsetY-S/2,"px; \n    left: ").concat(t.offsetX-S/2,"px; \n    height: ").concat(S,"px;\n    width: ").concat(S,"px;\n    "))}(t)})),n.addEventListener("click",(function(){g.clearRect(0,0,R(),I()),y=[],m=[],$(),Y(),X()})),r.addEventListener("input",(function(t){return function(t){H(w=t.target.value),s.textContent=w}(t)})),a.addEventListener("input",(function(t){return function(t){q=t.target.value,H(w),d.textContent=q+"%"}(t)})),l.addEventListener("input",(function(t){return function(t){S=t.target.value,f.textContent=S+"px"}(t)})),o.addEventListener("click",(function(){k!==y.length&&(k+=1,P(),$(),Y())})),i.addEventListener("click",(function(){0!==k&&(k-=1,P(),Y(),$())})),c.addEventListener("click",(function(){0!==y.length&&function(t){var e=document.createElement("a");e.setAttribute("download","Image.png");var n=t.toDataURL("image/png").replace(/^data:image\/png/,"data:application/octet-stream");e.setAttribute("href",n),e.click()}(b)})),p.addEventListener("click",(function(t){return F(t,"eraser")})),v.addEventListener("click",(function(t){return F(t,"brash")}))})();