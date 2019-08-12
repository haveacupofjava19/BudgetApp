var budgetController = (function() {
    
    var Expense = function(id, description, amountValue){
        this.id = id;
        this.description = description;
        this.amountValue = amountValue;
    };
    
    var Income = function(id, description, amountValue){
        this.id = id;
        this.description = description;
        this.amountValue = amountValue;
    };
    
    var data = {
        allItems:{
            exp: [],
            inc: []
        },
        totals:{
            exp: 0,
            inc: 0
        }
    };
    
    return{
        addItem: function(selectedType, desc, value){
            var newItem, ID;
            
            console.log(selectedType+" "+desc+" "+value);
            
            //Creating Unique ID for new Items
            if(data.allItems[selectedType].length > 0){
                ID = data.allItems[selectedType][data.allItems[selectedType].length - 1].id + 1;
            }else{
                ID = 0;
            }
            
            
            //Creating New Item based on selected Type
            if(selectedType === 'inc'){
                newItem = new Income(ID, desc, value);    
            }else if(selectedType === 'exp'){
                newItem = new Expense(ID, desc, value);
            }
            
            //Add the new Item to array based on type
            data.allItems[selectedType].push(newItem);
            return newItem;
        },
        
        testing: function(){
            console.log(data);
        }
    };
    
    
    
})();

var UIController = (function() {
    
    var DOMstrings = {
        inputSelectedType: '.add__type',
        inputDescription: '.add__description',
        inputAmountValue: '.add__value',
        inputAddButton: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list'
    };
    
    return{
        getInputData: function(){
            
            return{
                selectedType: document.querySelector(DOMstrings.inputSelectedType).value,
                description: document.querySelector(DOMstrings.inputDescription).value,
                amountValue: document.querySelector(DOMstrings.inputAmountValue).value
            };
        },
        
        addListItem: function(obj, type) {
            var html, newHtml, element;
            // Create HTML string with placeholder text
            
            if (type === 'inc') {
                element = DOMstrings.incomeContainer;
                
                html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'exp') {
                element = DOMstrings.expensesContainer;
                
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            
            // Replace the placeholder text with some actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.amountValue);
            
            // Insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },
        
        clearFields: function(){
            var fields, fieldsArray;
            fields = document.querySelectorAll(DOMstrings.inputDescription + ',' + DOMstrings.inputAmountValue);
            
            fieldsArray = Array.prototype.slice.call(fields);
            
            fieldsArray.forEach(function(current, index, array){
                current.value="";
            });
            
            fieldsArray[0].focus();
        },
        
        getDOMStrings: function(){
            return DOMstrings;
        }
    };
    
})();

var appController = (function(budgetCtrl, UICtrl){
    
    var initializaEventListeners = function(){
            var DOM = UICtrl.getDOMStrings();
            
            document.querySelector(DOM.inputAddButton).addEventListener('click', ctrlAddItem);
    
            document.addEventListener('keypress', function(e){
        
            if(e.keyCode === 13 || e.which === 13){
                ctrlAddItem();
            }
        
        });
    };
    
    var ctrlAddItem = function(){
        
        var input, newItem;
        
        inputData = UICtrl.getInputData();
        
        //Adding item into Budget
        newItem = budgetCtrl.addItem(inputData.selectedType, inputData.description, inputData.amountValue);
        
        //Adding item on UI
        UICtrl.addListItem(newItem, inputData.selectedType);
        
        UICtrl.clearFields();
        
    };
    
    return{
        init: function(){
            console.log('Application starts');
            initializaEventListeners();
        }
    };
    
    
})(budgetController, UIController);

appController.init();