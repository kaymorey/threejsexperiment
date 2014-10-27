var Triangle = (function(){

    function Triangle(){
        THREE.Object3D.call(this);

        var geometry = new THREE.TetrahedronGeometry(70, 0);

        //geometry.faces[0].color.setHex(0x888888);

        for ( var i = 0; i < geometry.faces.length; i ++ ) {
            geometry.faces[ i ].color.setHex( Math.random() * 0xffffff );
        }

        var material = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            vertexColors: THREE.FaceColors
        });

        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.rotation.y = Math.PI/4;
        this.mesh.rotation.x = Math.PI;
        this.add(this.mesh);
    }

    Triangle.prototype = new THREE.Object3D;
    Triangle.prototype.constructor = Triangle;

    Triangle.prototype.update = function() {
        //this.mesh.rotation.x += 0.01;
    };

    return Triangle;
})();