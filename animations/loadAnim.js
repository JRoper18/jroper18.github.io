import ThreeBody from './3body.js'
import Conway from './conway.js'
import SquareMarkov from './squaremarkov.js';

export default function loadAnim(anim, displayElement, textElement){
    var animation = null;
    if(window.animation != undefined){
        window.animation.destroy();
    }
    switch (anim) {
        case '3body':
            animation = new ThreeBody();
            break;
        case 'conway':
            animation = new Conway();
            break;
        case 'squaremarkov': 
            animation = new SquareMarkov();
        default:
    }
    console.log("Loading animation " + anim);
    animation.load(displayElement);
    animation.setup();
    $( document ).ready(function() {
        if(window.isMobile){
            displayElement.addEventListener("click", function(){
                animation.tap()
            })
            displayElement.addEventListener("touchstart", function(){
                animation.tap()
            })
            //Also, change the reset text.
            document.getElementById("resetText").innerHTML = "Double-tap to reset. "
        }
        else{
            displayElement.addEventListener("click", function(){
                animation.reset()
            })
        }
        window.onresize = function(event){
            animation.onresize(displayElement.clientWidth, displayElement.clientHeight);
        }
        animation.start();
    })
    window.animation = animation;
    //Load the animation explanation into it.
    textElement.innerHTML = animation.text();			
}

