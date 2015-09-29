var PersonCollectionView = Backbone.View.extend({

    el: '#appContainer',

    events: {
        'click .add': 'addPerson',
        'click .remove': 'removeLastPerson',
        'input .person-number': 'personNumber',
    },

    initialize: function(){
        var that = this;

        this.model.on('add', function(model) {
            var personView = new PersonView({ model: model});
            $('#peopleContainer').append( personView.el );
            that.calculate();
            that.statusMessageTrigger();
            that.refreshPersonQuantity();
        }, this);

        this.model.on('change', function(model) {
            that.calculate();
            that.statusMessageTrigger();
        });

        Backbone.on('Person:modelDestroyed', function(data) {
            that.refreshPersonQuantity();
            that.calculate();
        });
    },

    render: function(){
        $('#peopleContainer').empty();

        _.each(this.model.models, function(model,i){
            var personView = new PersonView({ model: model});
            $('#peopleContainer').append( personView.el );
        });

        this.refreshPersonQuantity();
        this.statusMessageTrigger();
    },

    addPerson: function(){
        var personInstance = new Person();
        this.model.add(personInstance);
    },

    removeLastPerson: function(){
        var popModel = this.model.pop();
        popModel.destroy();
        this.calculate();
        this.statusMessageTrigger();
        this.refreshPersonQuantity();
    },

    personNumber: function() {
        var el = $('.person-number'),
            personQuantity = el.val(),
            personDiff = personQuantity - this.model.length,
            personDiffAbs = Math.abs(personDiff);

        if (personQuantity >= 50) {
            el.val(this.model.length);
            return;
        }

        if (personDiff > 0) {
            for (var i = 0; i < personDiffAbs; i++) {
                this.addPerson();
            }
        } else if (personDiff < 0) {
            for (var i = 0; i < personDiffAbs; i++) {
                this.removeLastPerson();
            }
        }
    },

    refreshPersonQuantity: function() {
        $('.people-quantity input[type="number"]').val(this.model.length);
    },

    calculate: function() {
        var $totalEl = $('.total-price span'),
            modelMoney,
            total = 0;

        _.each(this.model.models, function(model, i) {
            modelMoney = parseInt(model.get('money'), 10);
            total = total + modelMoney;
        });

        $totalEl.html(total);

    },

    statusMessageTrigger: function() {
        var personTotal = $('.total-price p span').html() / this.model.models.length;

        Backbone.trigger('Person:changeTotal', {
            personTotal: personTotal
        });
    }

});