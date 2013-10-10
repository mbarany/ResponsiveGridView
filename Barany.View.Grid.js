if (!Barany) {
    var Barany = {};
}
if (!Barany.View) {
    Barany.View = {};
}

/**
 * Responsive Grid View
 * by: Michael Barany
 * requires: jQuery (Tested on v1.10.2)
 *
 * Assumptions (Subject to change):
 * ========================================
 * You are using the Responsive Grid CSS from http://www.responsivegridsystem.com/
 *
 * Gotchas:
 * ========================================
 * Make sure you have the CSS for each width Rule. So if you have 3 width Rules, then you need span_1_of_2 and span_1_of_3.
 * 
 * Default Width Rules:
 * ========================================
 * <= 450px wide ==> 1 Column
 * <= 800px wide ==> 2 Columns
 * <= 1000px wide ==> 3 Columns
 * > 1000px wide ==> 4 Columns
 */
Barany.View.Grid = {
    $: null,
    $container: null,
    contentCallback: null,
    drawnCols: null,
    rules: [
        450,
        800,
        1000
    ],
    width: this.$(window).width(),

    /**
     * @param  {jQuery Object} $container
     * @param  {function Callback} getContentCallback - Should return an array of HTML strings (Will get called again if the window is significantly resized)
     * @param  {Object} optionalOptions {
     *     widthRules: [], //Array of width/column rules
     *     jQueryReference: $ //In case you're not using $ for jQuery
     * }
     */
    init: function($container, getContentCallback, optionalOptions) {
        if (!$container || !getContentCallback) {
            throw "Invalid Container or Content Callback!";
        }
        this.$container = $container;
        this.contentCallback = getContentCallback;

        this.setOptionalOptions(optionalOptions);
        this.setupOnResize();

        this.buildContent(this.determineNumberOfCols());
    },
    setOptionalOptions: function(optionalOptions) {
        optionalOptions = optionalOptions || {};
        if (optionalOptions.widthRules) {
            if (optionalOptions.widthRules.length > 11) {
                throw "This library maxes out at 12 columns!";
            }
            this.rules = optionalOptions.widthRules;
        }
        this.$ = optionalOptions.jQueryReference || $;
    },
    setupOnResize: function() {
        var self = this;
        this.$(window).resize(function() {
            self.width = self.$(window).width();
            var newCols = self.determineNumberOfCols();
            if (newCols != self.drawnCols) {
                self.buildContent(newCols);
            }
        });
    },
    determineNumberOfCols: function() {
        var cols = 1;
        for (var i in this.rules) {
            if (this.width <= this.rules[i]) {
                return cols;
            }
            cols++;
        }
        return cols;
    },
    buildContent: function(cols) {
        this.drawnCols = cols;

        var html = '<div class="group">',
            content = this.contentCallback();
        for (var i in content) {
            if (i > 0 && i % cols === 0) {
                html += '</div><div class="group">';
            }
            html += '<div class="col span_1_of_' + cols + '">' + content[i] + '</div>';
        }
        html += '</div>';

        this.$container.html(html);
    }
};
