/* =========================================================================
   MÁRMORE PROCEDURAL EM WEBGL
   Um único shader desenha todas as pedras a partir da "receita" de data.js.
   - Marble.bake(stone, w, h)  -> dataURL (JPEG) para usar como textura em CSS
   - Marble.live(canvas)       -> pedra viva, com luz que segue o cursor
   ========================================================================= */
(function () {
  "use strict";

  var VERT = "attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}";

  var FRAG = [
    "precision highp float;",
    "uniform vec2 uRes;uniform float uTime,uSeed,uScale,uFreq,uSharp,uWarp,uVein,uHair,uAcc,uMode,uAngle,uGloss,uSpark,uFinish,uZoom,uHalo;",
    "uniform vec3 uBase,uBase2,uVeinC,uHairC,uAccC;uniform vec2 uLight,uPan;",
    "float hash(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}",
    "float noise(vec2 p){vec2 i=floor(p),f=fract(p);vec2 u=f*f*(3.-2.*f);",
    " return mix(mix(hash(i),hash(i+vec2(1.,0.)),u.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),u.x),u.y);}",
    "float fbm(vec2 p){float v=0.,a=.5;mat2 m=mat2(1.6,1.2,-1.2,1.6);for(int i=0;i<6;i++){v+=a*noise(p);p=m*p;a*=.5;}return v;}",
    "vec3 vor(vec2 p){vec2 i=floor(p),f=fract(p);float d1=8.,d2=8.,id=0.;",
    " for(int y=-1;y<=1;y++)for(int x=-1;x<=1;x++){vec2 g=vec2(float(x),float(y));vec2 o=vec2(hash(i+g),hash(i+g+17.3));",
    "  vec2 r=g+o-f;float d=dot(r,r);if(d<d1){d2=d1;d1=d;id=hash(i+g+3.1);}else if(d<d2){d2=d;}}",
    " return vec3(sqrt(d1),sqrt(d2),id);}",
    "void main(){",
    " vec2 fr=gl_FragCoord.xy;",
    " vec2 uv=(fr-.5*uRes)/min(uRes.x,uRes.y);",
    " float ca=cos(uAngle),sa=sin(uAngle);",
    " vec2 p=mat2(ca,-sa,sa,ca)*(uv*uZoom+uPan)*uScale+vec2(uSeed*3.7,uSeed*1.9);",
    " float t=uTime*.035;",
    " vec2 q=vec2(fbm(p+vec2(0.,t)),fbm(p+vec2(5.2,1.3)-t*.7));",
    " vec2 r=vec2(fbm(p+3.5*q+vec2(1.7,9.2)),fbm(p+3.5*q+vec2(8.3,2.8)+t*.5));",
    " float f=fbm(p+uWarp*r);",
    " vec3 col=mix(uBase,uBase2,smoothstep(.25,.85,f));",
    " float h=abs(fbm(p*2.4+r*1.8+4.)-.5);",
    " float hair=(1.-smoothstep(0.,.011,h))*smoothstep(.35,.7,fbm(p*1.3+50.));",
    " if(uMode<.5){",
    "  float turb=fbm(p*.55+q*.9);float turb2=fbm(p*1.7+r*1.1);",
    "  float m1=smoothstep(.18,.62,fbm(p*.42+31.));",
    "  float v1=abs(sin((p.x*uFreq+p.y*uFreq*.35+turb*uWarp*2.6+turb2*.45)*1.5708));",
    "  float vein1=pow(1.-v1,uSharp*(.55+.9*fbm(p*.9+5.)))*m1;",
    "  float halo=pow(1.-v1,uSharp*.16)*m1;",
    "  float v2=abs(sin((p.y*uFreq*.8-p.x*uFreq*.4+fbm(p*.7+q*1.5)*uWarp*2.4+turb2*.5)*1.5708));",
    "  float vein2=pow(1.-v2,uSharp*1.6)*smoothstep(.45,.85,fbm(p*.9+11.));",
    "  col=mix(col,mix(col,uVeinC,.5),clamp(halo*uVein*.35*uHalo,0.,1.));",
    "  col=mix(col,uVeinC,clamp(vein1*uVein,0.,1.));",
    "  col=mix(col,uVeinC,clamp(vein2*uVein*.6,0.,1.));",
    "  col=mix(col,uAccC,clamp(pow(vein1,1.6)*uAcc+vein2*uAcc*.35,0.,1.));",
    "  col=mix(col,uHairC,hair*uHair);",
    "  float fos=smoothstep(.83,.9,noise(p*9.+q*4.))*uHair*.35;",   /* pequenos fósseis/manchas */
    "  col=mix(col,uHairC,fos*step(.6,uHair));",
    " }else if(uMode<1.5){",                                       /* travertino */
    "  vec2 tp=vec2(p.x*.45,p.y*4.2);",
    "  float b=fbm(tp+r*.6);",
    "  col=mix(uBase,uBase2,smoothstep(.3,.72,b));",
    "  col=mix(col,uVeinC,smoothstep(.55,.78,fbm(tp*1.7+7.))*.55*uVein);",
    "  col=mix(col,uHairC,smoothstep(.62,.8,fbm(tp*2.3+19.))*.45);",
    "  float pore=noise(vec2(p.x*16.,p.y*70.)+q*3.)*.75+noise(vec2(p.x*34.,p.y*120.))*.25;",
    "  float pm=smoothstep(.35,.62,fbm(p*1.6+3.));",
    "  col*=1.-.06*smoothstep(.66,.74,pore)*pm;",
    "  col=mix(col,uAccC,smoothstep(.74,.84,pore)*pm*uAcc*.8);",
    " }else if(uMode<2.5){",                                       /* ônix */
    "  float bands=f*uFreq+p.y*.6+r.x*1.5;",
    "  float bb=.5+.5*sin(bands*6.2831);",
    "  col=mix(uBase,uBase2,bb);",
    "  col=mix(col,uVeinC,pow(.5+.5*sin(bands*12.566+1.),7.)*uVein);",
    "  col=mix(col,uBase2*.82,pow(.5+.5*sin(bands*3.1415+2.),9.)*.5);",
    "  col+=uAccC*pow(f,2.4)*uAcc*.55;",
    "  col=mix(col,uHairC,hair*uHair);",
    " }else{",                                                     /* brecha */
    "  vec3 vo=vor(p*uFreq+r*uWarp*1.5+q*.8);",
    "  float edge=vo.y-vo.x;",
    "  float net=(1.-smoothstep(0.,.02+.07*noise(p*2.3+4.),edge))*(.45+.55*smoothstep(.25,.6,fbm(p*1.4+9.)));",
    "  col=mix(uBase,uBase2,clamp(vo.z*.85+(f-.5)*.6,0.,1.));",
    "  col*=.9+.2*fbm(p*3.+q);",
    "  col=mix(col,uVeinC,net*uVein);",
    "  vec3 vo2=vor(p*uFreq*2.7+q*2.);",
    "  col=mix(col,mix(uVeinC,col,.35),(1.-smoothstep(0.,.022,vo2.y-vo2.x))*uVein*.5*smoothstep(.35,.7,fbm(p*1.1+7.)));",
    "  col=mix(col,uHairC,hair*uHair);",
    "  col=mix(col,uAccC,pow(net,3.)*uAcc);",
    " }",
    /* acabamentos */
    " float gl=uGloss;",
    " if(uFinish>.5&&uFinish<1.5){col=mix(col,vec3(dot(col,vec3(.333))),.08)*.94+.05;gl*=.18;}",
    " else if(uFinish>1.5&&uFinish<2.5){float n=noise(vec2(fr.x*.015,fr.y*1.4))*.6+noise(vec2(fr.x*.03,fr.y*3.1))*.4;col=col*(.93+.1*n)*.96+.03;gl*=.4;}",
    " else if(uFinish>2.5&&uFinish<3.5){float n=hash(floor(fr*.7));col=mix(col,vec3(1.),.1)*(.95+.07*n);gl*=.1;}",
    " else if(uFinish>3.5){float n=noise(fr*.32)*.6+noise(fr*.11)*.4;col=mix(col,vec3(dot(col,vec3(.333))),.2);col=mix(col,vec3(.97),.16)*(.84+.24*n);gl*=.05;}",
    /* luz */
    " vec2 lp=(uLight*uRes-.5*uRes)/min(uRes.x,uRes.y);",
    " vec2 d=uv-lp;",
    " float spec=exp(-dot(d,d)*3.2)*.07+exp(-dot(d,d)*30.)*.07;",
    " float band=exp(-pow((uv.x*.8+uv.y-lp.x*.8-lp.y)*2.4,2.))*.035;",
    " col+=(1.-col*.55)*(spec+band)*gl;",
    " col*=.95+.08*(1.-length(uv)*.55);",
    " float sp=step(.9965,hash(floor(fr/1.5)+uSeed))*uSpark;",
    " col+=sp*(.25+.6*exp(-dot(d,d)*4.))*(.6+.4*sin(uTime*2.+fr.x));",
    " col+=(hash(fr+fract(uTime))-.5)*.014;",
    " gl_FragColor=vec4(clamp(col,0.,1.),1.);",
    "}"
  ].join("\n");

  function hex(h) {
    h = h.replace("#", "");
    return [parseInt(h.substr(0, 2), 16) / 255, parseInt(h.substr(2, 2), 16) / 255, parseInt(h.substr(4, 2), 16) / 255];
  }

  var NAMES = ["uRes","uTime","uSeed","uScale","uFreq","uSharp","uWarp","uVein","uHair","uAcc","uMode","uAngle","uGloss","uSpark","uFinish","uZoom","uHalo",
               "uBase","uBase2","uVeinC","uHairC","uAccC","uLight","uPan"];

  function makeGL(canvas, preserve) {
    var gl = canvas.getContext("webgl", { antialias: false, alpha: false, preserveDrawingBuffer: !!preserve, powerPreference: "high-performance" });
    if (!gl) return null;
    function sh(type, src) {
      var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { console.warn(gl.getShaderInfoLog(s)); return null; }
      return s;
    }
    var vs = sh(gl.VERTEX_SHADER, VERT), fs = sh(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return null;
    var pr = gl.createProgram(); gl.attachShader(pr, vs); gl.attachShader(pr, fs); gl.linkProgram(pr);
    if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) return null;
    gl.useProgram(pr);
    var b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    var al = gl.getAttribLocation(pr, "a"); gl.enableVertexAttribArray(al); gl.vertexAttribPointer(al, 2, gl.FLOAT, false, 0, 0);
    var L = {}; NAMES.forEach(function (n) { L[n] = gl.getUniformLocation(pr, n); });
    return { gl: gl, L: L, canvas: canvas };
  }

  function apply(ctx, r) {
    var gl = ctx.gl, L = ctx.L;
    gl.uniform1f(L.uMode, r.mode); gl.uniform1f(L.uScale, r.scale); gl.uniform1f(L.uFreq, r.freq);
    gl.uniform1f(L.uSharp, r.sharp); gl.uniform1f(L.uWarp, r.warp); gl.uniform1f(L.uVein, r.veinAmt);
    gl.uniform1f(L.uHair, r.hairAmt); gl.uniform1f(L.uAcc, r.accAmt); gl.uniform1f(L.uAngle, r.angle);
    gl.uniform1f(L.uSeed, r.seed); gl.uniform1f(L.uHalo, r.halo == null ? 1 : r.halo); gl.uniform1f(L.uSpark, r.spark || 0);
    gl.uniform3fv(L.uBase, hex(r.base)); gl.uniform3fv(L.uBase2, hex(r.base2)); gl.uniform3fv(L.uVeinC, hex(r.vein));
    gl.uniform3fv(L.uHairC, hex(r.hair)); gl.uniform3fv(L.uAccC, hex(r.acc));
  }

  function draw(ctx, o) {
    var gl = ctx.gl, L = ctx.L, c = ctx.canvas;
    gl.viewport(0, 0, c.width, c.height);
    gl.uniform2f(L.uRes, c.width, c.height);
    gl.uniform1f(L.uTime, o.time || 0);
    gl.uniform1f(L.uGloss, o.gloss == null ? 1 : o.gloss);
    gl.uniform1f(L.uFinish, o.finish || 0);
    gl.uniform1f(L.uZoom, o.zoom || 1);
    gl.uniform2f(L.uPan, o.panX || 0, o.panY || 0);
    gl.uniform2f(L.uLight, o.lx == null ? .3 : o.lx, o.ly == null ? .72 : o.ly);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  /* ---------- assador de texturas ---------- */
  var baker = null, cache = {};
  function bake(stone, w, h, opt) {
    opt = opt || {};
    var key = stone.id + ":" + w + "x" + h + ":" + (opt.zoom || 1) + ":" + (opt.panX || 0);
    if (cache[key]) return cache[key];
    if (baker === null) {
      var c = document.createElement("canvas");
      baker = makeGL(c, true) || false;
    }
    if (!baker) return null;
    baker.canvas.width = w; baker.canvas.height = h;
    apply(baker, stone.r);
    draw(baker, { time: 0, gloss: opt.gloss == null ? .5 : opt.gloss, lx: .28, ly: .78, zoom: opt.zoom, panX: opt.panX, panY: opt.panY });
    var url = baker.canvas.toDataURL("image/jpeg", .9);
    cache[key] = url;
    return url;
  }

  /* ---------- pedra viva ---------- */
  function live(canvas, opts) {
    opts = opts || {};
    var ctx = makeGL(canvas, false);
    if (!ctx) return null;
    var st = { stone: null, gloss: 1, finish: 0, lx: .32, ly: .7, tx: .32, ty: .7, zoom: opts.zoom || 1, panX: 0, panY: 0,
               visible: true, raf: 0, t0: performance.now(), scale: opts.scale || 1, still: !!opts.still };
    function size() {
      var dpr = Math.min(window.devicePixelRatio || 1, opts.maxDpr || 1.5) * st.scale;
      var w = Math.max(2, Math.round(canvas.clientWidth * dpr)), h = Math.max(2, Math.round(canvas.clientHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
    }
    function frame(now) {
      st.raf = 0;
      if (!st.visible || !st.stone) return;
      size();
      var k = 1 - Math.exp(-1 / 14);
      st.lx += (st.tx - st.lx) * k; st.ly += (st.ty - st.ly) * k;
      draw(ctx, { time: st.still ? 0 : (now - st.t0) / 1000, gloss: st.gloss, finish: st.finish, lx: st.lx, ly: st.ly, zoom: st.zoom, panX: st.panX, panY: st.panY });
      if (!st.still || Math.abs(st.tx - st.lx) + Math.abs(st.ty - st.ly) > .002) kick();
    }
    function kick() { if (!st.raf) st.raf = requestAnimationFrame(frame); }
    new IntersectionObserver(function (e) { st.visible = e[0].isIntersecting; if (st.visible) kick(); }).observe(canvas);
    window.addEventListener("resize", kick);
    return {
      set: function (stone) { st.stone = stone; apply(ctx, stone.r); kick(); },
      light: function (x, y) { st.tx = x; st.ty = y; kick(); },
      finish: function (f, g) { st.finish = f; st.gloss = g; kick(); },
      view: function (z, px, py) { st.zoom = z; st.panX = px; st.panY = py; kick(); },
      kick: kick
    };
  }

  window.Marble = { bake: bake, live: live, hex: hex };
})();
