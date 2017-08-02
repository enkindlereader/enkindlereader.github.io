// This file is a part of EnkindleReader project.
// Copyright (c) 2017 Aleksander Gajewski <adiog@brainfuck.pl>.

class PlayerComponent {
    constructor(enkindleController) {
        let that = this;

        this.enkindleController = enkindleController;

        this.menuDom =
            $$(div({class: 'ui segment', style: 'width: 100%'}),
                $$(div({class: 'ui secondary basic labeled icon button'}),
                    i({class: 'book icon'}),
                    this.context = document.createTextNode('')
                ),
                this.settingsButton = LabeledIconButton('setting', 'Settings', null, 'basic'), //$$(div({class: 'ui button'}), i({class: 'setting icon'})),
                this.bookLoaderButton = LabeledIconButton('upload', 'Load Text', null, 'basic'), //$$$(div({class: 'ui button'}), 'add book'),
                this.libraryLoaderButton = LabeledIconButton('database', 'Library', null, 'basic'), ///$$$(div({class: 'ui button'}), 'library'),
                //this.bookmarkTab = div()
            );

        this.playerDom =
            $$(div({class: 'ui segment', style: 'width: 100%'}),
                    this.fastBackwardButton = IconBasicButton('fast backward'), //$$(div({class: 'ui button'}), i({class: 'fast backward icon'})),
                    this.playButton = IconBasicButton('play'), //$$(div({class: 'ui button'}), i({class: 'play icon'})),
                    this.decreaseSpeedButton = IconBasicButton('minus'), ///$$(button({class: 'ui button'}), i({class: 'minus icon'})),
                    $$(div({class: 'ui basic button'}), this.speedLabel = span()),
                    this.increaseSpeedButton = IconBasicButton('plus'), //$$(div({class: 'ui button'}), i({class: 'plus icon'})),
                    $$(div({class: 'ui basic button'}), this.timeLabel = span())
            );
        //this.displayRangeBar = div({class: 'ui range'}),
       // );

        this.progressDom =
            $$(div({class: 'ui segment', style: 'width: 100%'}),
                this.progressBar = div({class: 'ui range'})
            );

        this.bookLoaderButton.addEventListener('click', function () {
            $(that.enkindleController.loaderComponent.getDom()).toggle();
        });
        this.libraryLoaderButton.addEventListener('click', function () {
            $(that.enkindleController.contextManager.getDom()).toggle();
        });

        this.redrawProgressBar();
        $(this.displayRangeBar).range({
            min: 1,
            max: 10,
            start: 1,
            smooth: true,
            onChange: function (value) {
                that.updateDisplayRange(Math.round(value));
            }
        });
        this.fastBackwardButton.addEventListener('click', function () {
            that.enkindleController.position = 0;
            that.updateProgressBar();
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

        this.settingsButton.addEventListener('click', function () {
            $(that.enkindleController.settingsComponent.getDom()).toggle();
        });
    }

    togglePlay() {
        this.enkindleController.isPlaying = !this.enkindleController.isPlaying;
        this.enkindleController.storeContext();
    }

    redrawProgressBar() {
        let that = this;
        $(this.progressBar).range({
            min: 0,
            max: that.enkindleController.lineReaderComponent.textArray.length,
            start: 0,
            smooth: true,
            onChange: function (value) {
                that.updatePosition(Math.round(value));
            }
        });
    }

    getDom() {
        return this.dom;
    }

    refreshTime() {
        let secs = this.enkindleController.lineReaderComponent.textArray.length / this.enkindleController.context.speed * 60;
        let currentSecond = this.enkindleController.position / this.enkindleController.context.speed * 60;
        this.timeLabel.innerHTML = Math.round(currentSecond) + '/' + Math.round(secs) + 's';
    }

    updateDisplayRange(range) {
        this.enkindleController.words = range;
        this.enkindleController.lineReaderComponent.refresh(this.enkindleController.position);
    }

    updateProgressBar() {
        $(this.progressBar).range('set value', Math.round(this.enkindleController.lineReaderComponent.textArray.length * this.enkindleController.position / (this.enkindleController.lineReaderComponent.textArray.length - 1)));
    }

    updatePosition(position) {
        this.enkindleController.position = position;
        this.enkindleController.lineReaderComponent.refresh(position);
        this.refreshTime();
        this.enkindleController.storeContext();
    }
}