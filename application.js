$(function() {
    var router = new AppRouter();
    Backbone.history.start({
        pushState: true
    });
});