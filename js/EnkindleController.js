// This file is a part of EnkindleReader project.
// Copyright (c) 2017 Aleksander Gajewski <adiog@brainfuck.pl>.

class EnkindleController {
    constructor() {
        let that = this;

        this.position = 0;
        this.words = 1;
        this.isPlaying = false;
/*
        this.resizeDelayAction = new DelayAction(
            function () {
                that.doResize();
            },
            null, 300, 100, null
        );

        window.onresize = function (event) {
            that.resizeDelayAction.restart();
        };

        this.refreshDelayAction = new DelayAction(
            function () {
                that.doRefresh();
            },
            null, 300, 100, null
        );
*/


        this.contextManager = new ContextManager({text: '', position: 0});
        this.contextManager.setRefreshCallback(function(){
           that.doRefresh();
        });
        document.body.appendChild(this.contextManager.getDom());

        this.lineReader = new LineReader(this);
        document.body.appendChild(this.lineReader.getDom());

        this.player = new Player(this);
        document.body.appendChild(this.player.getDom());
        this.lineReader.changeSpeed(0);

        this.bookLoader = new BookLoader(this);
        document.body.appendChild(this.bookLoader.getDom());

        this.lineReader.load('CRIME AND PUNISHMENT CHAPTER I ' +
            'On an exceptionally hot evening early in July a young man came out of the garret in which he lodged in S. Place and walked slowly, as though in hesitation, towards K. bridge. ' +
            'He had successfully avoided meeting his landlady on the staircase. His garret was under the roof of a high, five-storied house and was more like a cupboard than a room. The landlady who provided him with garret, dinners, and attendance, lived on the floor below, and every time he went out he was obliged to pass her kitchen, the door of which invariably stood open. And each time he passed, the young man had a sick, frightened feeling, which made him scowl and feel ashamed. He was hopelessly in debt to his landlady, and was afraid of meeting her. ' +
            'This was not because he was cowardly and abject, quite the contrary; but for some time past he had been in an overstrained irritable condition, verging on hypochondria. He had become so completely absorbed in himself, and isolated from his fellows that he dreaded meeting, not only his landlady, but anyone at all. He was crushed by poverty, but the anxieties of his position had of late ceased to weigh upon him. He had given up attending to matters of practical importance; he had lost all desire to do so. Nothing that any landlady could do had a real terror for him. But to be stopped on the stairs, to be forced to listen to her trivial, irrelevant gossip, to pestering demands for payment, threats and complaints, and to rack his brains for excuses, to prevaricate, to lie—no, rather than that, he would creep down the stairs like a cat and slip out unseen. ' +
            'This evening, however, on coming out into the street, he became acutely aware of his fears. ' +
            'TO CONTINUE PLEASE LOAD A BOOK WITH \'add book\' BUTTON');

        $(this.bookLoader.getDom()).toggle();
        $(this.contextManager.getDom()).toggle();

        document.body.onkeyup = function(e){
            if(e.keyCode == 32){
                that.player.togglePlay();
            }
        }

        this.lineReader.play();
    }

    resize() {
        this.resizeDelayAction.restart();
    }

    doResize() {
        let pattern = Trianglify({
            width: window.innerWidth,
            height: window.innerHeight
        });
        if (typeof this.background !== 'undefined') {
            this.background.parentNode.removeChild(this.background);
        }
        this.background = pattern.canvas();
        this.background.style = 'position: fixed; left: 0px; top: 0px; z-index: -1; opacity: 0.4;';
        document.body.appendChild(this.background);
        this.doRefresh();
    }

    refresh() {
        this.refreshDelayAction.restart();
    }

    doRefresh() {
        this.contextManager.storeContext();
    }
}