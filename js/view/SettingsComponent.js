class SettingsComponent {
    constructor(enkindleController) {
        let that = this;

        this.enkindleController = enkindleController;

        this.isLoaded = false;

        this.dom = $$(div({class: 'ui segment', style: 'width: 100%'}),
            $$(table({style: 'width: 100%'}),
                $$(tr(),
                    $$$(td({style: 'width: 20%'}), 'font size'),
                    $$(td({style: 'width: 80%'}), this.fontSizeSlider = div({class: 'ui range'}))
                ),
                $$(tr(),
                    $$$(td(), 'visible radius'),
                    $$(td(), this.visibelRadiusSlider = div({class: 'ui range'}))
                ),
                $$(tr(),
                    $$$(td(), 'show radius'),
                    $$(td(), $$(div({class: ''}), this.showRadiusCheckbox = input({
                        type: 'checkbox',
                    })))
                )
            )
        );

        this.showRadiusCheckbox.addEventListener('click', function () {
                that.enkindleController.toggleRadius();
                that.enkindleController.storeSettings();
            }
        );

        $(this.fontSizeSlider).range({
            min: 1,
            max: 50,
            smooth: true,
            onChange: function (value) {
                that.enkindleController.setFontSize(Math.floor(value) / 10.0);
                that.enkindleController.storeSettings();
            }
        });


        $(this.visibelRadiusSlider).range({
            min: 0,
            max: 60,
            smooth: true,
            onChange: function (value) {
                that.enkindleController.setRadius(Math.floor(value));
                that.enkindleController.storeSettings();
            }
        });

        this.isLoaded = true;
    }

    getDom() {
        return this.dom;
    }

    refresh() {
        $(this.visibelRadiusSlider).range('set value', this.enkindleController.settings.radius);
        $(this.fontSizeSlider).range('set value', 10.0 * this.enkindleController.settings.fontSize);
        this.showRadiusCheckbox.checked = !!this.enkindleController.settings.showRadius;
    }
}