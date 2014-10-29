var Cube = (function(){

    function Cube(width, height, depth){
        THREE.Object3D.call(this);

        var geometry = new THREE.BoxGeometry(width, height, depth);
        var material = new THREE.MeshLambertMaterial({ color: 0xffffff})

        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.set(0, 0, 0);
        //this.mesh.rotation.x = 10;
        this.add(this.mesh);
    }

    Cube.prototype = new THREE.Object3D;
    Cube.prototype.constructor = Cube;

    Cube.prototype.update = function() {
        //this.mesh.rotation.z += 0.01;
    };

    return Cube;
})();