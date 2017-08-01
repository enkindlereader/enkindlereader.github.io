// This file is a part of EnkindleReader project.
// Copyright (c) 2017 Aleksander Gajewski <adiog@brainfuck.pl>.

class BookLoader {
    constructor(enkindleController) {
        let that = this;
        this.enkindleController = enkindleController;

        this.dom = $$(div({class: 'ui segment', style: 'position: absolute; top: 2%; left: 5%; width: 40%;'}),
            $$(table({style: 'width: 100%'}),
                $$(tr(),
                    $$(td({style: 'width: 20%'}), $$$(span(), 'Paste text:')),
                    $$(td({style: 'width: 50%'}), this.rawInput = input({type: 'text', style: 'width: 95%'})),
                    $$(td({style: 'width: 30%'}), this.rawInputButton = $$$(button({style: 'width: 100%'}), 'load pasted text'))
                ),
                $$(tr(),
                    $$(td(), $$$(span(), 'Provide URL:')),
                    $$(td(), this.urlInput = $$(input({type: 'text', style: 'width: 95%'}))),
                    $$(td(), this.loadUrlButton = $$$(button({style: 'width: 100%'}), 'load text from url'))
                ),
                $$(tr(),
                    $$(td(), $$$(span(), 'Upload file:')),
                    $$(td(), this.fileInput = $$(input({type: 'file'}))),
                    $$(td(), this.loadButton = $$$(button({style: 'width: 100%'}), 'load text from disk'))
                )
            )
        );
        this.rawInputButton.addEventListener('click', function () {
            that.enkindleController.lineReader.load(that.rawInput.value);
        });
        this.loadButton.addEventListener('click', function () {
            if (!window.FileReader) {
                alert('Your browser is not supported')
            }
            var input = $(that.fileInput).get(0);

            // Create a reader object
            var reader = new FileReader();
            if (input.files.length) {
                var textFile = input.files[0];
                reader.readAsText(textFile);
                $(reader).on('load', function (e) {
                    that.processFile(e);
                });
            } else {
                alert('Please upload a file before continuing')
            }
        });
        this.urlInput.value = 'http://enkindlereader.github.io/books/CrimeAndPunishment.txt';
        this.loadUrlButton.addEventListener('click',
            function(){
                let url = that.urlInput.value;
                $.ajax({
                    dataType : 'text',
                    url : url,
                    success : function(text) { that.enkindleController.lineReader.load(text); },
                    async : false
                });
            });

    }

    processFile(e) {
        var file = e.target.result,
            results;
        if (file && file.length) {
            results = file.replace(/\n/g, ' ');
            console.log(results);
            this.enkindleController.lineReader.load(results);
        }
    }

    getDom()
    {
        return this.dom;
    }
}