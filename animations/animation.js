class Animation{
    constructor(){
        this.tapedTwice = false;
    }
    mobileReset(){
        throw new Error("You have not implemented a mobile reset method!")
    }
    reset(){
        throw new Error("You have not implemented a reset method!")
    }
    load(element){
        throw new Error("You have not implemented a load method!")
    }
    setup(){
        throw new Error("You have not implemented a setup method!")
    }
    update(delta){
        throw new Error("You have not implemented an update method!")
    }
    onresize(width, height){
        throw new Error("You have not implemented a window resize method!")
    }
    destroy(){
        throw new Error("You have not implemented a destroy method!")
    }
    start(){
        throw new Error("You have not implemented a start method!")
    }
    tap(){
        if(!this.tapedTwice) {
            this.tapedTwice = true;
            setTimeout( function() { this.tapedTwice = false; }, 300 );
            return false;
        }
        event.preventDefault();
        this.mobileReset();
    }
    text() {
        return "Default animation text.";
    }
}