const Plugin = module.parent.require('../Structures/Plugin');


// Utility functions stolen from SO
function evalInContext(js, ctx) {
    return function() { return eval(js); }.call(ctx);
}

function addListeners(){
    document.getElementById('Repl-Div').addEventListener('mousedown', mouseDown, false);
    window.addEventListener('mouseup', mouseUp, false);
}

function mouseUp(){
    window.removeEventListener('mousemove', divMove, true);
}

function mouseDown(e){
  window.addEventListener('mousemove', divMove, true);
}

function divMove(e){
  let div = document.getElementById('Repl-Div');
  div.style.position = 'absolute';
  div.style.top = e.clientY-75 + 'px';
  div.style.left = e.clientX-150 + 'px';
}


class Repl extends Plugin {
    constructor() {
        super({
            author: 'martmists',
            version: '1.1.0',
            description: 'Gives you a REPL in Discord',
            color: '36393e'
        });

        // CSS to make it look fancy
        this.style = document.createElement('style');
        this.style.innerHTML = `
:root{
    --repl-shadow-x: 35px;
    --repl-shadow-y: 35px;
    --repl-shadow-blur: 15px;
}

#Repl-Div {
    position: absolute;
    right: 20vw;
    top: 20vh;
    width: 20vw;
    height: 20vh;
    overflow: hidden;
    background-color: rgba(24, 24, 24, 0.4);
    box-shadow: var(--repl-shadow-x) var(--repl-shadow-y) var(--repl-shadow-blur) rgba(0, 0, 0, 0.4),
                var(--repl-shadow-x) var(--repl-shadow-y) var(--repl-shadow-blur) rgba(255, 255, 255, 0.2) inset;
    z-index: 10;
    border-radius: 20px;
}

#Repl-Input {
    width: 94%;
    background: rgba(255, 255, 255, 0.1);
    border: none;
    color: white;
    font-family: "monospace";
    margin: 3%;
    border-radius: 10px;
    padding-left: 5px;
}

#Repl-Input:focus {
    outline: none;
}

#Repl-Code-Div {
    width: 94%;
    height: 94%;
    margin: 3%;
    margin-top: 1%;
}

#Repl-Code {
    word-wrap: break-word;
    oveflow-y: scroll;
    color: white;
    margin: 2px;
}`;
        document.head.appendChild(this.style);


        // Create all elements
        this.div = document.createElement("div");
        this.div.id = "Repl-Div"
        this.inp = document.createElement("input");
        this.inp.id = "Repl-Input"
        this.sdiv = document.createElement("div");
        this.sdiv.id = "Repl-Code-Div"
        this.code = document.createElement("code");
        this.code.id = "Repl-Code"

        // Context object to be passed around
        this.ctx = {};

        this.sdiv.appendChild(this.code);

        this.div.appendChild(this.inp);
        this.div.appendChild(this.sdiv);

        // Run eval on <enter> press
        this.inp.onkeydown = event => {
            if (event.keyCode == 13) {
                this.runCode();
            }
        }

        this.log("REPL Elements created!");

        document.body.appendChild(this.div);

        addListeners();

        this.log("REPL added!")
    }

    runCode() {
        // Get value and clear result
        let evalText = this.inp.value;
        this.code.innerHTML = '';

        try {
            // Eval, on error, res = error
            // `res` is the latest eval result
            this.ctx.res = evalInContext(evalText, this.ctx);
        } catch(e) {
            this.ctx.res = e;
        }

        // Return the result
        this.code.innerHTML = this.ctx.res;

        this.log(evalText + " -> " + this.code.innerHTML);
    }
}

module.exports = Repl;
