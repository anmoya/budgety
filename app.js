// BUDGET CONTROLLER
var budgetController = (function() {

    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };
    
    var cambio;

    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        }
    };
    
    return {
        addItem: function(type, des, val) {
            var newItem;
            
            if (data.allItems[type].length > 0)
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            else
                ID = 0;
            
            if (type === 'exp')
                var newItem = new Expense(ID, des, val);
            else if (type === 'inc')
                newItem = new Income(ID, des, val);
            
            data.allItems[type].push(newItem);
            return newItem;
            
        },
        testing: function() {
            console.log(data);
        }
    }

})();





//UI CONTROLLER
var UIController = (function() {

    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list'
    };

    return {
        getInput: function(){
            return {
                type : document.querySelector(DOMstrings.inputType).value, // + o -
                description : document.querySelector(DOMstrings.inputDescription).value,
                value : document.querySelector(DOMstrings.inputValue).value
            };
        },
        getDOMstrings: function() {
            return DOMstrings;
        },
        
        addListItem: function (obj, type) {
            // 1. Create html string with placeholder text
            
            var html, newHtml, element;
            
            if (type === 'inc') {
                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            else if (type === 'exp'){
                element = DOMstrings.expensesContainer;
                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            
            
            // 2-. Replace the placeholder text with some actual data
            
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);
            
            
            // 3. Insert the HTMl into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },
        
        clearFields: function() {
            var fields, fieldsArray;
            //traemos todos los campos, pero se guarda en una lista
            fields = document.querySelectorAll(DOMstrings.inputDescription + ',' + DOMstrings.inputValue);
            
            //slice toma un array y retorna otro array, si que lo usamos sobre la lista para obtener un array
            fieldsArray = Array.prototype.slice.call(fields);
            
            //ciclamos sobre el array
            fieldsArray.forEach(function(current, index, array){
                current.value = "";
            });
            
            fieldsArray[0].focus();
            
            
        }

    }   
})();



// GLOBAL APP CONTROLLER
var controller = (function( budgetCtrl, UICtrl ) {

    var setupEventListeners = function (){

        // llama los input desde UIController
        var DOM = UICtrl.getDOMstrings();

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function(event){
            if ( event.keyCode === 13 || event.which === 13 ){
                ctrlAddItem();
            }

        });

    }






    var ctrlAddItem = function() {
        // 1. Get Input Data
        var input = UIController.getInput();

        // 2. Add the item to the budget controllers
        var newItem = budgetCtrl.addItem(input.type, input.description, input.value);
        
        
        
        // 3. Add the item to de UI
        UICtrl.addListItem(newItem, input.type);
        // 4.a Clear the fields
        UICtrl.clearFields();
        
        // 4.b. Calculate the budget
        // 5. Display de budget
    };

    return {
        init : function() {
            console.log('Aplication has started.')
            setupEventListeners();
        }
    };



})(budgetController, UIController);

controller.init();