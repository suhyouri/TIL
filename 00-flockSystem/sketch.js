const flock = [];

let alignSlider, cohensionSlider, seperationSlider;

function setup() {
    createCanvas(640, 360);
    alignSlider = createSlider(0, 5, 1, 0.1);
    for (let i = 0; i < 100; i++){
        flock.push(new Boid());
    }
}

function draw() {
    background(51);

    for (let boid of flock) {
        boid.sepera
        boid.edge();
        boid.flock(flock); 
        boid.update();
        boid.show();
        
    }
}