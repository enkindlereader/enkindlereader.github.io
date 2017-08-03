// This file is a part of EnkindleReader project.
// Copyright (c) 2017 Aleksander Gajewski <adiog@brainfuck.pl>.

class EnkindleController {
    constructor() {
        let that = this;

        /*
        this.position = 0;
        this.words = 1;
        this.isPlaying = false;

        this.bookmarks = {};

        this.fontSize = '2.0';
        this.radius = 20;
        this.showRadius = true;
        */

        this.dom = $$(div(),
            this.topSegment = $$(div({style: 'position: absolute; top: 2%; left: 5%; width: 90%;'}),
                this.menuSegment = div(),
                this.bookmarksSegment = div(),
                this.loaderSegment = div(),
                this.contextSegment = div(),
                this.settingsSegment = div()
            ),
            this.middleSegment = $$(div({style: 'position: absolute; top: 45%; left: 5%; width: 90%;'}),
                this.lineReaderSegment = div()
            ),
            this.bottomSegment = $$(div({
                    class: 'ui segment',
                    style: 'position: absolute; bottom: 2%; left: 5%; width: 90%;'
                }),
                this.playerButtonsSegment = div(),
                this.progressSegment = div()
            )
        );

        document.body.appendChild(this.dom);

        let defaultText = 'CRIME AND PUNISHMENT CHAPTER I ' +
            'On an exceptionally hot evening early in July a young man came out of the garret in which he lodged in S. Place and walked slowly, as though in hesitation, towards K. bridge. ' +
            'He had successfully avoided meeting his landlady on the staircase. His garret was under the roof of a high, five-storied house and was more like a cupboard than a room. The landlady who provided him with garret, dinners, and attendance, lived on the floor below, and every time he went out he was obliged to pass her kitchen, the door of which invariably stood open. And each time he passed, the young man had a sick, frightened feeling, which made him scowl and feel ashamed. He was hopelessly in debt to his landlady, and was afraid of meeting her. ' +
            'This was not because he was cowardly and abject, quite the contrary; but for some time past he had been in an overstrained irritable condition, verging on hypochondria. He had become so completely absorbed in himself, and isolated from his fellows that he dreaded meeting, not only his landlady, but anyone at all. He was crushed by poverty, but the anxieties of his position had of late ceased to weigh upon him. He had given up attending to matters of practical importance; he had lost all desire to do so. Nothing that any landlady could do had a real terror for him. But to be stopped on the stairs, to be forced to listen to her trivial, irrelevant gossip, to pestering demands for payment, threats and complaints, and to rack his brains for excuses, to prevaricate, to lie—no, rather than that, he would creep down the stairs like a cat and slip out unseen. ' +
            'This evening, however, on coming out into the street, he became acutely aware of his fears.';

        let defaultSettings = {
            fontSize: 2.0,
            showRadius: true,
            radius: 30
        };

        let defaultContext = {
            position: 0,
            speed: 300,
            bookmarks: {}
        };

        this.contextManager = new ContextManager(this, defaultSettings, defaultText, defaultContext);

        this.settings = this.contextManager.restoreSettings();
        this.context = this.contextManager.restoreContext();
        this.text = this.contextManager.restoreText();

        this.menuComponent = new Menu(this);
        this.menuSegment.appendChild(this.menuComponent.getDom());

        this.bookmarksComponent = new BookmarksComponent(this, []);
        this.menuComponent.getDom().appendChild(this.bookmarksComponent.addBookmarkButton);
        this.bookmarksSegment.appendChild(this.bookmarksComponent.getDom());
        if (!this.hasBookmarks()) {
            $(this.bookmarksSegment).toggle();
        } else {
            this.bookmarksComponent.refresh();
        }

        this.settingsComponent = new SettingsComponent(this);
        this.settingsSegment.appendChild(this.settingsComponent.getDom());

        this.settings = this.contextManager.restoreSettings();
        this.settingsComponent.refresh();

        this.loaderComponent = new LoaderComponent(this);
        this.loaderSegment.appendChild(this.loaderComponent.getDom());
        $(this.loaderComponent.getDom()).toggle();

        this.contextSegment.appendChild(this.contextManager.getDom());
        $(this.contextManager.getDom()).toggle();

        this.lineReaderComponent = new LineReaderComponent(this);
        this.lineReaderSegment.appendChild(this.lineReaderComponent.getDom());

        this.playerComponent = new PlayerComponent(this);
        this.playerButtonsSegment.appendChild(this.playerComponent.playerDom);
        this.progressSegment.appendChild(this.playerComponent.progressDom);

        this.menuComponent.context.nodeValue = this.contextManager.selectedKey;
        this.settingsComponent.refresh();

        this.lineReaderComponent.load(this.text);

        this.context = this.contextManager.restoreContext();
        this.lineReaderComponent.changeSpeed(0);
        this.playerComponent.updatePosition(this.context.position);

        this.restoreText();
        this.restoreContext();
        this.restoreSettings();

        this.addTogglePlayEventListeners();
        this.lineReaderComponent.play();
        $(this.settingsComponent.getDom()).toggle();
        this.isLoaded = true;
    }

    addTogglePlayEventListeners() {
        let that = this;
        document.body.onkeyup = function (e) {
            if (e.keyCode === 32) {
                that.playerComponent.togglePlay();
            }
        };
        /*
        document.body.ontouchend = function (e) {
            that.playerComponent.togglePlay();
        };*/
    }

    hasBookmarks() {
        let existingBookmarksCount = Object.keys(this.context.bookmarks).length;
        return (existingBookmarksCount !== 0);
    }

    removeBookmark(label) {
        console.log('trying to remove bookmark: ' + label);
        delete this.context.bookmarks[label];

        if (!(this.hasBookmarks())) {
            $(this.bookmarksSegment).toggle();
        }

        this.storeContext();
    }

    setPosition(position) {
        console.log('trying to set position: ' + position);
        this.lineReaderComponent.recalculateSpeed();
        this.playerComponent.updatePosition(position);
        this.playerComponent.updateProgressBar();
    }

    addBookmarkToContext(label, position) {
        this.context.bookmarks[label] = position;
        this.storeContext();
    }

    getBookmarks() {
        return this.bookmarks;
    }

    setFontSize(fontSize) {
        this.settings.fontSize = fontSize;
        if (this.lineReaderComponent) {
            this.lineReaderComponent.getDom().style.fontSize = fontSize + 'em';
        }
    }

    setRadius(radius) {
        this.settings.radius = radius;
        if (this.lineReaderComponent) {
            this.lineReaderComponent.refresh(this.position);
        }
    }

    toggleRadius(showRadius = null) {
        if (showRadius === null) {
            this.settings.showRadius = !this.settings.showRadius;
        }
        else {
            this.settings.showRadius = showRadius;
        }
        if (this.lineReaderComponent) {
            if (this.settings.showRadius) {
                this.lineReaderComponent.leadingLetters.style.visibility = 'visible';
                this.lineReaderComponent.trailingLetters.style.visibility = 'visible';
            }
            else {
                this.lineReaderComponent.leadingLetters.style.visibility = 'hidden';
                this.lineReaderComponent.trailingLetters.style.visibility = 'hidden';
            }
        }
    }

    storeText() {
        this.contextManager.storeText(this.text);
    }

    restoreText() {
        this.text = this.contextManager.restoreText();
        this.lineReaderComponent.load(this.text);
    }

    storeContext() {
        this.contextManager.storeContext(this.context);
    }

    restoreContext() {
        let context = this.contextManager.restoreContext();
        this.position = context.position;
        let hadBookmarks = this.hasBookmarks();
        this.bookmarks = context.bookmarks;
        if (hadBookmarks !== this.hasBookmarks()) {
            $(this.bookmarksSegment).toggle();
        }
        this.lineReaderComponent.changeSpeed(0);
        this.playerComponent.updatePosition(context.position);
        this.playerComponent.updateProgressBar(context.position);
        this.playerComponent.refreshTime();
    }

    storeSettings() {
        if ((this.settingsComponent) && (this.isLoaded)) {
            this.contextManager.storeSettings(this.settings);
        }
    }

    restoreSettings() {
        this.setFontSize(this.settings.fontSize);
        this.setRadius(this.settings.radius);
        this.toggleRadius(this.settings.showRadius);
    }
}