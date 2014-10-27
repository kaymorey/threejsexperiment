var Webgl = (function(){

    function Webgl(width, height){
        // Basic three.js setup
        this.scene = new THREE.Scene();
        
        this.camera = new THREE.PerspectiveCamera(50, width / height, 1, 10000);
        this.camera.position.z = 300;

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(width, height);
        this.renderer.setClearColor(0xebc130);

        // Directly add objects
        // this.someObject = new THREE.Mesh(new THREE.BoxGeometry(50, 50, 50), new THREE.MeshBasicMaterial({color: 0xFF0000, wireframe: true}));
        // this.someObject.position.set(-60, 0, 0);
        // this.scene.add(this.someObject);

        // Or create container classes for them to simplify your code
        // this.triangle = new Triangle();
        // this.triangle.position.set(0, 0, 0);
        // this.scene.add(this.triangle);

        // ---- LINE 1 ----
        var geometry = new THREE.Geometry();
        geometry.vertices.push(new THREE.Vector3(-50, 0, 0));
        geometry.vertices.push(new THREE.Vector3(-50, 0, 0));
        var line = new THREE.Line(geometry, new THREE.LineBasicMaterial({
            color: 0xFFFFFF,
            linewidth: 5
        }));

        // ---- LINE 2 ----
        var geometry2 = new THREE.Geometry();
        geometry2.vertices.push(new THREE.Vector3(50, 0, 0));
        geometry2.vertices.push(new THREE.Vector3(50, 0, 0));
        var line2 = new THREE.Line(geometry2, new THREE.LineBasicMaterial({
            color: 0xFFFFFF,
            linewidth: 5
        }));

        this.scene.add(line); 
        this.scene.add(line2); 

        // using TweenLite to animate
        var tl1 = new TimelineLite();          
        var parameters = { x: 50, y: 0, z:0, ease:Quad.easeIn, delay: 0.3, onUpdate: function() {
            line.geometry.verticesNeedUpdate = true;
        }};
        tl1.add(TweenLite.to(line.geometry.vertices[1] , 1, parameters));
        
        var tl2 = new TimelineLite();
        var parameters2 = { x: 0, y: 71, z:0, ease:Quad.easeIn, delay: 1.3, onUpdate: function() {
            line2.geometry.verticesNeedUpdate = true;
        }};
        tl2.add(TweenLite.to(line2.geometry.vertices[1] , 1, parameters2));
    }

    Webgl.prototype.resize = function(width, height) {
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    };

    Webgl.prototype.render = function() {    
        this.renderer.render(this.scene, this.camera);

        // this.someObject.rotation.y += 0.01;
        // this.someObject.rotation.x += 0.01;

        //this.triangle.update();
    };

    return Webgl;

})();