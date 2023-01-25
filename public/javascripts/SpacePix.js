"use strict";
// Created by : Ariel Amon
// Web application  : Nasa APOD rest API
// This app presenting all "image of the day" from nasa server,
// by any given parameter, presented as social media feed.
// all users can comment or delete their comments and see all other
// users comments.
(()=>{

    const keyAPI = "pY612lrnDwt556WmaIYjq5xWTkbOQaB5LAdsbrPi";
    const nasaUrl = "https://api.nasa.gov/planetary/apod";

    function status(response) {
        if (response.status >= 200 && response.status < 300) {
            return Promise.resolve(response)
        } else {
            return response.json().then((data) =>{
                if (!data.msg){
                    return Promise.reject(new Error(`${data.error.code} ${data.error.message} `))
                }
                else {
                    return Promise.reject(new Error(`${data.code} ${data.msg} `))
                }
            })
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

        const createComment = (data) =>{
            return `<div id="comment-${data.id}" class="card mb-4">
                        <div class="card-body">
                            <p id="commentatorName" class="fw-bold">${data.userName}</p>
                            <p id="commentatorText">${data.comment}</p>
                        </div>
                    </div>\n`
        }

        const addPostSection = () =>{
            return`
                    <div id="commentSection" class="form-outline mb-4">
                        <label class="form-label" for="commentArea">Comment</label>
                        <textarea class="form-control"  maxlength="128" id="commentArea" rows="4"  style="background: #fff;" required></textarea>
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

        const id = document.getElementById("welcomeTitle").dataset.userId;
        const userName = document.getElementById("welcomeTitle").dataset.user;
        const commentsList = document.getElementById("commentBody");
        const closeCommentsBtn = document.getElementById("closeCommentsButton");
        const serverErrorElem = document.getElementById("serverError");
        const serverError = document.getElementById("serverErrorContent");
        const imageDate = event.target.title;

        // Invoked function to fetch all comments from server as comment button of image has been clicked.
        (()=> {
            getCommentsFromServer();
        })();

        // Function to receive all comments of given image date.
        function getCommentsFromServer () {
            fetch(`/home/getImageComments/?date=${imageDate}`)
                .then(status)
                .then(json)
                .then((data) =>{
                    data.forEach((commentData)=>{
                        commentsList.insertAdjacentHTML('beforeend',html.makeComment(commentData));
                        if (commentData.userID === Number(id)){
                            const comment = document.getElementById(`comment-${commentData.id}`).querySelector('.card-body');
                            comment.insertAdjacentHTML('beforeend',html.makeDeleteButton(commentData.id));
                            document.getElementById(`deleteCommentButton-${commentData.id}`).addEventListener('click',handleDeletePost);
                        }
                    })
                    commentsList.insertAdjacentHTML('beforeend',html.makePostSection());
                    document.getElementById("postCommentButton").addEventListener('click', handlePost);
                }).catch( (error) =>{
                displayServerError(error);
            })
        }

        // Function to handle new user`s post. updating both Dom and server.
        function handlePost() {
            const currUserComment = document.getElementById("commentArea").value;
            fetch("/home/addImageComment",{
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({ imageID : imageDate, user : userName, comment : currUserComment})
            })
                .then(status)
                .then(json)
                .then((data) =>{
                    const elem = document.getElementById("commentSection");
                    elem.insertAdjacentHTML('beforebegin',html.makeComment(data));
                    const comment = document.getElementById(`comment-${data.id}`).querySelector('.card-body');
                    comment.insertAdjacentHTML('beforeend',html.makeDeleteButton(data.id));
                    document.getElementById(`deleteCommentButton-${data.id}`).addEventListener('click',handleDeletePost);
                    utilFuncs.disableButton(document.getElementById(`deleteCommentButton-${data.id}`),2500);
                    document.getElementById("commentArea").value = '';
                })
                .catch((error)=> {
                    displayServerError(error);
                });
        }

        // Function to handle user`s deleting a post (only his own). updating both Dom and server.
        function handleDeletePost(event){
            const indexToDelete = event.target.id.split('-')[1];
            fetch("/home/deleteComment",{
                method: "DELETE",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({ id : indexToDelete})
            }).then(status)
                .then(json)
                .then((data) =>{
                    if(data) document.getElementById(`comment-${indexToDelete}`).remove();
                }).catch( (error) =>{
                displayServerError(error);
            })
        }

        function displayServerError(error){
            let url =  "http://localhost:3000/home";
            const code = error.message.split(' ')[0];
             if (code === '401'){
                 url = "http://localhost:3000";
             }
            utilFuncs.deleteContent(commentsList);
            serverErrorElem.style.display = 'block';
            serverError.innerText = error.message;
            setTimeout(()=>{
                serverErrorElem.style.display = 'none';
                window.location.href = url;
            },4000)

        }

        closeCommentsBtn.addEventListener('click', ()=>{
            utilFuncs.deleteContent(commentsList);
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

        // Function to calculate the differences between date
        function calcRangedDate (date){
            const year = date[2];
            const month = date[1] - 1;
            const day = date[0];
            const currentDate = new Date(year, month, day);
            currentDate.setDate(currentDate.getDate() - imageIncrease);
            return [currentDate.getDate(), currentDate.getMonth() + 1, currentDate.getFullYear()];

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
                        const newDiv = document.createElement("div");
                        newDiv.innerHTML = html.makeImageCard(image);
                        feedContent.appendChild(newDiv);
                        document.getElementById(`commentButton-${image.date}`).addEventListener('click', commentsController);
                    });
                }).catch((error) =>{
                utilFuncs.handleError(error);
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

        const removeChildElements = (elem) =>{
            while (elem.firstChild) {
                elem.removeChild(elem.firstChild);
            }
        }

        const displayApiError = (message) =>{
            const elem = document.getElementById("errorMessage");
            const feed = document.getElementById("feed");
            document.getElementById("moreButton").style.display = 'none';
            feed.style.display = "none";
            elem.style.display = "block";
            document.getElementById("errorContent").innerText = message;
        }

        const disableElem = (elem, delay) =>{
            elem.disabled = true;
            setTimeout(() => {
                elem.disabled = false;
            }, delay)
        }

        return{
            dateFormater : getFormatedDate,
            deleteContent : removeChildElements,
            handleError : displayApiError,
            disableButton : disableElem,
        }

    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    document.addEventListener("DOMContentLoaded", () => {

        const dateInput = document.getElementById("date");
        let currDate = new Date();
        dateInput.valueAsDate = currDate;
        const loadBtn = document.getElementById("loadButton");
        const moreBtn = document.getElementById("moreButton");
        const feedContent = document.getElementById("feed");
        const loadContentElem = document.getElementById("loading-1");
        const nasaApi = handleNasaApi();
        const utilFuncs = utilities();

        const loadNewContent = (loadingTime) => {
            feedContent.style.display = 'none';
            loadContentElem.style.display = 'block';
            utilFuncs.disableButton(moreBtn,loadingTime);
            utilFuncs.disableButton(loadBtn,loadingTime);
            setTimeout(() => {
                feedContent.style.display = 'block';
                loadContentElem.style.display = 'none';
                nasaApi.getNasaContent(utilFuncs.dateFormater(currDate));
            }, loadingTime)
        }

        (()=> {
            loadNewContent(5000);
        })();


        moreBtn.addEventListener('click',()=>{
            utilFuncs.disableButton(moreBtn);
            currDate.setDate(currDate.getDate() - 4);
            nasaApi.getNasaContent(utilFuncs.dateFormater(currDate));
        })

        loadBtn.addEventListener('click', ()=>{
            utilFuncs.deleteContent(feedContent);
            currDate = dateInput.valueAsDate;
            loadNewContent(5000);
        })
    });

})();