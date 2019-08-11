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
        inputAddButton: '.add__btn'
    };
    
    return{
        getInputData: function(){
            
            return{
                selectedType: document.querySelector(DOMstrings.inputSelectedType).value,
                description: document.querySelector(DOMstrings.inputDescription).value,
                amountValue: document.querySelector(DOMstrings.inputAmountValue).value
            };
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
        
        //Adding item
        newItem = budgetCtrl.addItem(inputData.selectedType, inputData.description, inputData.amountValue);
        
    };
    
    return{
        init: function(){
            console.log('Application starts');
            initializaEventListeners();
        }
    };
    
    
})(budgetController, UIController);

appController.init();