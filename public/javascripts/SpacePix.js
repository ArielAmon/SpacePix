"use strict";
// Created by : Ariel Amon
// Web application  : Nasa APOD rest API
// This app presenting all "image of the day" from nasa server,
// by any given parameter, presented as social media feed.
// all users can comment or delete their comments and see all other
// users comments.


(()=>{
    let username ;
    const keyAPI = "pY612lrnDwt556WmaIYjq5xWTkbOQaB5LAdsbrPi";
    const nasaUrl = "https://api.nasa.gov/planetary/apod";

    function status(response) {
        if (response.status >= 200 && response.status < 300) {
            return Promise.resolve(response)
        } else {
            document.getElementById("errorCode").innerText = `Error : ${response.status} - `;
            return Promise.reject(response);
        }
    }

    function json(response) {
        return response.json()
    }
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /**
     * // Function to create all needed HTML strings to all for the DOM elements.
     * @returns {{makeImageCard: (function(*): string), makeComment: (function(*, *): string), makeDeleteButton: (function(*): string), makePostSection: (function(): string)}}
     */
    function createHtml (){

        const createCard = (imageData) =>{
            let html =`<div class="row g-0 d-flex justify-content-center align-items: center">
                        <div class="card mb-5">
                            <div class="row g-0">
                                <div class="col-lg-6 col-md-12 col-sm-12" >`;
            if(imageData.media_type === "image")
                html += `<img src="${imageData.url}" class="img-fluid rounded-start" style=" width: 100%; height: 100%;object-fit: cover;" alt="image""></div>`;
            else
                html += `<iframe src="${imageData.url}" class="img-fluid rounded-start" style=" width: 100%; height: 100%;object-fit: cover;" alt="image"></iframe></div>`;

            html += `<div class="col-lg-6 col-md-12 col-sm-12" >
                                    <div class="card-body">
                                        <h5 class="card-title display-4 mb-4 fw-normal">${imageData.title}</h5>
                                        <p class="card-text">${imageData.explanation}</p>
                                    </div>
                                    <div class="card-footer-fluid">\n`;
            if(imageData.copyright !== undefined)
                html += `<p class="card-text "><medium class="text-muted"> copyright : ${imageData.copyright}</medium></p>`;

            html += `<p id="Image-card-date" class="card-text "><small class="text-muted">${imageData.date}</small></p>
                                        <button title="${imageData.date}" id="commentButton-${imageData.date}" class="btn btn-outline-dark btn-lg mb-4 px-5" type="button" data-bs-toggle="modal" data-bs-target="#Comments">Comment</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>\n`;

            return html;
        }

        const createComment = (data, index) =>{
            return `<div id="comment-${index}" class="card mb-4">
                        <div class="card-body">
                            <p id="commentatorName" class="fw-bold">${data.username}</p>
                            <p id="commentatorText">${data.userComment}</p>
                        </div>
                    </div>\n`
        }

        const addPostSection = () =>{
            return`
                    <div id="commentSection" class="form-outline mb-4">
                        <label class="form-label" for="commentArea">Comment</label>
                        <textarea class="form-control" maxlength="128" id="commentArea" rows="4"  style="background: #fff;"></textarea>
                        <div class="d-flex flex-start py-4 mb-4 rw-100" style="float: right;">
                            <button id="postCommentButton" type="button" class="btn btn-outline-success" >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chat-dots" viewBox="0 0 16 16">
                                    <path d="M5 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
                                    <path d="m2.165 15.803.02-.004c1.83-.363 2.948-.842 3.468-1.105A9.06 9.06 0 0 0 8 15c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7c0 1.76.743 3.37 1.97 4.6a10.437 10.437 0 0 1-.524 2.318l-.003.011a10.722 10.722 0 0 1-.244.637c-.079.186.074.394.273.362a21.673 21.673 0 0 0 .693-.125zm.8-3.108a1 1 0 0 0-.287-.801C1.618 10.83 1 9.468 1 8c0-3.192 3.004-6 7-6s7 2.808 7 6c0 3.193-3.004 6-7 6a8.06 8.06 0 0 1-2.088-.272 1 1 0 0 0-.711.074c-.387.196-1.24.57-2.634.893a10.97 10.97 0 0 0 .398-2z"/>
                                </svg>
                                Post
                            </button>
                        </div>
                    </div>\n`
        }

        const addDeleteButton = (index) =>{
            return`
               <button id="deleteCommentButton-${index}" type="button" class="btn btn-outline-danger" style="float: right">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                        <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                    </svg>
                    Delete
                </button>\n`
        }

        return {
            makeImageCard : createCard,
            makeComment : createComment,
            makePostSection : addPostSection,
            makeDeleteButton : addDeleteButton,
        }
    }
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /**
     * Function (Module) that handles all operations on the comment section
     * @param event
     */
    function commentsController(event){

        const html = createHtml();
        const utilFuncs = utilities();

        const commentsList = document.getElementById("commentBody");
        const closeCommentsBtn = document.getElementById("closeCommentsButton");
        const imageDate = event.target.title;
        const timer = setInterval (updateComments,15000);

        // Invoked function to fetch all comments from server as comment button of image has been clicked.
        (()=> {
            getCommentsFromServer();
        })();

        // AJAX function to update the comments feed every 15 seconds. All commnets presented are the real-time
        // comments saved in the server.
        async function updateComments(){
            try {
                const comments = await fetch(`/comments/getImageComments/?date=${imageDate}`);
                const commentArray = await comments.json();
                const clientNumOfComments = commentsList.childElementCount - 1;
                const serverNumOfComments = commentArray.imageComments.length;

                function deletePermition (i) {
                    if (commentArray.imageComments[i].username === username ) {
                        if(!document.getElementById(`comment-${i}`).contains(document.getElementById(`deleteCommentButton-${i}`))){
                            const comment = document.getElementById(`comment-${i}`).querySelector('.card-body');
                            comment.insertAdjacentHTML('beforeend', html.makeDeleteButton(i));
                            document.getElementById(`deleteCommentButton-${i}`).addEventListener('click', handleDeletePost);
                        }
                    }
                    else {
                        if(document.getElementById(`comment-${i}`).contains(document.getElementById(`deleteCommentButton-${i}`)))
                            document.getElementById(`deleteCommentButton-${i}`).remove()
                    }
                }

                // if there are same amount of comments at server and user , replace user comment according to server comment .
                function replaceComments (limit) {
                    for(let i = 0 ; i <  limit ; i++){
                        const data = document.getElementById(`comment-${i}`).querySelector('.card-body').children;
                        data[0].innerText = commentArray.imageComments[i].username;
                        data[1].innerText = commentArray.imageComments[i].userComment;
                        deletePermition(i);

                    }
                }
                // if there are new comments at the server, adding them to the content feed.
                function updateCommentFeed(lower, operation){
                    if (operation === "add") {
                        let lastComment;
                        for (let i = lower; i < serverNumOfComments; i++) {
                            if(i === 0 )
                                commentsList.insertAdjacentHTML('afterbegin', html.makeComment(commentArray.imageComments[i], i));
                            else{
                                lastComment = document.getElementById(`comment-${i-1}`);
                                lastComment.insertAdjacentHTML('afterend', html.makeComment(commentArray.imageComments[i], i));
                                deletePermition(i);
                            }
                        }
                    } else { // if there are comments that has been deleted at server, deleting them from content feed.
                        for (let i = lower; i < clientNumOfComments; i++) {
                            document.getElementById(`comment-${i}`).remove()
                        }
                    }
                }

                if (clientNumOfComments === serverNumOfComments){
                    replaceComments(clientNumOfComments);
                }
                else {
                    let lower = Math.min(clientNumOfComments, serverNumOfComments);
                    const operation = serverNumOfComments > clientNumOfComments ? "add" : "delete";

                    replaceComments(lower);
                    updateCommentFeed(lower, operation);
                }

            }
            catch (error) {console.error(error);}

        }

        // Function to receive all comments of given image date.
        function getCommentsFromServer () {
            fetch(`/comments/getImageComments/?date=${imageDate}`)
                .then(status)
                .then(json)
                .then(function (data) {
                    data.imageComments.forEach((commentData, index)=>{
                        commentsList.insertAdjacentHTML('beforeend',html.makeComment(commentData, index));
                        if (commentData.username === username){
                            const comment = document.getElementById(`comment-${index}`).querySelector('.card-body');
                            comment.insertAdjacentHTML('beforeend',html.makeDeleteButton(index));
                            document.getElementById(`deleteCommentButton-${index}`).addEventListener('click',handleDeletePost);
                        }
                    })
                    commentsList.insertAdjacentHTML('beforeend',html.makePostSection());
                    document.getElementById("postCommentButton").addEventListener('click', handlePost);
                }).catch(function (error) {
                console.error(error);
            })
        }

        // Function to handle new user`s post. updating both Dom and server.
        function handlePost() {
            const currUserComment = document.getElementById("commentArea").value;
            document.getElementById("commentArea").value = '';
            const commentIndex = commentsList.childElementCount - 1;
            const elem = document.getElementById("commentSection")
            elem.insertAdjacentHTML('beforebegin',html.makeComment({username : username, userComment : currUserComment},commentIndex))
            const comment = document.getElementById(`comment-${commentIndex}`).querySelector('.card-body');
            comment.insertAdjacentHTML('beforeend',html.makeDeleteButton(commentIndex));
            document.getElementById(`deleteCommentButton-${commentIndex}`).addEventListener('click',handleDeletePost);
            fetch("/comments/addImageComment",{
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({ date : imageDate, commentator : username, comment : currUserComment})
            })
                .then(status)
                .then(json)
                .then(function (data) {
                    utilFuncs.informUser(data.message);
                })
                .catch(function (error) {
                    console.error(error);
                });
        }

        // Function to handle user`s deleting a post (only his own). updating both Dom and server.
        function handleDeletePost(event){
            const indexToDelete = event.target.id.split('-')[1];
            const comment = document.getElementById(`comment-${indexToDelete}`).querySelector('.card-body').children[1].innerHTML;
            fetch("/comments/deleteComment",{
                method: "DELETE",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({ date : imageDate, deleteComment : comment})
            }).then(status)
                .then(json)
                .then(function (data) {
                    utilFuncs.informUser(data.message);
                }).catch(function (error) {
                utilFuncs.handleError(error);
            })
            document.getElementById(`comment-${indexToDelete}`).remove();
            let comments = commentsList.children;
            let arr = [...comments]
            arr.pop();
            arr.forEach((commentElem, index)=>{
                commentElem.id = `comment-${index}`;
                const elem = commentElem.querySelector('.card-body').children;
                let newArr = [...elem];
                if (newArr[2])
                    newArr[2].id = `deleteCommentButton-${index}`;
            });
        }

        closeCommentsBtn.addEventListener('click', ()=>{
            clearInterval(timer);
            while (commentsList.firstChild) {
                commentsList.removeChild(commentsList.firstChild);
            }
        });

    }

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /**
     * Function (Module) to handle all requests from NASA server.
     * @returns {{getNasaContent: getNasaImages}}
     */
    function handleNasaApi(){

        const html = createHtml();
        const utilFuncs = utilities();
        const imageIncrease = 3 ;
        let imageDates = [];

        // Function to save at the server that an image has been loaded once.
        function addImagesToServer(keyVal){
            fetch("/comments/addImageKey",{
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({keys :`${keyVal}`})
            })
                .then(status)
                .then(json)
                .then(function (data){
                    utilFuncs.informUser(data.message);
                })
                .catch(function (error) {
                    console.error(error);
                });
            imageDates = []
        }

        // Function to calculate the differences between date
        function calcRangedDate (date){
            const year = date[2];
            const month = date[1] - 1;
            const day = date[0];
            const currentDate = new Date(year, month, day);
            currentDate.setDate(currentDate.getDate() - imageIncrease);
            const diffDate = [currentDate.getDate(), currentDate.getMonth() + 1, currentDate.getFullYear()];
            return diffDate;

        }

        // Function to get a constant number of images from NASA API.
        // Each image added to the main page feed.
        const getNasaImages = (chosenDate) => {
            const [end_day, end_month, end_year] = chosenDate;
            const [start_day, start_month, start_year] = calcRangedDate(chosenDate);
            fetch(`${nasaUrl}?api_key=${keyAPI}&start_date=${start_year}-${start_month}-${start_day}&end_date=${end_year}-${end_month}-${end_day}`)
                .then(status)
                .then(json)
                .then(function (data) {
                    const feedContent = document.getElementById("feed");
                    data.slice().reverse().forEach((image)=>{
                        imageDates.push(image.date);
                        const newDiv = document.createElement("div");
                        newDiv.innerHTML = html.makeImageCard(image);
                        feedContent.appendChild(newDiv);
                        document.getElementById(`commentButton-${image.date}`).addEventListener('click', commentsController);
                    });
                    addImagesToServer(imageDates);
                }).catch(async function (error) {
                const data = await error.json();
                if (error.status === 400)
                    utilFuncs.handleError(data.code, data.msg);
                else
                    utilFuncs.handleError(data.error.code ,data.error.message );
            })
        }

        return{
            getNasaContent : getNasaImages,
        }
    }

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /**
     * Function (Module) for some utilities function needed for various Modules.
     * @returns {{handleError: displayApiError, informUser: presentServerResponse, deleteContent: removeChildElements, dateFormater: (function(*): [string,string,number]), validateName: (function(*))}}
     */
    function utilities (){

        const getFormatedDate = (unformulatedDate) =>{
            const year = unformulatedDate.getFullYear();
            const month = String(unformulatedDate.getMonth() + 1).padStart(2, '0');
            const day = String(unformulatedDate.getDate()).padStart(2, '0');
            return [day, month, year];
        }

        const checkName = (nameToCheck) =>{
            return (/^[A-Za-z0-9]+$/.test(nameToCheck) && (nameToCheck.length <= 24))
        }

        const removeChildElements = (elem) =>{
            while (elem.firstChild) {
                elem.removeChild(elem.firstChild);
            }
        }

        const presentServerResponse = (message) =>{
            document.getElementById("toastContent").innerText = message;
            const toastElem = document.getElementById("liveToast");
            const toast = new bootstrap.Toast(toastElem);
            setTimeout( toast.show(),2000);
        }

        const displayApiError = (code, message) =>{
            const elem = document.getElementById("errorMessage");
            const main = document.getElementById("main-page");
            main.style.display = "none";
            elem.style.display = "block";
            document.getElementById("errorCode").innerText += code;
            document.getElementById("errorContent").innerText = message;
        }

        return{
            dateFormater : getFormatedDate,
            validateName : checkName,
            deleteContent : removeChildElements,
            informUser : presentServerResponse,
            handleError : displayApiError,
        }

    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    document.addEventListener("DOMContentLoaded", () => {

        const dateInput = document.getElementById("date");
        let currDate = new Date();
        dateInput.valueAsDate = currDate;
        const loadBtn = document.getElementById("loadButton");
        const feedContent = document.getElementById("feed");

        const nasaApi = handleNasaApi();
        const utilFuncs = utilities();

        const handleInfiniteScroll = () => {
            const endOfPage = window.innerHeight + window.pageYOffset >= document.body.offsetHeight;
            if (endOfPage) {
                currDate.setDate(currDate.getDate() - 4);
                nasaApi.getNasaContent(utilFuncs.dateFormater(currDate));
            }
        };

        loadBtn.addEventListener('click', ()=>{
            loadBtn.disabled = true;
            setTimeout(() => {
                loadBtn.disabled = false;
            }, 2000)
            utilFuncs.deleteContent(feedContent);
            currDate = dateInput.valueAsDate;
            nasaApi.getNasaContent(utilFuncs.dateFormater(currDate));
        })
    });

})();