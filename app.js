var budgetController = (function() {
    
    var Expense = function(id, description, amountValue){
        this.id = id;
        this.description = description;
        this.amountValue = amountValue;
        this.percentage = -1;
    };
    
    Expense.prototype.calcPercentage = function(totalInc){
      
         if(totalInc > 0){
            this.percentage = Math.round((this.amountValue/totalInc)*100); 
         }else{
             this.percentage = -1;
         }  
    };
    
    Expense.prototype.getPercentage = function(){
        return this.percentage;
    };
    
    var Income = function(id, description, amountValue){
        this.id = id;
        this.description = description;
        this.amountValue = amountValue;
    };
    
    var calculateTotal = function(selectedType){
        
        var sum = 0;
        
        data.allItems[selectedType].forEach(function(current){
           sum += current.amountValue; 
        });
        
        data.totals[selectedType] = sum;
    };
    
    var data = {
        allItems:{
            exp: [],
            inc: []
        },
        totals:{
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
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
        
        deleteItem: function(selectedType, id){
            var ids, index;
            
            ids = data.allItems[selectedType].map(function(curr){
               return curr.id; 
            });
            
            index = ids.indexOf(id);
            
            if(index !== -1){
                data.allItems[selectedType].splice(index, 1);
            }
            
            
        },
        
        calculateBudget: function(){
            //calculate total inc and exp
            calculateTotal('exp');
            calculateTotal('inc');
            
            //calculate budget
            data.budget = data.totals.inc - data.totals.exp;
            
            //calculate percentage income spent
            if(data.totals.inc > 0){
                data.percentage = Math.round((data.totals.exp/data.totals.inc)*100);
            }else{
                data.percentage = -1;
            }
        
        },
        
        calculatePercentage: function(){
          
            data.allItems.exp.forEach(function(curr){
               curr.calcPercentage(data.totals.inc); 
            });
        },
        
        getPercentages: function(){
            var allPercentages = data.allItems.exp.map(function(curr){
                return curr.getPercentage();
            });
            return allPercentages;
        },
        
        getBudget: function(){
          return{
              budget: data.budget,
              totalInc: data.totals.inc,
              totalExp: data.totals.exp,
              percentage: data.percentage
          }  
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
        expensesContainer: '.expenses__list',
        budgetValue: '.budget__value',
        budgetIncValue: '.budget__income--value',
        budgetExpValue: '.budget__expenses--value',
        budgetPercent: '.budget__expenses--percentage',
        mainContainer: '.container',
        expensesPercLbl: '.item__percentage',
        monthLbl: '.budget__title--month'
    };
    
    var formatNumber = function(num, selectedType){
            
            var numSplit, int, dec;
            
            num = Math.abs(num);
            num = num.toFixed(2);
            
            numSplit = num.split('.');
            
            int = numSplit[0];
            
            if(int.length > 3){
                int = int.substr(0,int.length-3) + ',' + int.substr(int.length-3,int.length);
            }
            
            dec = numSplit[1];
            
            return (selectedType === 'exp'?'-':'+')+' '+int+'.'+dec;
        };
    
    var nodeListForEach = function(list, callback) {
        for (var i = 0; i < list.length; i++) {
            callback(list[i], i);
        }
    };
    
    return{
        getInputData: function(){
            
            return{
                selectedType: document.querySelector(DOMstrings.inputSelectedType).value,
                description: document.querySelector(DOMstrings.inputDescription).value,
                amountValue: parseFloat(document.querySelector(DOMstrings.inputAmountValue).value)
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
            newHtml = newHtml.replace('%value%', formatNumber(obj.amountValue, type));
            
            // Insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },
        
        deleteListItem: function(selectorId){
            document.getElementById(selectorId).parentNode.removeChild(document.getElementById(selectorId));
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
        
        displayBudget: function(obj){
            
            var type;
            obj.budget > 0 ? type='inc' : type='exp';
            
            document.querySelector(DOMstrings.budgetValue).textContent = formatNumber(obj.budget,type);
            document.querySelector(DOMstrings.budgetIncValue).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMstrings.budgetExpValue).textContent = formatNumber(obj.totalExp, 'exp');
            
            if(obj.percentage > 0){
                document.querySelector(DOMstrings.budgetPercent).textContent = obj.percentage + '%';
            }else{
                document.querySelector(DOMstrings.budgetPercent).textContent = '--';
            }
            
        },
        
        displayPercentages: function(percentages){
            var percFields = document.querySelectorAll(DOMstrings.expensesPercLbl);
            
            nodeListForEach(percFields, function(curr, index){
               if(percentages[index] > 0){
                   curr.textContent = percentages[index]+'%';
               }else{
                   curr.textContent = '---';
               }
                 
            });
            
        },
        
        displayDate: function() {
            var now, months, month, year;
            
            now = new Date();
            //var christmas = new Date(2016, 11, 25);
            
            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            month = now.getMonth();
            
            year = now.getFullYear();
            document.querySelector(DOMstrings.monthLbl).textContent = months[month] + ' ' + year;
        },
        
        changeType: function() {
            
            var fields = document.querySelectorAll(
                DOMstrings.inputSelectedType + ',' +
                DOMstrings.inputDescription + ',' +
                DOMstrings.inputAmountValue);
            
            nodeListForEach(fields, function(cur) {
               cur.classList.toggle('red-focus'); 
            });
            
            document.querySelector(DOMstrings.inputAddButton).classList.toggle('red');
            
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
        
            document.querySelector(DOM.mainContainer).addEventListener('click', ctrlDeleteItem);
        
            document.querySelector(DOM.inputSelectedType).addEventListener('change', UICtrl.changeType);
    };
    
    var ctrlAddItem = function(){
        
        var input, newItem;
        
        inputData = UICtrl.getInputData();
        
        if(inputData.description !== "" && !isNaN(inputData.amountValue) && inputData.amountValue > 0)
        {
            //Adding item into Budget
            newItem = budgetCtrl.addItem(inputData.selectedType, inputData.description, inputData.amountValue);
        
            //Adding item on UI
            UICtrl.addListItem(newItem, inputData.selectedType);
        
            UICtrl.clearFields();
        
            updateBudget();
            
            updatePercentage();
        }
    };
    
    var ctrlDeleteItem = function(event){
        
        var itemId, selectedType, Id;
        
        itemId = event.target.parentNode.parentNode.parentNode.parentNode.id;
        
        if(itemId){
            
            selectedType = itemId.split('-')[0];
            
            Id = parseInt(itemId.split('-')[1]);
            
            budgetCtrl.deleteItem(selectedType, Id); 
            
            UICtrl.deleteListItem(itemId);
            
            updateBudget();
            
            updatePercentage();
            
        }
        
    };
    
    var updateBudget = function(){
        
        budgetCtrl.calculateBudget();
        
        var budget = budgetCtrl.getBudget();
        
        UICtrl.displayBudget(budget);
    };
    
    var updatePercentage = function(){
        budgetCtrl.calculatePercentage();
        
        var percentages = budgetCtrl.getPercentages();
        
        UICtrl.displayPercentages(percentages);
    }
    
    return{
        init: function(){
            console.log('Application starts');
            UICtrl.displayDate();
            UICtrl.displayBudget({
              budget: 0,
              totalInc: 0,
              totalExp: 0,
              percentage: 0
          });
            initializaEventListeners();
        }
    };
    
    
})(budgetController, UIController);

appController.init();