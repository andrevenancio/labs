!function(t){var e={};function i(n){if(e[n])return e[n].exports;var s=e[n]={i:n,l:!1,exports:{}};return t[n].call(s.exports,s,s.exports,i),s.l=!0,s.exports}i.m=t,i.c=e,i.d=function(t,e,n){i.o(t,e)||Object.defineProperty(t,e,{configurable:!1,enumerable:!0,get:n})},i.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return i.d(e,"a",e),e},i.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},i.p="",i(i.s=19)}([function(t,e){var i;i=function(){return this}();try{i=i||Function("return this")()||(0,eval)("this")}catch(t){"object"==typeof window&&(i=window)}t.exports=i},,function(t,e,i){"use strict";(function(t){Object.defineProperty(e,"__esModule",{value:!0});var n=function(){function t(t,e){for(var i=0;i<e.length;i++){var n=e[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(e,i,n){return i&&t(e.prototype,i),n&&t(e,n),e}}(),s=i(3);var r=function(){function e(){var i=this;!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,e),this.handleResize=function(){i.resize()},this.handleUpdate=function(){i.update(),requestAnimationFrame(i.handleUpdate)};var n=t.devicePixelRatio;this.width=t.innerWidth*n,this.height=t.innerHeight*n,t.addEventListener("resize",this.handleResize,!1),this.setup(),this.debug(),this.init(),this.handleResize(),this.handleUpdate(),"false"===(0,s.getUrlParam)("controls")&&(document.body.className="hide")}return n(e,[{key:"setup",value:function(){}},{key:"debug",value:function(){}},{key:"init",value:function(){}},{key:"resize",value:function(){}},{key:"update",value:function(){}}]),e}();e.default=r}).call(e,i(0))},function(t,e,i){"use strict";(function(t){Object.defineProperty(e,"__esModule",{value:!0});e.getUrlParam=function(e){return new t.URL(t.location.href).searchParams.get(e)}}).call(e,i(0))},,,,,,,function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.Point=e.Rectangle=void 0;var n=function(){function t(t,e){for(var i=0;i<e.length;i++){var n=e[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(e,i,n){return i&&t(e.prototype,i),n&&t(e,n),e}}(),s=o(i(11)),r=o(i(12));function o(t){return t&&t.__esModule?t:{default:t}}var a=function(){function t(e){var i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:4;!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),this.boundary=e,this.n=i,this.points=[],this.divided=!1}return n(t,[{key:"insert",value:function(t){this.boundary.constains(t)&&(this.points.length<this.n?this.points.push(t):(this.divided||this.subdivide(),this.nw.insert(t),this.ne.insert(t),this.sw.insert(t),this.se.insert(t)))}},{key:"subdivide",value:function(){var e=this.boundary,i=e.x,n=e.y,r=e.width,o=e.height,a=new s.default(i,n,r/2,o/2),h=new s.default(i+r/2,n,r/2,o/2),u=new s.default(i,n+o/2,r/2,o/2),c=new s.default(i+r/2,n+o/2,r/2,o/2);this.nw=new t(a,this.n),this.ne=new t(h,this.n),this.sw=new t(u,this.n),this.se=new t(c,this.n),this.divided=!0}},{key:"query",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:[];if(this.boundary.intersects(t)){var i=!0,n=!1,s=void 0;try{for(var r,o=this.points[Symbol.iterator]();!(i=(r=o.next()).done);i=!0){var a=r.value;t.constains(a)&&e.push(a)}}catch(t){n=!0,s=t}finally{try{!i&&o.return&&o.return()}finally{if(n)throw s}}this.divided&&(this.nw.query(t,e),this.ne.query(t,e),this.sw.query(t,e),this.se.query(t,e))}return e}},{key:"debug",value:function(t){var e=this.boundary,i=e.x,n=e.y,s=e.width,r=e.height;t.beginPath(),t.strokeStyle="#666",t.lineWidth=1,t.rect(i,n,s,r),t.stroke(),t.closePath();for(var o=0;o<this.points.length;o++)t.beginPath(),t.fillStyle="#f00",t.arc(this.points[o].x,this.points[o].y,2,0,2*Math.PI),t.fill(),t.closePath();this.divided&&(this.nw.debug(t),this.ne.debug(t),this.sw.debug(t),this.se.debug(t))}},{key:"borders",value:function(t){var e=this.boundary,i=e.x,n=e.y,s=e.width,r=e.height;t.beginPath(),t.strokeStyle="#222",t.lineWidth=1,t.rect(i,n,s,r),t.stroke(),t.closePath(),this.divided&&(this.nw.borders(t),this.ne.borders(t),this.sw.borders(t),this.se.borders(t))}}]),t}();e.default=a,e.Rectangle=s.default,e.Point=r.default},function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=function(){function t(t,e){for(var i=0;i<e.length;i++){var n=e[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(e,i,n){return i&&t(e.prototype,i),n&&t(e,n),e}}();var s=function(){function t(e,i,n,s){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),this.x=e,this.y=i,this.width=n,this.height=s}return n(t,[{key:"resize",value:function(t,e){this.width=t,this.height=e}},{key:"constains",value:function(t){return t.x>this.x&&t.x<this.x+this.width&&t.y>this.y&&t.y<this.y+this.height}},{key:"intersects",value:function(t){return!(t.x-t.width>this.x+this.width||t.x+t.width<this.x-this.width||t.y-t.height>this.y+this.height||t.y+t.height<this.y-this.height)}}]),t}();e.default=s},function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});e.default=function t(e,i){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{};!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),this.x=e||0,this.y=i||0,this.userData=n}},function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});e.mod=function(t,e){return(t%e+e)%e},e.random=function(t,e){return Math.random()*(e-t)+t}},,,,,,function(t,e,i){"use strict";(function(t){var e=function(){function t(t,e){for(var i=0;i<e.length;i++){var n=e[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(e,i,n){return i&&t(e.prototype,i),n&&t(e,n),e}}(),n=a(i(2)),s=i(10),r=a(s),o=i(13);function a(t){return t&&t.__esModule?t:{default:t}}var h=void 0,u=void 0;new(function(i){function a(){return function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,a),function(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!=typeof e&&"function"!=typeof e?t:e}(this,(a.__proto__||Object.getPrototypeOf(a)).apply(this,arguments))}return function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}(a,n.default),e(a,[{key:"setup",value:function(){this.canvas=document.createElement("canvas"),document.body.appendChild(this.canvas),this.context=this.canvas.getContext("2d")}},{key:"debug",value:function(){this.settings={particles:100,distance:300}}},{key:"init",value:function(){this.particles=[];for(var t=0;t<this.settings.particles;t++){var e=Math.random()*this.width,i=Math.random()*this.height,n=(0,o.random)(-5,5),s=(0,o.random)(-5,5);this.particles.push({x:e,y:i,vx:n,vy:s})}}},{key:"resize",value:function(){var e=t.devicePixelRatio;this.width=t.innerWidth*e,this.height=t.innerHeight*e,this.canvas.width=this.width,this.canvas.height=this.height,this.canvas.style.width=this.width/e+"px",this.canvas.style.height=this.height/e+"px";var i=Math.max(this.width,this.height);this.boundary=new s.Rectangle(0,0,i,i)}},{key:"update",value:function(){this.context.clearRect(0,0,this.width,this.height);for(var t=0;t<this.particles.length;t++){var e=this.particles[t];e.x>this.width?e.vx=-5:e.x<0?e.vx=5:e.vx*=1,e.y>=this.height?e.vy=-5:e.y<=0?e.vy=5:e.vy*=1,e.x+=e.vx,e.y+=e.vy,this.context.beginPath(),this.context.fillStyle="#fff",this.context.arc(e.x,e.y,2,0,2*Math.PI),this.context.fill(),this.context.closePath()}h=new r.default(this.boundary,4);for(var i=0;i<this.particles.length;i++)u=new s.Point(this.particles[i].x,this.particles[i].y),h.insert(u);h.borders(this.context);for(var n=0;n<this.particles.length-1;n++)for(var o=this.settings.distance,a=this.settings.distance,c=this.particles[n].x-o/2,l=this.particles[n].y-a/2,f=new s.Rectangle(c,l,o,a),d=h.query(f),y=0;y<d.length;y++)this.connect(this.particles[n],d[y])}},{key:"connect",value:function(t,e){var i=e.x-t.x,n=e.y-t.y,s=Math.sqrt(i*i+n*n);if(s<this.settings.distance){this.context.beginPath(),this.context.strokeStyle="#999",this.context.lineWidth=s/this.settings.distance,this.context.moveTo(t.x,t.y),this.context.lineTo(e.x,e.y),this.context.stroke(),this.context.closePath();var r=1e-4*i,o=1e-4*n;t.vx+=r,t.vy+=o,e.vx-=r,e.vy-=o}}}]),a}())}).call(e,i(0))}]);