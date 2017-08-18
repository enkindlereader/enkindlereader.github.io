// This file is a part of EnkindleReader project.
// Copyright (c) 2017 Aleksander Gajewski <adiog@brainfuck.pl>.

class Bookmark {
    constructor(enkindleController, label, position) {
        let that = this;

        this.enkindleController = enkindleController;

        this.label = label;
        this.position = position;

        this.dom = $$(div({class: 'ui basic button', style: 'text-align: left;'}),
            this.icon = i({class: this.label + ' icon'}),
            this.trash = i({class: 'delete icon'})
        );

        this.trash.addEventListener('click', function () {
            that.removeBookmark();
        });
        this.icon.addEventListener('click', function () {
            that.setPosition();
        });
    }

    getDom() {
        return this.dom;
    }

    setPosition() {
        this.enkindleController.setPosition(this.position);
    }

    removeBookmark() {
        this.dom.parentNode.removeChild(this.dom);
        this.enkindleController.removeBookmark(this.label);
    }
}