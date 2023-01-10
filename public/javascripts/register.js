"use strict";

(()=>{

    function errorElement(){
        return ` <div id="formatError" class="alert alert-danger alert-dismissible fade show" role="alert">
                   <strong>Name can contain only a-z letters, and must contain only 3-32 characters !</strong>
                   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                  </div>`
    }

    function checkName(nameElem){
        const nameToCheck = nameElem.value.trim();
        const isValid = (nameToCheck) =>{
            return (/^[A-Za-z]+$/.test(nameToCheck) && (nameToCheck.length >= 3 && nameToCheck.length <= 32))
        }

        if(!isValid(nameToCheck)){
            //if(!document.contains(document.getElementById("formatError")))
            nameElem.insertAdjacentHTML('beforebegin', errorElement());
            return false
        }
        return true;
    }


    document.addEventListener("DOMContentLoaded", () => {

        const firstName = document.getElementById("firstName");
        const lastName = document.getElementById("lastName");

        document.getElementById("nextStep").addEventListener('click',(event)=>{
            let cond1 = checkName(firstName);
            let cond2 = checkName(lastName);
            if( !cond1 || !cond2){
                event.preventDefault();
            }
        })


    });
})();
