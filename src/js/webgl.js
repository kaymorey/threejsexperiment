var Webgl = (function(){

    function Webgl(width, height){
        webgl = this;

        // Basic three.js setup
        this.scene = new THREE.Scene();
        
        this.camera = new THREE.PerspectiveCamera(50, width / height, 1, 10000);
        this.camera.position.z = 300;

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(width, height);
        this.renderer.setClearColor(0x19bec0);

        this.composer = new THREE.EffectComposer(this.renderer);
        this.composer.addPass(new THREE.RenderPass(this.scene, this.camera));

        // Glitch Effect
        glitchPass = new THREE.GlitchPass();
        glitchPass.renderToScreen = true;
        this.composer.addPass(glitchPass);
        this.glichEffect = false;

        // Lights
        this.light = new THREE.PointLight(0xffffff, 100, 1200);
        this.light.position.set(0, 0, 350);
        this.scene.add(this.light);

        this.ambientLight = new THREE.AmbientLight(0x666666);
        this.scene.add(this.ambientLight);

        // Global variables
        this.mouse = { x: 0, y: 0 };
        this.INTERSECTED;

        this.counter = 200;
        this.hoverInteraction = false;
        this.spreadParticles = false;

        // Cube Manager
        this.cubeManager = new CubeManager();
        // Display first cube
        this.cubeManager.animateFirstSquare();
        

        $(document).on('click', 'a.next', function(e) {
            e.preventDefault();
            $(this).fadeOut();
            $('h1.first').fadeOut();
            $('h1.second').fadeIn('slow');
            window.setTimeout(function() {
                $('h1.second').fadeOut('slow', function() {
                    $('h1.third').fadeIn();
                    webgl.cubeManager.addZCubes();
                    window.setTimeout(function() {
                        $('h1.third').fadeOut('slow');
                    }, 3000);
                });   
            }, 1000);         
        });

        //Haut, haut, bas, bas, gauche, droite, gauche, droite, B, A  
        /*var k = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65],  
        n = 0;  
        $(document).keydown(function (e) {  
            if (e.keyCode === k[n++]) {  
                if (n === k.length) {  
                    alert('Konami !!!'); // à remplacer par votre code  
                    return !1  
                }  
            } else k = 0  
        }); */
    }

    Webgl.prototype.awayCamera = function() {
        TweenLite.to(webgl.camera.position, 0.8, {z: 1000, ease: Expo.easeOut, onComplete: function() {
            webgl.cubeManager.displayHorizontalCubes();
            webgl.cubeManager.popCubes(3, 8);
            webgl.cubeManager.popCubes(9, 14);
            webgl.cubeManager.displayVerticalCubes();
            webgl.hoverInteraction = true;
            window.setTimeout(function() {
                $('div.title').fadeIn('slow');
            }, 2000);
            
        }});
    };

    Webgl.prototype.moveLight = function() {
        TweenLite.to(this.light.position, 1, {x: 0, y: -100, z: 50});
        this.light.intensity = 200;
    }

    Webgl.prototype.resize = function(width, height) {
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    };

    Webgl.prototype.render = function() {    
        this.renderer.render(this.scene, this.camera);

        if (this.spreadParticles) {
            this.cubeParticles.update();
        }

        if (this.glichEffect) {
            this.composer.render();
        }

        if (this.hoverInteraction) {
            this.cubesHoverEffects();
        }
        if (this.cubeManager.cubesRotation) {
            this.cubeManager.rotateCubes();
        }
    };

    Webgl.prototype.cubesHoverEffects = function() {
        // find intersections

        // create a Ray with origin at the mouse position
        //   and direction into the scene (camera direction)
        var vector = new THREE.Vector3(this.mouse.x, this.mouse.y, 1).unproject(this.camera);
        var ray = new THREE.Raycaster(this.camera.position, vector.sub(this.camera.position).normalize());

        // create an array containing all objects in the scene with which the ray intersects
        var intersects = ray.intersectObjects(this.scene.children, true);
        
        // if there is one (or more) intersections
        if (intersects.length > 0)
        {
            // if the closest object intersected is not the currently stored intersection object
            if (intersects[0].object != this.INTERSECTED) 
            {
                if (this.INTERSECTED) {
                    TweenLite.to(this.INTERSECTED.scale, 0.1, {x: 1, y: 1});
                    TweenLite.to(this.INTERSECTED.rotation, 0.1, {z: 0});
                }
                // store reference to closest object as current intersection object
                this.INTERSECTED = intersects[0].object;
                TweenLite.to(this.INTERSECTED.scale, 0.1, {x: 1.4, y: 1.4});
                TweenLite.to(this.INTERSECTED.rotation, 0.1, {z: 10});
            }
        } 
        else // there are no intersections
        {
            if (this.INTERSECTED) {
                TweenLite.to(this.INTERSECTED.scale, 0.3, {x: 1, y: 1});
                TweenLite.to(this.INTERSECTED.rotation, 0.1, {z: 0});
            }

            this.INTERSECTED = null;
        }
    }

    return Webgl;

})();