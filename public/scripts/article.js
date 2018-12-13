'use strict';

export function dismissAlert(){
    document.getElementById('errorMessage').style.display = "none";
};

export function removeArticle(data){
    var element = document.getElementById(data.id);
    element.parentNode.removeChild(element);
};

export function dismissNotes(){
    document.getElementById('notesContainer').style.display = "none";
};

export function postData(url, data, onSuccess){
    fetch(url, {
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

export function addEventListeners(){
    document.getElementById("errorMessage").addEventListener("click",dismissAlert);
    document.getElementById("notesCloseButton").addEventListener("click",dismissNotes);
    document.getElementById("notesCrossButton").addEventListener("click",dismissNotes);
};