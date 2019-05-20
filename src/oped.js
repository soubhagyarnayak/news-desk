var hn = (function() {
    'use strict';
    var readButtonClicked = function(event){
        var id = event.target.parentNode.getAttribute('id');
        let data = {'operation':'markRead', 'id':id};
        _postData(data,_removeOnSuccess);
    };
    var removeButtonClicked = function(event){
        var id = event.target.parentNode.getAttribute('id');
        let data = {'operation':'remove', 'id':id};
        _postData(data,_removeOnSuccess);
    };
    var addAnnotateButtonClicked = function(event){
        var notesContainer = document.getElementById("notesContainer");
        var id = notesContainer.getAttribute("associatedId");
        var tags = document.getElementById("tags").value;
        var notes = document.getElementById("notes").value;
        let data = {'operation':'annotate', 'id':id, 'tags':tags, 'notes':notes};
        _postData(data,()=>{
            notesContainer.style.display = "none";
            document.getElementById("tags").value = "";
            document.getElementById("notes").value ="";
        });
    };
    var annotateButtonClicked = function(event){
        var id = event.target.parentNode.getAttribute('id');
        fetch(`hn/article?id=${id}`,{
            method: 'GET'
        }).then(function(response){
            return response.json();
        }).then(function(data){
            var notesContainer = document.getElementById("notesContainer");
            notesContainer.style.verticalAlign = "middle";
            notesContainer.style.display = "block";
            notesContainer.setAttribute("associatedId",id);
            console.log(data);
            document.getElementById("tags").value = data.tags||'';
            document.getElementById('notes').value = data.notes||'';
        }).catch(error=>{
            console.error('Encountered error while getting annotations.', error);
            document.getElementById('errorMessage').style.display = "block";
        });
    };
    function _postData(data, onSuccess){
        fetch('/hn', {
            method: 'POST',
            body: JSON.stringify(data),
            headers:{
                'Content-Type': 'application/json'
            }
        }).then(function(response) {
            console.log(data.id);
            onSuccess(data);
        }).catch(error => {
            console.error('Encountered error while posting data.', error);
            document.getElementById('errorMessage').style.display = "block";
        });
    };
    function _removeOnSuccess(data){
        var element = document.getElementById(data.id);
        element.parentNode.removeChild(element);
    }
    var dismissAlert = function dismissAlert(){
        document.getElementById('errorMessage').style.display = "none";
    };
    var dismissNotes = function dismissNotes(){
        document.getElementById('notesContainer').style.display = "none";
    };
    return {
        dismissAlert: dismissAlert,
        readButtonClicked: readButtonClicked,
        removeButtonClicked: removeButtonClicked,
        annotateButtonClicked: annotateButtonClicked,
        addAnnotateButtonClicked : addAnnotateButtonClicked,
        dismissNotes : dismissNotes
    };
}());

document.addEventListener("DOMContentLoaded", function(event){
    console.log("DOMContentLoaded");
    document.getElementById("errorMessage").addEventListener("click",hn.dismissAlert);
    document.getElementById("addAnnotationButton").addEventListener("click",hn.addAnnotateButtonClicked);
    var markReadButtons = document.querySelectorAll("input.readButton");
    markReadButtons.forEach(function(markReadButton){
        markReadButton.addEventListener("click", hn.readButtonClicked);
    });
    var removeButtons = document.querySelectorAll("input.removeButton");
    removeButtons.forEach(function(removeButton){
        removeButton.addEventListener("click", hn.removeButtonClicked);
    });
    var annotateButtons = document.querySelectorAll("input.annotateButton");
    annotateButtons.forEach(function(annotateButton){
        annotateButton.addEventListener("click", hn.annotateButtonClicked);
    });
    document.getElementById("notesCloseButton").addEventListener("click",hn.dismissNotes);
    document.getElementById("notesCrossButton").addEventListener("click",hn.dismissNotes);
});
