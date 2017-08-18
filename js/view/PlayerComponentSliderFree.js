// This file is a part of EnkindleReader project.
// Copyright (c) 2017 Aleksander Gajewski <adiog@brainfuck.pl>.

class PlayerComponent {
    constructor(enkindleController) {
        let that = this;

        this.enkindleController = enkindleController;

        this.dom =
            $$(div({class: 'ui segment', style: 'width: 100%'}),
                this.fastBackwardButton = Button('fast backward'),
                this.playButton = Button('play'),
                this.decreaseSpeedButton = Button('minus'),
                this.speedLabel = Button('speed'),
                this.increaseSpeedButton = Button('plus'),
                this.timeLabel = Button('time')
            );

        this.fastBackwardButton.addEventListener('click', function () {
            that.enkindleController.context.position = 0;
            that.enkindleController.doSetPosition(0);
        });

        this.playButton.addEventListener('click', function () {
            that.togglePlay();
        });

        this.increaseSpeedButton.addEventListener('click', function () {
            that.enkindleController.lineReaderComponent.changeSpeed(10);
        });

        this.decreaseSpeedButton.addEventListener('click', function () {
            that.enkindleController.lineReaderComponent.changeSpeed(-10);
        });
    }

    getDom() {
        return this.dom;
    }

    togglePlay() {
        this.enkindleController.isPlaying = !this.enkindleController.isPlaying;
        this.enkindleController.storeContext();
    }

    redrawProgressBar() {
        //let that = this;
        //that.enkindleController.doSetPosition(this.enkindleController.context.position);
        /*
        $(this.progressBar).range({
            min: 0,
            max: that.enkindleController.lineReaderComponent.textArray.length,
            start: 0,
            smooth: true,
            onChange: function (value) {
                if (that.enkindleController.isLoaded) {
                    that.enkindleController.doSetPosition(value);
                }
            }
        });*/
    }

    updateTimeButton() {
        let secs = this.enkindleController.lineReaderComponent.textArray.length / this.enkindleController.context.speed * 60;
        let currentSecond = this.enkindleController.position / this.enkindleController.context.speed * 60;
        this.timeLabel.innerHTML = Math.round(currentSecond) + '/' + Math.round(secs) + 's';
    }

    updateProgressBar(position) {
        //$(this.progressBar).range('set value', this.enkindleController.context.position);
        this.enkindleController.doSetPosition(position);

    }
}