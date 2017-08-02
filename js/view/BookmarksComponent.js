class BookmarksComponent {
    constructor(enkindleController) {
        let that = this;

        this.enkindleController = enkindleController;

        this.dom = div({class: 'ui segment', style: 'width: 100%'});

        this.addBookmarkButton = LabeledIconButton('bookmark right floated', 'Add Bookmark', null, 'basic');

        this.addBookmarkButton.addEventListener('click', function () {
            that.addBookmarkCallback();
        })
    }

    getDom() {
        return this.dom;
    }

    getBookmarkIcons() {
        return [
            'empty heart',
            'heart',
            'empty star',
            'star',
            'smile',
            'thumbs outline up',
            'thumbs up',
            'music',
            'marker',
            'paw',
            'comment',
            'comment outline',
            'idea',
            'warning sign',
            'diamond',
            'sun',
            'asterisk',
            'certificate',
            'cube',
            'checkmark box',
        ];
    }

    addBookmarkCallback(){
        let position = this.enkindleController.context.position;
        let existingBookmarks = this.enkindleController.getBookmarks();
        let existingBookmarksCount = Object.keys(existingBookmarks).length;


        if (existingBookmarksCount === 0) {
            $(this.enkindleController.bookmarksSegment).toggle();
        }

        if (existingBookmarksCount > 10)
        {
            return;
        }
        let label = this.getRandomLabel();
        while(label in existingBookmarks)
        {
            label = this.getRandomLabel();
        }

        let bookmark = new Bookmark(this.enkindleController, label, position);
        this.enkindleController.bookmarksComponent.getDom().appendChild(bookmark.getDom());
        this.enkindleController.addBookmarkToContext(label, position);
    }

    refresh()
    {
        for(let label in this.enkindleController.context.bookmarks)
        {
            let position = this.enkindleController.context.bookmarks[label];
            let bookmark = new Bookmark(this.enkindleController, label, position);
            this.enkindleController.bookmarksComponent.getDom().appendChild(bookmark.getDom());
        }
    }

    getRandomLabel(){
        let randomIndex = Math.floor(Math.random() * this.getBookmarkIcons().length);
        console.log(randomIndex);
        console.log(this.getBookmarkIcons()[randomIndex]);
        return this.getBookmarkIcons()[randomIndex];
    }
}