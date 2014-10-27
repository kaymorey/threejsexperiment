var webgl, gui;

$(document).ready(init);

function init(){
    webgl = new Webgl(window.innerWidth, window.innerHeight);
    $('.three').append(webgl.renderer.domElement);

    gui = new dat.GUI();
    // gui.add(webgl.triangle.rotation, 'x').min(-Math.PI).max(Math.PI);
    // gui.add(webgl.triangle.rotation, 'y').min(-Math.PI).max(Math.PI);
    // gui.add(webgl.triangle.rotation, 'z').min(-Math.PI).max(Math.PI);
    gui.close();

    $(window).on('resize', resizeHandler);

    animate();
}

function resizeHandler() {
    webgl.resize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    webgl.render();
}