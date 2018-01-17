// BUDGET CONTROLLER
var budgetController = (function() {

    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    Expense.prototype.calculatePercentage = function( totalIncome ) {

        if (totalIncome > 0)
            this.percentage = Math.round( ( this.value / totalIncome ) * 100 );
        else
            this.percentage = -1;

    };
    
    Expense.prototype.getPercentage = function () {
        return this.percentage;
    };

    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var calculateTotal = function (type) {
        var sum = 0;
        data.allItems[type].forEach(function(cur) {
            sum += cur.value;
        });

        data.totals[type] = sum;
    };


    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
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

        deleteItem: function( type , id ){

            var ids, index;

            // mapeamos array de todos los elementos en un objeto de cierto tipo
            ids = data.allItems[type].map(function(current){
                return current.id;
            });

            //buscamos el parametro id dentro del array ids, y guardamos el index
            index = ids.indexOf(id);

            //
            if (index !== -1){
                //splice: método que permite eliminar elementos de un array, 
                //se la pasa index y cantidad a eliminar
                data.allItems[type].splice( index, 1 );
            }

        },

        calculateBudget: function() {

            //calcular total income y expenses
            calculateTotal('exp');
            calculateTotal('inc');

            //calcular income - expenses
            data.budget = data.totals.inc - data.totals.exp;

            //calculate the percetage of income tha we spent
            if (data.totals.inc > 0)
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            else
                data.percentage = -1;
        },

        calculatePercentages: function() {
            
            data.allItems.exp.forEach(function (cur) {
                cur.calculatePercentage(data.totals.inc);
            });
        },
        
        getPercentages: function () {
            var allPerc = data.allItems.exp.map(function(cur){
                return cur.getPercentage();
            });
            
            return allPerc;
        },


        getBudget: function () {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            };
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
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container'
    };

    return {
        getInput: function(){
            return {
                type : document.querySelector(DOMstrings.inputType).value, // + o -
                description : document.querySelector(DOMstrings.inputDescription).value,
                value : parseFloat(document.querySelector(DOMstrings.inputValue).value)
            };
        },
        getDOMstrings: function() {
            return DOMstrings;
        },

        deleteListItem: function (listItem){
            var el;
            el = document.getElementById(listItem);

            el.parentNode.removeChild(el);
        },

        addListItem: function (obj, type) {
            // 1. Create html string with placeholder text

            var html, newHtml, element;

            if (type === 'inc') {
                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            else if (type === 'exp'){
                element = DOMstrings.expensesContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
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


        },

        displayBudget: function(obj) {
            document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
            document.querySelector(DOMstrings.expensesLabel).textContent = obj.totalExp;
            document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage;

            if (obj.percentage > 0){
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';
            }

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

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

    };

    var updateBudget = function () {
        // 1-. Calcular presupuesto
        budgetCtrl.calculateBudget();

        // 2. Retorna el presupuesto
        var budget = budgetCtrl.getBudget();


        // 3. Mostrar presupuesto
        UICtrl.displayBudget(budget);
    };
    
    var updatePercentages = function() {
        
        //1. Calcular procentajes
        budgetCtrl.calculatePercentages();
        
        //2. Leer porcentaes ddesde el budgetController
        var percentages = budgetCtrl.getPercentages();
        
        // 3. updatear UI
        console.log(percentages);
    };

    var ctrlAddItem = function() {
        // 1. Get Input Data
        var input = UIController.getInput();

        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
            // 2. Add the item to the budget controllers
            var newItem = budgetCtrl.addItem(input.type, input.description, input.value);



            // 3. Add the item to de UI
            UICtrl.addListItem(newItem, input.type);
            // 4.a Clear the fields
            UICtrl.clearFields();

            // 5. Clacular y updatear prsupuestps

            updateBudget();
            updatePercentages();
        }

    };

    var ctrlDeleteItem = function(event) {
        var itemID, splitID;

        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if (itemID) {
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]); 
        }


        // 1. Borrar el item de la estructura
        budgetCtrl.deleteItem(type, ID);

        // 2. Borrar el item del UI
        UICtrl.deleteListItem(itemID);

        // 3. Updatear y mostrar el nuevo presupuesto
        updateBudget();
        updatePercentages();
    };

    return {
        init : function() {
            console.log('Aplication has started.');
            UICtrl.displayBudget({
                budget: 0,
                totalExp: 0,
                totalInc: 0,
                percentage: -1
            });
            setupEventListeners();
        }
    };



})(budgetController, UIController);

controller.init();