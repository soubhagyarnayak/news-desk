import {removeArticle, addEventListeners, postData} from './article.js';

'use strict';

var hn = (function() {
    var readButtonClicked = function(event){
        var id = event.target.parentNode.getAttribute('id');
        let data = {'operation':'markRead', 'id':id};
        postData('/hn',data,removeArticle);
    };
    var removeButtonClicked = function(event){
        var id = event.target.parentNode.getAttribute('id');
        let data = {'operation':'remove', 'id':id};
        postData('/hn',data,removeArticle);
    };
    var archiveButtonClicked = function(event){
        var id = event.target.parentNode.getAttribute('id');
        let data = {'operation':'archive', 'id':id, 'url':"https://news.ycombinator.com/item?id="+id};
        postData('/hn',data,()=>{});
    }
    var addAnnotateButtonClicked = function(event){
        var notesContainer = document.getElementById("notesContainer");
        var id = notesContainer.getAttribute("associatedId");
        var tags = document.getElementById("tags").value;
        var notes = document.getElementById("notes").value;
        let data = {'operation':'annotate', 'id':id, 'tags':tags, 'notes':notes};
        postData('/hn',data,()=>{
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

    return {
        readButtonClicked: readButtonClicked,
        removeButtonClicked: removeButtonClicked,
        annotateButtonClicked: annotateButtonClicked,
        addAnnotateButtonClicked : addAnnotateButtonClicked,
        archiveButtonClicked : archiveButtonClicked
    };
}());

document.addEventListener("DOMContentLoaded", function(event){
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
    var archiveButtons = document.querySelectorAll("input.archiveButton");
    archiveButtons.forEach(function(archiveButton){
        archiveButton.addEventListener("click", hn.archiveButtonClicked);
    });
    addEventListeners();
});
