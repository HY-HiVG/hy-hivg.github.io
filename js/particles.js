/**
 * Three-effect hero carousel:
 *   1. Shape Wave (Canvas 2D)
 *   2. PRISM crystal refraction (WebGL shader)
 *   3. Dark Cubes infinite mirror (Three.js)
 * Auto-cycles every 8 s with 1.2 s CSS cross-fade.
 */
(function () {
    'use strict';
    var CYCLE = 8000, FADE = 1200;

    function rnd(a, b) { return Math.random() * (b - a) + a; }
    function rndI(a, b) { return Math.floor(rnd(a, b + 1)); }
    function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
    function ss(t) { var c = Math.max(0, Math.min(1, t)); return c * c * (3 - 2 * c); }
    function d2f(s) { return s <= 0 ? 1 : 1 - Math.pow(0.05, 1 / (60 * s)); }

    /* ========== EFFECT 1 — Shape Wave (Canvas 2D, SVG icons) ========== */
    function ShapeWave(cv) {
        var c = cv.getContext('2d'), W, H, shapes = [], waves = [], la = 0;
        var G = 56, RS = 0.12, HN = 1.2, HX = 3, WS = 1000, WW = 220, RV = 0.32;
        var CL = ['#818cf8','#60a5fa','#a78bfa','#c084fc','#38bdf8','#93c5fd'];
        var NT = 20;
        function star(n, or, ir) {
            c.beginPath();
            for (var i = 0; i < n * 2; i++) {
                var a = i * Math.PI / n - Math.PI / 2, r = i % 2 === 0 ? or : ir;
                i === 0 ? c.moveTo(Math.cos(a) * r, Math.sin(a) * r) : c.lineTo(Math.cos(a) * r, Math.sin(a) * r);
            }
            c.closePath(); c.fill();
        }
        function poly(n, r) {
            c.beginPath();
            for (var i = 0; i < n; i++) {
                var a = i * Math.PI * 2 / n - Math.PI / 2;
                i === 0 ? c.moveTo(Math.cos(a) * r, Math.sin(a) * r) : c.lineTo(Math.cos(a) * r, Math.sin(a) * r);
            }
            c.closePath(); c.fill();
        }
        function ds(s) {
            var z = s.sz;
            switch (s.t) {
                case 0: c.beginPath(); c.arc(0, 0, z * .6, 0, Math.PI * 2); c.fill(); break;
                case 1: c.beginPath(); c.roundRect(-z * .55, -z * .55, z * 1.1, z * 1.1, z * .15); c.fill(); break;
                case 2: c.beginPath(); c.moveTo(0, -z * .7); c.lineTo(z * .6, z * .5); c.lineTo(-z * .6, z * .5); c.closePath(); c.fill(); break;
                case 3: star(5, z * .7, z * .3); break;
                case 4:
                    c.beginPath(); c.moveTo(0, z * .55);
                    c.bezierCurveTo(-z * .1, z * .35, -z * .65, z * .1, -z * .65, -z * .15);
                    c.bezierCurveTo(-z * .65, -z * .55, -z * .15, -z * .65, 0, -z * .35);
                    c.bezierCurveTo(z * .15, -z * .65, z * .65, -z * .55, z * .65, -z * .15);
                    c.bezierCurveTo(z * .65, z * .1, z * .1, z * .35, 0, z * .55);
                    c.fill(); break;
                case 5: poly(6, z * .65); break;
                case 6: c.beginPath(); c.moveTo(0, -z * .7); c.lineTo(z * .6, z * .1); c.lineTo(z * .15, z * .1); c.lineTo(z * .15, z * .7); c.lineTo(-z * .15, z * .7); c.lineTo(-z * .15, z * .1); c.lineTo(-z * .6, z * .1); c.closePath(); c.fill(); break;
                case 7: c.beginPath(); c.moveTo(0, -z * .7); c.lineTo(z * .5, 0); c.lineTo(0, z * .7); c.lineTo(-z * .5, 0); c.closePath(); c.fill(); break;
                case 8: c.beginPath(); c.moveTo(z * .1, -z * .7); c.lineTo(-z * .55, z * .15); c.lineTo(z * .05, z * .05); c.lineTo(-z * .15, z * .7); c.lineTo(z * .55, -z * .15); c.lineTo(-z * .05, -z * .05); c.closePath(); c.fill(); break;
                case 9: var w = z * .2; c.beginPath(); c.moveTo(-w, -z * .65); c.lineTo(w, -z * .65); c.lineTo(w, -w); c.lineTo(z * .65, -w); c.lineTo(z * .65, w); c.lineTo(w, w); c.lineTo(w, z * .65); c.lineTo(-w, z * .65); c.lineTo(-w, w); c.lineTo(-z * .65, w); c.lineTo(-z * .65, -w); c.lineTo(-w, -w); c.closePath(); c.fill(); break;
                case 10:
                    c.beginPath(); c.arc(0, 0, z * .6, 0, Math.PI * 2);
                    c.moveTo(z * .25, -z * .1); c.arc(z * .15, -z * .1, z * .45, 0, Math.PI * 2, true);
                    c.fill('evenodd'); break;
                case 11: star(6, z * .65, z * .35); break;
                case 12: c.beginPath(); c.moveTo(0, -z * .7); c.bezierCurveTo(z * .5, -z * .1, z * .5, z * .4, 0, z * .7); c.bezierCurveTo(-z * .5, z * .4, -z * .5, -z * .1, 0, -z * .7); c.fill(); break;
                case 13: c.beginPath(); c.moveTo(-z * .35, -z * .6); c.lineTo(z * .55, 0); c.lineTo(-z * .35, z * .6); c.closePath(); c.fill(); break;
                case 14: c.beginPath(); c.moveTo(0, -z * .7); c.lineTo(z * .6, -z * .4); c.lineTo(z * .6, z * .2); c.bezierCurveTo(z * .6, z * .55, z * .3, z * .7, 0, z * .75); c.bezierCurveTo(-z * .3, z * .7, -z * .6, z * .55, -z * .6, z * .2); c.lineTo(-z * .6, -z * .4); c.closePath(); c.fill(); break;
                case 15: poly(5, z * .65); break;
                case 16: star(4, z * .65, z * .2); break;
                case 17:
                    c.beginPath(); c.arc(0, 0, z * .6, 0, Math.PI * 2);
                    c.moveTo(z * .35, 0); c.arc(0, 0, z * .35, 0, Math.PI * 2, true);
                    c.fill('evenodd'); break;
                case 18: c.beginPath(); c.moveTo(z * .6, 0); c.lineTo(z * .1, -z * .35); c.lineTo(z * .1, -z * .12); c.lineTo(-z * .6, -z * .12); c.lineTo(-z * .6, z * .12); c.lineTo(z * .1, z * .12); c.lineTo(z * .1, z * .35); c.closePath(); c.fill(); break;
                case 19: c.beginPath(); c.arc(0, 0, z * .6, Math.PI, 0); c.closePath(); c.fill(); break;
            }
        }
        function bg() {
            var cols = Math.floor(W / G), rows = Math.floor(H / G);
            var ox = (W - (cols - 1) * G) / 2, oy = (H - (rows - 1) * G) / 2;
            shapes = [];
            var seq = 0, prime = 7;
            for (var r = 0; r < rows; r++) for (var cc = 0; cc < cols; cc++) {
                var t = (seq * prime + r * 3) % NT;
                seq++;
                shapes.push({ x: ox + cc * G, y: oy + r * G, t: t, cl: CL[(r * 3 + cc * 2) % CL.length], a: rnd(0, Math.PI * 2), sz: G * 0.38, sc: RS, ms: rnd(HN, HX), h: false });
            }
        }
        this.resize = function (w, h, d) { W = w; H = h; cv.width = w * d; cv.height = h * d; c.setTransform(1, 0, 0, 1, 0, 0); c.scale(d, d); bg(); var n = performance.now(); waves = [{ x: W * .5, y: H * .5, t0: n }, { x: W * .2, y: H * .3, t0: n + 600 }, { x: W * .8, y: H * .7, t0: n + 1200 }]; };
        this.wave = function (x, y) { waves.push({ x: x, y: y, t0: performance.now() }); };
        this.draw = function (now, ptr, act) {
            c.clearRect(0, 0, W, H); c.fillStyle = '#06061a'; c.fillRect(0, 0, W, H);
            if (now - la > 3000) { la = now; waves.push({ x: rnd(W * .05, W * .95), y: rnd(H * .05, H * .95), t0: now }); if (Math.random() > .5) waves.push({ x: rnd(W * .1, W * .9), y: rnd(H * .1, H * .9), t0: now + 400 }); }
            var mD = Math.sqrt(W * W + H * H); waves = waves.filter(function (w) { return (now - w.t0) / 1000 * WS < mD + WW; });
            var radius = Math.min(W, H) * RV;
            for (var i = 0; i < shapes.length; i++) {
                var s = shapes[i], pi = 0;
                if (ptr && act > .001) { var dx = s.x - ptr.x, dy = s.y - ptr.y; pi = ss(1 - Math.sqrt(dx * dx + dy * dy) / radius) * act; if (pi > .05 && !s.h) { s.h = true; s.ms = rnd(HN, HX); s.a = rnd(0, Math.PI * 2); s.t = (s.t + rndI(1, NT - 1)) % NT; } else if (pi <= .05) s.h = false; } else s.h = false;
                var wi = 0; for (var j = 0; j < waves.length; j++) { var w = waves[j], wr = (now - w.t0) / 1000 * WS, wd = Math.sqrt((s.x - w.x) * (s.x - w.x) + (s.y - w.y) * (s.y - w.y)), wt = 1 - Math.abs(wd - wr) / WW; if (wt > 0) wi = Math.max(wi, Math.sin(Math.PI * wt)); }
                var tgt = Math.max(RS + pi * (s.ms - RS), RS + wi * (s.ms - RS)); s.sc += (tgt - s.sc) * d2f(tgt > s.sc ? .5 : .5); if (s.sc < RS * .15) continue;
                c.save(); c.translate(s.x, s.y); c.rotate(s.a); c.scale(s.sc, s.sc); c.fillStyle = s.cl; c.globalAlpha = Math.min(1, .15 + (s.sc - RS) / (HX - RS) * .85); ds(s); c.restore();
            }
        };
    }

    /* ========== EFFECT 2 — PRISM crystal (DISABLED for performance) ========== */
    function PrismShader(cv) {
        this.resize = function () {};
        this.wave = function () {};
        this.draw = function () {};
    }

    /* ========== EFFECT 3 — SVG Cubes infinite mirror (Three.js) ========== */
    function DarkCubes(cv) {
        if (typeof THREE === 'undefined') { this.resize = this.draw = this.wave = function () {}; return; }

        var renderer, scene, camera, outerGroup, innerGroup, cubeCamera, cubeRT;
        var outerSize = 4, innerSize = 1.8, gridRange = 2;
        var totalN = Math.pow(gridRange * 2 + 1, 3);
        var neonMat, maskCube, centerMesh, outerInst, innerInst, solidInst;
        var gridData = [], settings = { speed: 0.003, decay: 0.9 };
        var localCam = new THREE.Vector3();
        var posMat = new THREE.Matrix4(), sclMat = new THREE.Matrix4(), mirMat = new THREE.Matrix4(), rotMat = new THREE.Matrix4(), iFin = new THREE.Matrix4(), zMat = new THREE.Matrix4().makeScale(0, 0, 0);
        

        function mergeGeos(geos) {
            var pos = [], nrm = [], idx = [], off = 0;
            for (var i = 0; i < geos.length; i++) {
                var g = geos[i], pa = g.attributes.position.array, na = g.attributes.normal.array, ia = g.index ? g.index.array : null;
                for (var j = 0; j < pa.length; j++) { pos.push(pa[j]); nrm.push(na[j]); }
                var vc = pa.length / 3;
                if (ia) for (var j = 0; j < ia.length; j++) idx.push(ia[j] + off);
                else for (var j = 0; j < vc; j++) idx.push(j + off);
                off += vc;
            }
            var mg = new THREE.BufferGeometry();
            mg.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
            mg.setAttribute('normal', new THREE.Float32BufferAttribute(nrm, 3));
            mg.setIndex(idx);
            return mg;
        }

        function neonGeo(size, thick) {
            var gs = [], h = size / 2;
            var cyl = new THREE.CylinderGeometry(thick, thick, size, 6);
            var sph = new THREE.SphereGeometry(thick, 6, 6);
            var edges = [[0, h, h, 0, 0, Math.PI / 2], [0, h, -h, 0, 0, Math.PI / 2], [0, -h, h, 0, 0, Math.PI / 2], [0, -h, -h, 0, 0, Math.PI / 2],
                         [h, 0, h, 0, 0, 0], [h, 0, -h, 0, 0, 0], [-h, 0, h, 0, 0, 0], [-h, 0, -h, 0, 0, 0],
                         [h, h, 0, Math.PI / 2, 0, 0], [h, -h, 0, Math.PI / 2, 0, 0], [-h, h, 0, Math.PI / 2, 0, 0], [-h, -h, 0, Math.PI / 2, 0, 0]];
            edges.forEach(function (e) {
                var c2 = cyl.clone(), m = new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(e[3], e[4], e[5]));
                m.setPosition(e[0], e[1], e[2]); c2.applyMatrix4(m); gs.push(c2);
            });
            var corners = [[h, h, h], [h, h, -h], [h, -h, h], [h, -h, -h], [-h, h, h], [-h, h, -h], [-h, -h, h], [-h, -h, -h]];
            corners.forEach(function (c2) {
                var s2 = sph.clone(); s2.applyMatrix4(new THREE.Matrix4().setPosition(c2[0], c2[1], c2[2])); gs.push(s2);
            });
            return mergeGeos(gs);
        }

        function buildGrid() {
            gridData = []; var idx = 0;
            for (var i = -gridRange; i <= gridRange; i++)
                for (var j = -gridRange; j <= gridRange; j++)
                    for (var k = -gridRange; k <= gridRange; k++)
                        gridData.push({ idx: idx++, i: i, j: j, k: k, ic: i === 0 && j === 0 && k === 0,
                                        x: i * outerSize, y: j * outerSize, z: k * outerSize,
                                        sx: i % 2 === 0 ? 1 : -1, sy: j % 2 === 0 ? 1 : -1, sz: k % 2 === 0 ? 1 : -1,
                                        d: Math.abs(i) + Math.abs(j) + Math.abs(k) });
        }

        function initScene() {
            renderer = new THREE.WebGLRenderer({ canvas: cv, antialias: false, stencil: true, alpha: false, powerPreference: 'low-power' });
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
            renderer.setClearColor(0x000000);

            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
            camera.position.set(6, 4, 8);
            camera.lookAt(0, 0, 0);

            cubeRT = new THREE.WebGLCubeRenderTarget(256, { type: THREE.HalfFloatType, generateMipmaps: true, minFilter: THREE.LinearMipmapLinearFilter });
            cubeCamera = new THREE.CubeCamera(0.1, 100, cubeRT);
            scene.add(cubeCamera);

            outerGroup = new THREE.Group();
            innerGroup = new THREE.Group();
            scene.add(outerGroup);
            outerGroup.add(innerGroup);

            var maskMat = new THREE.MeshBasicMaterial({ colorWrite: false, depthWrite: false, stencilWrite: true, stencilRef: 1, stencilFunc: THREE.AlwaysStencilFunc, stencilZPass: THREE.ReplaceStencilOp, side: THREE.DoubleSide });
            maskCube = new THREE.Mesh(new THREE.BoxGeometry(outerSize, outerSize, outerSize), maskMat);
            maskCube.renderOrder = 0;
            outerGroup.add(maskCube);

            var glassMat = new THREE.MeshStandardMaterial({ color: 0x000000, transparent: true, opacity: 0.1, side: THREE.DoubleSide, depthWrite: false });
            var outerGlass = new THREE.Mesh(new THREE.BoxGeometry(outerSize, outerSize, outerSize), glassMat);
            outerGlass.renderOrder = 4;
            outerGroup.add(outerGlass);

            neonMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, stencilWrite: true, stencilRef: 1, stencilFunc: THREE.EqualStencilFunc });

            var mirrorMat = new THREE.MeshStandardMaterial({ color: 0x555555, metalness: 1, roughness: 0, envMap: cubeRT.texture, envMapIntensity: 0.092, depthWrite: true, side: THREE.DoubleSide, stencilWrite: true, stencilRef: 1, stencilFunc: THREE.EqualStencilFunc });
            var instMirMat = mirrorMat.clone();

            var isGeo = new THREE.BoxGeometry(innerSize - 0.002, innerSize - 0.002, innerSize - 0.002);
            centerMesh = new THREE.Mesh(isGeo, mirrorMat);
            centerMesh.renderOrder = 1;
            innerGroup.add(centerMesh);

            var oGeo = neonGeo(outerSize, 0.008);
            var iGeo = neonGeo(innerSize, 0.006);

            outerInst = new THREE.InstancedMesh(oGeo, neonMat.clone(), totalN);
            innerInst = new THREE.InstancedMesh(iGeo, neonMat.clone(), totalN);
            solidInst = new THREE.InstancedMesh(isGeo, instMirMat, totalN);
            solidInst.renderOrder = 1; outerInst.renderOrder = 2; innerInst.renderOrder = 2;
            outerGroup.add(outerInst); outerGroup.add(innerInst); outerGroup.add(solidInst);

            buildGrid();

            var colorH = new THREE.Color();
            for (var i = 0; i < gridData.length; i++) {
                var d = gridData[i];
                var fade = Math.pow(settings.decay, d.d);
                var hue = ((d.i + d.j + d.k) * 0.06 + 0.52 + 1) % 1;
                colorH.setHSL(hue, 0.85, Math.max(0.15, 0.55 * fade));
                outerInst.setColorAt(i, colorH);
                innerInst.setColorAt(i, colorH);
            }
            outerInst.instanceColor.needsUpdate = true;
            innerInst.instanceColor.needsUpdate = true;

        }

        function updateGrid(cx, cy, cz) {
            var hs = outerSize / 2;
            rotMat.makeRotationFromEuler(innerGroup.rotation);
            for (var i = 0; i < totalN; i++) {
                var d = gridData[i];
                posMat.makeTranslation(d.x, d.y, d.z);
                sclMat.makeScale(d.sx, d.sy, d.sz);
                mirMat.multiplyMatrices(posMat, sclMat);
                if (d.ic) { outerInst.setMatrixAt(i, mirMat); iFin.multiplyMatrices(mirMat, rotMat); innerInst.setMatrixAt(i, iFin); solidInst.setMatrixAt(i, zMat); continue; }
                var vx = (cx > hs && d.i <= 0) || (cx < -hs && d.i >= 0) || (Math.abs(cx) <= hs);
                var vy = (cy > hs && d.j <= 0) || (cy < -hs && d.j >= 0) || (Math.abs(cy) <= hs);
                var vz = (cz > hs && d.k <= 0) || (cz < -hs && d.k >= 0) || (Math.abs(cz) <= hs);
                if (vx && vy && vz) { outerInst.setMatrixAt(i, mirMat); iFin.multiplyMatrices(mirMat, rotMat); innerInst.setMatrixAt(i, iFin); solidInst.setMatrixAt(i, iFin); }
                else { outerInst.setMatrixAt(i, zMat); innerInst.setMatrixAt(i, zMat); solidInst.setMatrixAt(i, zMat); }
            }
            outerInst.instanceMatrix.needsUpdate = true; innerInst.instanceMatrix.needsUpdate = true; solidInst.instanceMatrix.needsUpdate = true;
        }

        var ready = false;
        this.resize = function (w, h) {
            if (!ready) { initScene(); ready = true; }
            renderer.setSize(w, h, false);
            camera.aspect = w / h; camera.updateProjectionMatrix();
        };
        this.wave = function () {};
        this.draw = function () {
            if (!ready) return;
            outerGroup.rotation.x += settings.speed; outerGroup.rotation.y += settings.speed * 0.8;
            innerGroup.rotation.y -= settings.speed * 1.5; innerGroup.rotation.z -= settings.speed * 1.2;

            var oldSF = neonMat.stencilFunc;
            neonMat.stencilFunc = THREE.AlwaysStencilFunc;
            maskCube.visible = false; centerMesh.visible = false;
            updateGrid(0, 0, 0);
            cubeCamera.update(renderer, scene);

            centerMesh.visible = true; maskCube.visible = true;
            neonMat.stencilFunc = oldSF;
            localCam.copy(camera.position); outerGroup.worldToLocal(localCam);
            updateGrid(localCam.x, localCam.y, localCam.z);
            renderer.render(scene, camera);
        };
    }

    /* ========== ORCHESTRATOR ========== */
    var ACTIVE = [0, 2]; // only Shape Wave (0) and Dark Cubes (2); PRISM disabled

    function run(id) {
        var container = document.getElementById(id);
        if (!container) return;

        var layers = [], effects = [];
        for (var k = 0; k < 3; k++) {
            var wrap = document.createElement('div');
            wrap.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;opacity:0;transition:opacity ' + FADE + 'ms ease;will-change:opacity;';
            var cv = document.createElement('canvas');
            cv.style.cssText = 'display:block;width:100%;height:100%;';
            wrap.appendChild(cv);
            container.appendChild(wrap);
            layers.push(wrap);
            if (k === 0) effects.push(new ShapeWave(cv));
            else if (k === 1) effects.push(new PrismShader(cv));
            else effects.push(new DarkCubes(cv));
        }

        var heroOuter = container.parentElement;
        var dots = document.createElement('div');
        dots.style.cssText = 'position:absolute;bottom:16px;left:50%;transform:translateX(-50%);display:flex;gap:8px;z-index:10;pointer-events:auto;';
        for (var d = 0; d < ACTIVE.length; d++) {
            var dot = document.createElement('div');
            dot.style.cssText = 'width:8px;height:8px;border-radius:50%;background:rgba(255,255,255,.25);cursor:pointer;transition:background .3s,transform .3s;';
            dot.dataset.ai = d;
            dot.addEventListener('click', function (e) { switchTo(parseInt(e.target.dataset.ai)); resetTimer(); });
            dots.appendChild(dot);
        }
        (heroOuter || container).appendChild(dots);

        var activeIdx = 0, W, H, dpr;
        var pointer = null, activity = 0, mouse = { x: .5, y: .5, tx: .5, ty: .5 };
        var cycleTimer;
        var heroVisible = true;

        function switchTo(ai) {
            activeIdx = ai;
            var cur = ACTIVE[ai];
            for (var i = 0; i < 3; i++) layers[i].style.opacity = i === cur ? '1' : '0';
            for (var i = 0; i < ACTIVE.length; i++) {
                dots.children[i].style.background = i === ai ? 'rgba(255,255,255,.9)' : 'rgba(255,255,255,.25)';
                dots.children[i].style.transform = i === ai ? 'scale(1.3)' : 'scale(1)';
            }
        }
        function resetTimer() {
            clearInterval(cycleTimer);
            cycleTimer = setInterval(function () { switchTo((activeIdx + 1) % ACTIVE.length); }, CYCLE);
        }

        function resize() {
            var rect = container.getBoundingClientRect();
            W = rect.width; H = rect.height; dpr = Math.min(window.devicePixelRatio || 1, 1.5);
            effects[0].resize(W, H, dpr);
            effects[2].resize(W, H);
        }

        var resizeRaf = 0;
        window.addEventListener('resize', function () {
            if (resizeRaf) return;
            resizeRaf = requestAnimationFrame(function () { resizeRaf = 0; resize(); });
        });

        var observer = new IntersectionObserver(function (entries) {
            heroVisible = entries[0].isIntersecting;
        }, { threshold: 0.05 });
        observer.observe(container);

        resize();

        var heroRoot = container.parentElement || container;
        heroRoot.addEventListener('pointermove', function (e) {
            var rect = container.getBoundingClientRect();
            pointer = { x: e.clientX - rect.left, y: e.clientY - rect.top };
            activity = 1; mouse.tx = (e.clientX - rect.left) / W; mouse.ty = 1 - (e.clientY - rect.top) / H;
        });
        heroRoot.addEventListener('pointerleave', function () { pointer = null; });
        heroRoot.addEventListener('click', function (e) {
            if (e.target.closest('a') || e.target.dataset.idx !== undefined || e.target.dataset.ai !== undefined) return;
            var rect = container.getBoundingClientRect();
            var cur = ACTIVE[activeIdx];
            effects[cur].wave(e.clientX - rect.left, e.clientY - rect.top);
        });

        var t0 = performance.now();
        function frame() {
            if (heroVisible) {
                var now = performance.now() - t0;
                activity *= .93; mouse.x += (mouse.tx - mouse.x) * .03; mouse.y += (mouse.ty - mouse.y) * .03;
                var cur = ACTIVE[activeIdx];
                effects[cur].draw(now, pointer, activity, mouse.x, mouse.y);
            }
            requestAnimationFrame(frame);
        }

        switchTo(0); resetTimer(); requestAnimationFrame(frame);
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { run('hero-particles'); });
    else run('hero-particles');
})();
