var hn = (function() {
    console.log("done");
    'use strict';
    var readButtonClicked = function(event){
        var id = event.target.parentNode.getAttribute('id');
        let data = {'operation':'markRead', 'id':id};
        _postData(data);
    }
    var removeButtonClicked = function(event){
        var id = event.target.parentNode.getAttribute('id');
        let data = {'operation':'remove', 'id':id};
        _postData(data);
    }
    function _postData(data){
        fetch('/hn', {
            method: 'POST',
            body: JSON.stringify(data),
            headers:{
                'Content-Type': 'application/json'
            }
        }).then(function(response) {
            console.log(data.id);
            var element = document.getElementById(data.id);
            element.parentNode.removeChild(element);
        }).catch(error => {
            console.error('Encountered error while posting data.', error);
            document.getElementById('errorMessage').style.display = "block";
        });
    }
    var dismissAlert = function dismissAlert(){
        document.getElementById('errorMessage').style.display = "none";
    }
    return {
        dismissAlert: dismissAlert,
        readButtonClicked: readButtonClicked,
        removeButtonClicked: removeButtonClicked
    };
}());

document.addEventListener("DOMContentLoaded", function(event){
    console.log("DOMContentLoaded");
    document.getElementById("errorMessage").addEventListener("click",hn.dismissAlert);
    var markReadButtons = document.querySelectorAll("input.readButton");
    markReadButtons.forEach(function(markReadButton){
        markReadButton.addEventListener("click", hn.readButtonClicked);
    });
    var removeButtons = document.querySelectorAll("input.removeButton");
    removeButtons.forEach(function(removeButton){
        removeButton.addEventListener("click", hn.removeButtonClicked);
    });
});
