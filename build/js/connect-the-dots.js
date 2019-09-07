!function(t){var e={};function i(n){if(e[n])return e[n].exports;var r=e[n]={i:n,l:!1,exports:{}};return t[n].call(r.exports,r,r.exports,i),r.l=!0,r.exports}i.m=t,i.c=e,i.d=function(t,e,n){i.o(t,e)||Object.defineProperty(t,e,{configurable:!1,enumerable:!0,get:n})},i.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return i.d(e,"a",e),e},i.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},i.p="",i(i.s=19)}([function(t,e){var i;i=function(){return this}();try{i=i||Function("return this")()||(0,eval)("this")}catch(t){"object"==typeof window&&(i=window)}t.exports=i},function(t,e,i){"use strict";(function(t){Object.defineProperty(e,"__esModule",{value:!0});var n=function(){function t(t,e){for(var i=0;i<e.length;i++){var n=e[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(e,i,n){return i&&t(e.prototype,i),n&&t(e,n),e}}(),r=i(2);var s=function(){function e(){var i=this;!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,e),this.handleResize=function(){i.captureMode||i.resize()},this.handleUpdate=function(){i.update(i.startTime),i.capturing&&(console.log("capture"),i.cc.capture(i.renderer.domElement)),requestAnimationFrame(i.handleUpdate)},this.ratio=t.devicePixelRatio,this.width=t.innerWidth*this.ratio,this.height=t.innerHeight*this.ratio,this.startTime=0,t.addEventListener("resize",this.handleResize,!1),this.capture(),this.setup(),this.debug(),this.init(),this.handleResize(),this.handleUpdate()}return n(e,[{key:"capture",value:function(){var e=this;this.captureMode="false"===(0,r.getUrlParam)("controls")&&"true"===(0,r.getUrlParam)("capture"),this.captureMode&&(document.body.className="hide",this.width=420,this.height=360,this.loopDuration=1,this.capturing=!1,this.cc=new CCapture({verbose:!1,display:!0,framerate:60,motionBlurFrames:16,quality:99,format:"gif",timeLimit:this.loopDuration,frameLimit:0,autoSaveTime:0,workersPath:"js/"}),setTimeout(function(){e.capturing=!0,e.cc.start(),e.startTime=t.performance.now()}))}},{key:"setup",value:function(){}},{key:"debug",value:function(){}},{key:"init",value:function(){}},{key:"resize",value:function(){}},{key:"update",value:function(){}}]),e}();e.default=s}).call(e,i(0))},function(t,e,i){"use strict";(function(t){Object.defineProperty(e,"__esModule",{value:!0});e.getUrlParam=function(e){return new t.URL(t.location.href).searchParams.get(e)}}).call(e,i(0))},,,,,,,function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.Point=e.Rectangle=void 0;var n=function(){function t(t,e){for(var i=0;i<e.length;i++){var n=e[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(e,i,n){return i&&t(e.prototype,i),n&&t(e,n),e}}(),r=a(i(10)),s=a(i(11));function a(t){return t&&t.__esModule?t:{default:t}}var o=function(){function t(e){var i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:4;!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),this.boundary=e,this.n=i,this.points=[],this.divided=!1}return n(t,[{key:"insert",value:function(t){this.boundary.constains(t)&&(this.points.length<this.n?this.points.push(t):(this.divided||this.subdivide(),this.nw.insert(t),this.ne.insert(t),this.sw.insert(t),this.se.insert(t)))}},{key:"subdivide",value:function(){var e=this.boundary,i=e.x,n=e.y,s=e.width,a=e.height,o=new r.default(i,n,s/2,a/2),h=new r.default(i+s/2,n,s/2,a/2),u=new r.default(i,n+a/2,s/2,a/2),c=new r.default(i+s/2,n+a/2,s/2,a/2);this.nw=new t(o,this.n),this.ne=new t(h,this.n),this.sw=new t(u,this.n),this.se=new t(c,this.n),this.divided=!0}},{key:"query",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:[];if(this.boundary.intersects(t)){var i=!0,n=!1,r=void 0;try{for(var s,a=this.points[Symbol.iterator]();!(i=(s=a.next()).done);i=!0){var o=s.value;t.constains(o)&&e.push(o)}}catch(t){n=!0,r=t}finally{try{!i&&a.return&&a.return()}finally{if(n)throw r}}this.divided&&(this.nw.query(t,e),this.ne.query(t,e),this.sw.query(t,e),this.se.query(t,e))}return e}},{key:"debug",value:function(t){var e=this.boundary,i=e.x,n=e.y,r=e.width,s=e.height;t.beginPath(),t.strokeStyle="#666",t.lineWidth=1,t.rect(i,n,r,s),t.stroke(),t.closePath();for(var a=0;a<this.points.length;a++)t.beginPath(),t.fillStyle="#f00",t.arc(this.points[a].x,this.points[a].y,2,0,2*Math.PI),t.fill(),t.closePath();this.divided&&(this.nw.debug(t),this.ne.debug(t),this.sw.debug(t),this.se.debug(t))}},{key:"borders",value:function(t){var e=this.boundary,i=e.x,n=e.y,r=e.width,s=e.height;t.beginPath(),t.strokeStyle="#222",t.lineWidth=1,t.rect(i,n,r,s),t.stroke(),t.closePath(),this.divided&&(this.nw.borders(t),this.ne.borders(t),this.sw.borders(t),this.se.borders(t))}}]),t}();e.default=o,e.Rectangle=r.default,e.Point=s.default},function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=function(){function t(t,e){for(var i=0;i<e.length;i++){var n=e[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(e,i,n){return i&&t(e.prototype,i),n&&t(e,n),e}}();var r=function(){function t(e,i,n,r){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),this.x=e,this.y=i,this.width=n,this.height=r}return n(t,[{key:"resize",value:function(t,e){this.width=t,this.height=e}},{key:"constains",value:function(t){return t.x>this.x&&t.x<this.x+this.width&&t.y>this.y&&t.y<this.y+this.height}},{key:"intersects",value:function(t){return!(t.x-t.width>this.x+this.width||t.x+t.width<this.x-this.width||t.y-t.height>this.y+this.height||t.y+t.height<this.y-this.height)}}]),t}();e.default=r},function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});e.default=function t(e,i){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{};!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),this.x=e||0,this.y=i||0,this.userData=n}},function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});e.mod=function(t,e){return(t%e+e)%e},e.random=function(t,e){return Math.random()*(e-t)+t}},,,,,,,function(t,e,i){"use strict";(function(t){var e=function(){function t(t,e){for(var i=0;i<e.length;i++){var n=e[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(e,i,n){return i&&t(e.prototype,i),n&&t(e,n),e}}(),n=o(i(1)),r=i(9),s=o(r),a=i(12);function o(t){return t&&t.__esModule?t:{default:t}}var h=void 0,u=void 0;new(function(i){function o(){return function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,o),function(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!=typeof e&&"function"!=typeof e?t:e}(this,(o.__proto__||Object.getPrototypeOf(o)).apply(this,arguments))}return function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}(o,n.default),e(o,[{key:"setup",value:function(){this.canvas=document.createElement("canvas"),document.body.appendChild(this.canvas),this.context=this.canvas.getContext("2d")}},{key:"debug",value:function(){this.settings={particles:100,distance:300}}},{key:"init",value:function(){this.particles=[];for(var t=0;t<this.settings.particles;t++){var e=Math.random()*this.width,i=Math.random()*this.height,n=(0,a.random)(-5,5),r=(0,a.random)(-5,5);this.particles.push({x:e,y:i,vx:n,vy:r})}}},{key:"resize",value:function(){var e=t.devicePixelRatio;this.width=t.innerWidth*e,this.height=t.innerHeight*e,this.canvas.width=this.width,this.canvas.height=this.height,this.canvas.style.width=this.width/e+"px",this.canvas.style.height=this.height/e+"px";var i=Math.max(this.width,this.height);this.boundary=new r.Rectangle(0,0,i,i)}},{key:"update",value:function(){this.context.clearRect(0,0,this.width,this.height);for(var t=0;t<this.particles.length;t++){var e=this.particles[t];e.x>this.width?e.vx=-5:e.x<0?e.vx=5:e.vx*=1,e.y>=this.height?e.vy=-5:e.y<=0?e.vy=5:e.vy*=1,e.x+=e.vx,e.y+=e.vy,this.context.beginPath(),this.context.fillStyle="#fff",this.context.arc(e.x,e.y,2,0,2*Math.PI),this.context.fill(),this.context.closePath()}h=new s.default(this.boundary,4);for(var i=0;i<this.particles.length;i++)u=new r.Point(this.particles[i].x,this.particles[i].y),h.insert(u);h.borders(this.context);for(var n=0;n<this.particles.length-1;n++)for(var a=this.settings.distance,o=this.settings.distance,c=this.particles[n].x-a/2,l=this.particles[n].y-o/2,f=new r.Rectangle(c,l,a,o),d=h.query(f),y=0;y<d.length;y++)this.connect(this.particles[n],d[y])}},{key:"connect",value:function(t,e){var i=e.x-t.x,n=e.y-t.y,r=Math.sqrt(i*i+n*n);if(r<this.settings.distance){this.context.beginPath(),this.context.strokeStyle="#999",this.context.lineWidth=r/this.settings.distance,this.context.moveTo(t.x,t.y),this.context.lineTo(e.x,e.y),this.context.stroke(),this.context.closePath();var s=1e-4*i,a=1e-4*n;t.vx+=s,t.vy+=a,e.vx-=s,e.vy-=a}}}]),o}())}).call(e,i(0))}]);