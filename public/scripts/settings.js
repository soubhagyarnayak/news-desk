var settings = (function() {
    'use strict';
    var opEdCategoryButtonClicked = function(event){
        var categoryContainer = document.getElementById("categoryContainer");
        categoryContainer.style.verticalAlign = "middle";
        categoryContainer.style.display = "block";
    };
    var addOpEdCategoryButtonClicked = function(event){
        var categoryContainer = document.getElementById("categoryContainer");
        var link = document.getElementById("opedlink").value;
        var title = document.getElementById("opedtitle").value;
        var description = document.getElementById("opeddescription").value;
        let data = {'operation':'insert','link':link,'title':title,'description':description};
        fetch('/oped/category', {
            method: 'POST',
            body: JSON.stringify(data),
            headers:{
                'Content-Type': 'application/json'
            }
        }).then(function (response){
            document.getElementById("categoryContainer").style.display = "none";
            document.getElementById("opedlink").value = "";
            document.getElementById("opedtitle").value = "";
            document.getElementById("opeddescription").value = "";
        }).catch(error=>{
            console.log(error);
        });
    };
    var dismissAlert = function dismissAlert(){
        document.getElementById('errorMessage').style.display = "none";
    };
    var dismissOpEdCategory = function dismissOpEdCategory(){
        document.getElementById('categoryContainer').style.display = "none";
    };
    return {
        dismissAlert: dismissAlert,
        opEdCategoryButtonClicked: opEdCategoryButtonClicked,
        addOpEdCategoryButtonClicked: addOpEdCategoryButtonClicked,
        dismissOpEdCategory: dismissOpEdCategory
    };
}());

document.addEventListener("DOMContentLoaded", function(event){
    console.log("DOMContentLoaded");
    document.getElementById("errorMessage").addEventListener("click",settings.dismissAlert);
    document.getElementById("addoped").addEventListener("click",settings.opEdCategoryButtonClicked);
    document.getElementById("addCategoryButton").addEventListener("click",settings.addOpEdCategoryButtonClicked);
    document.getElementById("categoryCloseButton").addEventListener("click",settings.dismissOpEdCategory);
    document.getElementById("categoryCrossButton").addEventListener("click",settings.dismissOpEdCategory);
});
