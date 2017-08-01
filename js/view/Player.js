// This file is a part of EnkindleReader project.
// Copyright (c) 2017 Aleksander Gajewski <adiog@brainfuck.pl>.

class Player {
    constructor(enkindleController) {
        let that = this;

        this.enkindleController = enkindleController;

        this.dom = $$(div({class: 'ui segment', style: 'position: absolute; bottom: 0; left: 5%; width: 90%'}),
            this.fastBackwardButton = $$(div({class: 'ui button'}), i({class: 'fast backward icon'})),
            this.playButton = $$(div({class: 'ui button'}), i({class: 'play icon'})),
            this.decreaseSpeedButton = $$(button({class: 'ui button'}), i({class: 'minus icon'})),
            $$(div({class: 'ui button'}), this.speedLabel = span()),
            this.increaseSpeedButton = $$(div({class: 'ui button'}), i({class: 'plus icon'})),
            $$(div({class: 'ui button'}), this.timeLabel = span()),
            this.bookLoaderButton = $$$(div({class: 'ui button'}), 'add book'),
//            this.libraryLoaderButton = $$$(div({class: 'ui button'}), 'library'),
            this.progressBar = div({class: 'ui range'})
            //this.displayRangeBar = div({class: 'ui range'}),
        );

        this.bookLoaderButton.addEventListener('click', function(){$(that.enkindleController.bookLoader.getDom()).toggle();});
        //this.libraryLoaderButton.addEventListener('click', function(){$(that.enkindleController.contextManager.getDom()).toggle();});

        this.redrawProgressBar();
        $(this.displayRangeBar).range({
            min: 1,
            max: 10,
            start: 1,
            smooth: true,
            onChange: function(value) {
                that.updateDisplayRange(Math.round(value));
            }
        });
        this.fastBackwardButton.addEventListener('click', function(){
            that.enkindleController.position = 0;
            that.updateProgressBar();
        });
        this.playButton.addEventListener('click', function(){
            that.enkindleController.isPlaying = !that.enkindleController.isPlaying;
        });
        this.increaseSpeedButton.addEventListener('click', function(){
            that.enkindleController.lineReader.changeSpeed(10);
        });
        this.decreaseSpeedButton.addEventListener('click', function(){
            that.enkindleController.lineReader.changeSpeed(-10);
        });
    }

    redrawProgressBar() {
        let that = this;
        $(this.progressBar).range({
            min: 0,
            max: that.enkindleController.lineReader.textArray.length,
            start: 0,
            smooth: true,
            onChange: function (value) {
                that.updatePosition(Math.round(value));
            }
        });
    }

    getDom()
    {
        return this.dom;
    }

    refreshTime(){
        let secs = this.enkindleController.lineReader.textArray.length / this.enkindleController.lineReader.speedWordsPerMinute * 60;
        let currentSecond = this.enkindleController.position / this.enkindleController.lineReader.speedWordsPerMinute * 60;
        this.timeLabel.innerHTML = Math.round(currentSecond) + '/' + Math.round(secs) + 's';
    }

    updateDisplayRange(range)
    {
        this.enkindleController.words = range;
        this.enkindleController.lineReader.refresh(this.enkindleController.position);
    }

    updateProgressBar()
    {
        $(this.progressBar).range('set value', Math.round(this.enkindleController.lineReader.textArray.length * this.enkindleController.position / (this.enkindleController.lineReader.textArray.length - 1)));
    }

    updatePosition(position)
    {
        this.enkindleController.position = position;
        this.enkindleController.lineReader.refresh(position);
    }
}