// This file is a part of EnkindleReader project.
// Copyright (c) 2017 Aleksander Gajewski <adiog@brainfuck.pl>.

class Menu {
    constructor(enkindleController) {
        let that = this;

        this.enkindleController = enkindleController;

        this.dom =
            $$(div({class: 'ui segment', style: 'width: 100%'}),
                $$(div({class: 'ui secondary basic labeled icon button'}),
                    i({class: 'book icon'}),
                    this.context = document.createTextNode('')
                ),
                this.settingsButton = LabeledIconButton('setting', 'Settings', null, 'basic'),
                this.bookLoaderButton = LabeledIconButton('upload', 'Load Text', null, 'basic'),
                this.libraryLoaderButton = LabeledIconButton('database', 'Library', null, 'basic'),
            );

        this.bookLoaderButton.addEventListener('click', function () {
            $(that.enkindleController.loaderComponent.getDom()).toggle();
        });

        this.libraryLoaderButton.addEventListener('click', function () {
            $(that.enkindleController.contextManager.getDom()).toggle();
        });

        this.settingsButton.addEventListener('click', function () {
            $(that.enkindleController.settingsComponent.getDom()).toggle();
        });
    }

    getDom() {
        return this.dom;
    }
}