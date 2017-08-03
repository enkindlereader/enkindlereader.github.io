// This file is a part of EnkindleReader project.
// Copyright (c) 2017 Aleksander Gajewski <adiog@brainfuck.pl>.

class ContextManager {
    constructor(enkindleController, defaultSettings, defaultText, defaultContext) {
        let that = this;

        this.enkindleController = enkindleController;

        this.defaultKey = 'EnkindleReader (default)';
        this.defaultSettings = defaultSettings;
        this.defaultContext = defaultContext;
        this.defaultText = defaultText;

        this.restoreLocalStorage();

        this.dom = this.buildDom();

        this.loadButton.addEventListener('click', function () {
            that.loadButtonCallback();
        });
        this.saveasButton.addEventListener('click', function () {
            that.saveasButtonCallback();
        });
        this.renameButton.addEventListener('click', function () {
            that.renameButtonCallback();
        });
        this.deleteButton.addEventListener('click', function () {
            that.deleteButtonCallback();
        });
        this.resetButton.addEventListener('click', function () {
            that.resetButtonCallback()
        });
    }

    buildDom() {
        let dom = $$(div({class: 'ui segment', style: 'width: 100%'}),
                $$(div(),
                    $$$(span(), 'Current reading context: '),
                    this.keyLabel = span({align: 'center', style: 'width: 100%; font-size: 1.1em; text-align: center; font-weight: bold;'}),
                    $$(this.resetButton = $$$(button({class: 'ui right floated basic negative button'}), 'reset'))
                ),
                $$(table({style: 'width: 100%'}),
                    $$(tr(),
                        $$(td({style: 'width: 50%'}),
                            this.select = select({style: 'width: 100%;'})
                        ),
                        $$(td({style: 'width: 25%'}),
                            $$(this.loadButton = $$$(button({class: 'ui basic button', style: 'width: 100%'}), 'load'))
                        ),
                        $$(td({style: 'width: 25%'}),
                            $$(this.deleteButton = $$$(button({class: 'ui basic button', style: 'width: 100%'}), 'delete'))
                        )
                    ),
                    $$(tr(),
                        $$(td({style: 'width: 50%'}),
                            this.newLabel = input({style: 'width: 90%;', type: 'text'})
                        ),
                        $$(td({style: 'width: 25%'}),
                            $$(this.saveasButton = $$$(button({class: 'ui basic button', style: 'width: 100%; font-size: 0.9em;'}), 'save as'))
                        ),
                        $$(td({style: 'width: 25%'}),
                            $$(this.renameButton = $$$(button({class: 'ui basic button', style: 'width: 100%'}), 'rename'))
                        )
                    )
                ),
        );

        this.updateDom();

        return dom;
    }

    updateDom() {
        this.keyLabel.innerHTML = this.selectedKey;
        this.newLabel.value = '';
        this.buildSelectDom();
    }

    addSelectOption(label, selected) {
        let selectNode = $$$(option({'value': label}), label);
        if (label === selected) {
            selectNode.selected = true;
        }
        this.select.appendChild(selectNode);
        return selectNode;
    }

    buildSelectDom() {
        this.select.innerHTML = '';
        let labels = []
        for (let label in this.contextCollection) {
            labels.push(label);
        }
        labels.sort();
        for (let labelIndex in labels) {
            let selectNode = this.addSelectOption(labels[labelIndex], this.selectedKey);
        }
    }

    getDom() {
        return this.dom;
    }

    loadButtonCallback() {
        let selectedIndex = this.select.selectedIndex;
        let option = this.select.options[selectedIndex];
        let key = option.value;

        this.storeLocalStorage(true);
        this.selectedKey = key;
        this.storeLocalStorage(true);
        location.reload();
    }

    saveasButtonCallback() {
        let newKey = this.newLabel.value;
        if ((newKey !== '') && (newKey !== this.defaultKey)) {
            this.contextCollection[newKey] = copy(this.contextCollection[this.selectedKey]);
            this.textCollection[newKey] = this.textCollection[this.selectedKey];
            this.selectedKey = newKey;
            this.storeLocalStorage(true);
            location.reload();
        }
    }

    renameButtonCallback() {
        let newKey = this.newLabel.value;
        if ((this.selectedKey !== this.defaultKey) && (newKey !== '') && (newKey !== this.defaultKey)) {
            this.contextCollection[newKey] = copy(this.contextCollection[this.selectedKey]);
            delete this.contextCollection[this.selectedKey];
            this.textCollection[newKey] = this.textCollection[this.selectedKey];
            delete this.textCollection[this.selectedKey];
            this.selectedKey = newKey;
            this.storeLocalStorage(true);
            location.reload();
        }
    }

    deleteButtonCallback() {
        let selectedIndex = this.select.selectedIndex;
        let option = this.select.options[selectedIndex];
        let key = option.value;

        if (key !== this.defaultKey) {
            if (confirm("Proceed with deleting context?")) {
                delete this.contextCollection[this.selectedKey];
                delete this.textCollection[this.selectedKey];
                this.selectedKey = this.defaultKey;
                this.storeLocalStorage(true);
                location.reload();
            }
        }
    }

    resetButtonCallback() {
        if (confirm('This action will delete all books that have been uploaded. Continue?')) {
            this.resetLocalStorage();
            location.reload();
        }
    }

    storeText(text)
    {
        if (this.enkindleController.isLoaded) {
            this.textCollection[this.selectedKey] = text;
            localStorage.textCollection = JSON.stringify(this.textCollection);
        }
    }

    restoreText()
    {
        return this.textCollection[this.selectedKey];
    }

    storeContext(context){
        if (this.enkindleController.isLoaded) {
            this.contextCollection[this.selectedKey] = copy(context);
            localStorage.contextCollection = JSON.stringify(this.contextCollection);
        }
    }

    restoreContext()
    {
        return copy(this.contextCollection[this.selectedKey]);
    }

    storeSettings(settings){
        if (this.enkindleController.isLoaded) {
            this.settings = copy(settings);
            localStorage.settings = JSON.stringify(settings);
        }
    }

    restoreSettings()
    {
        return copy(this.settings);
    }

    restoreLocalStorage() {
        if (typeof(Storage) !== "undefined") {
            if (localStorage.selectedKey) {
                this.selectedKey = localStorage.selectedKey;
                this.settings = JSON.parse(localStorage.settings);
                this.textCollection = JSON.parse(localStorage.textCollection);
                this.contextCollection = JSON.parse(localStorage.contextCollection);
            }
            else {
                this.selectedKey = this.defaultKey;
                this.settings = this.defaultSettings;
                this.textCollection = {};
                this.textCollection[this.selectedKey] = this.defaultText;
                this.contextCollection = {};
                this.contextCollection[this.selectedKey] = this.defaultContext;

                this.storeLocalStorage(true);
            }
        }
    }

    storeLocalStorage(force){
        if ((this.enkindleController.isLoaded || force) && (typeof(Storage) !== "undefined")) {
            localStorage.selectedKey = this.selectedKey;
            localStorage.textCollection = JSON.stringify(this.textCollection);
            localStorage.contextCollection = JSON.stringify(this.contextCollection);
            localStorage.settings = JSON.stringify(this.settings);
        }
    }

    resetLocalStorage() {
        if (typeof(Storage) !== "undefined") {
            localStorage.clear();
        }
    }
}