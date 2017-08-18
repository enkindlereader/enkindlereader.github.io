// This file is a part of EnkindleReader project.
// Copyright (c) 2017 Aleksander Gajewski <adiog@brainfuck.pl>.

class LineReaderComponent {
    constructor(enkindleController) {
        this.enkindleController = enkindleController;

        this.dom = $$(div({style: 'position: absolute; z-index: -1; top: 40%; left: 10%; width: 80%; font-family: monospace; padding: 0.5em; border-top: 1px solid black; border-bottom: 1px solid black;'}),
            this.leadingLetters = span({style: 'color: lightgray;'}),
            this.leadingWord = span({style: 'color: black;'}),
            this.centerLetter = span({style: 'color: darkorange;'}),
            this.trailingWord = span({style: 'color: black;'}),
            this.trailingLetters = span({style: 'color: lightgray;'})
        );
        this.recalculateSpeed();
        this.inactiveTimeout = 1000;
        this.spaces = Array(99).join(' ');

        this.textArray = [];
    }

    recalculateSpeed() {
        this.wordTimeout = 60000.0 / this.enkindleController.context.speed;
    }

    sanitizeText(text) {
        /*console.log(text);
        let sanitizedText = text.replace(/\n/mg, ' ')
                                .replace(/\t/mg, ' ')
                                .replace(/  /mg, ' ')
                                .replace(/[^\x20-\x7E]+/g, '')
                                .replace(/^ \/g, '')
                                .replace(/ *$/g, '');
        console.log(sanitizedText);*/
        return text;
    }

    sanitizeTextArray(textArray) {
        for (let index in textArray) {
            if ((typeof textArray[index]) !== 'string') {
                textArray[index] = ' ';
            }
        }
        return textArray;
    }

    load(text) {
        this.text = this.sanitizeText(text);
        this.textArray = this.sanitizeTextArray(text.split(' '));
        this.enkindleController.playerComponent.redrawProgressBar();
        this.enkindleController.playerComponent.updateTimeButton();
    }

    underscore(letter) {
        if (letter == ' ') {
            return '_';
        } else {
            return letter;
        }
    }

    refresh(positionArg) {
        let position = positionArg;
        if (position < this.textArray.length) {
            this.enkindleController.context.position = position;

            console.log(this.enkindleController.position);
            console.log(this.enkindleController.context.position);

            let leadingLetters = this.enkindleController.settings.radius;
            let trailingLetters = Math.round(1.5 * leadingLetters);
            let word = this.textArray[position];
            if (!(word.length > 0)) {
                word = '_';
            }
            /*
            let wordShift = 1;
            while((position+wordShift < this.textArray.length) && (wordShift < this.enkindleController.words))
            {
                word = word + ' ' + this.textArray[position+wordShift];
                wordShift++;
            }*/
            let highlightedLetterPostition = Math.round(word.length * 0.3);
            let leadingWordLength = highlightedLetterPostition;
            let trailingWordLength = word.length - leadingWordLength - 1;
            let leadingWord = word.substr(0, highlightedLetterPostition);
            let trailingWord = word.substr(highlightedLetterPostition + 1);

            this.leadingWord.innerHTML = leadingWord;
            this.centerLetter.innerHTML = this.underscore(word[highlightedLetterPostition]);
            this.trailingWord.innerHTML = trailingWord;

            let paddingFront = this.getWords(leadingLetters - leadingWordLength, position - 1, -1);
            this.leadingLetters.innerHTML = paddingFront.replace(/ /g, '&nbsp;');
            //position += wordShift - 1;
            this.trailingLetters.innerHTML = this.getWords(trailingLetters - trailingWordLength, position + 1, 1);
        }
        else {
            this.postPlay();
        }
    }

    isInBounds(position) {
        return ((position >= 0) && (position < this.textArray.length));
    }

    getWords(remainingLetters, startingPosition, direction) {
        let returnString = '';
        let position = startingPosition;
        while (this.isInBounds(position) && (remainingLetters >= 1 + this.textArray[position].length)) {
            if (direction > 0) {
                returnString = returnString + ' ' + this.textArray[position];
            }
            else {
                returnString = this.textArray[position] + ' ' + returnString;
            }
            remainingLetters -= (this.textArray[position].length + 1);
            position += direction;
        }
        if ((direction < 0) && (remainingLetters > 0)) {
            // console.log(remainingLetters);
            returnString = this.spaces.substr(-remainingLetters) + returnString;
        }
        return returnString;
    }

    play() {
        let that = this;

        if ((this.enkindleController.isPlaying) && (this.enkindleController.position < this.textArray.length)) {
            this.enkindleController.position += 1;
            this.enkindleController.doSetPosition(this.enkindleController.position);
            this.refresh(this.enkindleController.position);
            this.enkindleController.playerComponent.updateTimeButton();
            setTimeout(function () {
                that.play();
            }, this.wordTimeout);
        }
        else {
            if (this.enkindleController.isPlaying) {
                this.postPlay();
            }
            this.enkindleController.isPlaying = false;
            setTimeout(function () {
                that.play();
            }, this.inactiveTimeout);
        }
    }

    changeSpeed(relativeSpeed) {
        this.enkindleController.context.speed += relativeSpeed;
        this.enkindleController.playerComponent.speedLabel.innerHTML = this.enkindleController.context.speed + 'wpm';
        this.recalculateSpeed();
        this.enkindleController.playerComponent.updateTimeButton();
        this.enkindleController.storeContext();
    }

    postPlay() {
        let post = this.leadingLetters.innerHTML +
            this.leadingWord.innerHTML +
            this.centerLetter.innerHTML +
            this.trailingWord.innerHTML +
            this.trailingLetters.innerHTML;
        this.leadingLetters.innerHTML = '';
        this.leadingWord.innerHTML = '';
        this.centerLetter.innerHTML = '';
        this.trailingWord.innerHTML = '';
        this.trailingLetters.innerHTML = post;
    }

    getDom() {
        return this.dom;
    }
}