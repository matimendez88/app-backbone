var AppRouter = Backbone.Router.extend({
    
    routes: {
        "": "index",
        "person": "person"
    },
    
    initialize: function(){
        this.index();
    },
    
    index: function(){        
        var person = new Person();
        var person2 = new Person();
        
        var personCollection = new PersonCollection([person, person2]);
        var personCollectionView = new PersonCollectionView({
            model: personCollection
        });
        personCollectionView.render();
        $('main').append(personCollectionView.el);
    },

    person: function() {
        console.log("AppRouter person");
    }
});