var PersonView = Backbone.View.extend({
    tagName: 'li',
    className: 'person',

    events: {
        'input input[type="number"]' : 'moneyChange',
        'input input[type="text"]' : 'nameChange',
        'click .icon-remove': 'removePerson'
    },

    template: __templates.person,
    
    initialize: function() {
        var that = this;
        this.render();
        Backbone.on('Person:changeTotal', function(data) {
            that.refreshStatus(data.personTotal);
        });

        this.model.on('destroy', function() {
            that.remove();
        });
    },

    render: function() {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    },

    moneyChange: function() {
        var newMoneyValue = this.$el.find('input[type="number"]').val();
        
        if ( /^[0-9]+$/.test(newMoneyValue) ) {
            this.model.set({ 'money': newMoneyValue });
        } else {
            this.$el.find('input[type="number"]').val(this.model.get('money'));
        }
    },

    nameChange: function() {
        this.model.set({'name': this.$el.find('input[type="text"]').val()});
    },

    refreshStatus: function(personTotal) {
        var $statusEl = this.$('.status'),
            modelMoney = this.model.get('money'),
            result;

        $statusEl.attr('class', 'status');
        if (personTotal < modelMoney) {
            result = modelMoney - personTotal;
            $statusEl.addClass('status-receive');
            $statusEl.html('Recibe $' + result.toFixed(2));
        } else if (personTotal > modelMoney) {
            result = personTotal - modelMoney;
            $statusEl.addClass('status-pay');
            $statusEl.html('Paga $' + result.toFixed(2));
        } else {
            $statusEl.addClass('status-ok');
            $statusEl.html('Está hecho');
        }
    },

    removePerson: function() {
        var that = this;

        this.model.destroy({
            success: function() {
                that.remove();
                Backbone.trigger('Person:modelDestroyed');
            }
        });
    }

});