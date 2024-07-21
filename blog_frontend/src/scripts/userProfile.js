import { getAllUserPublishedBlogs, getAllUserBlogs, getAllUserUnpublishedBlogs} from "../service/blogService";
import { loadBlogs, setUpBlogsDiv } from "../utilities/loadBlogs.js";
import { deleteUser } from "../service/userService.js";
import { navigateToSignup, navigateToHome } from "../utilities/routerFunctions.js";

export default {
    watch: {
        '$route'(to, from) {
            this.loadPageData();
        }
    },
    async mounted() {
        await this.loadPageData();
    },
    methods : {
        async loadPageData() {
            const username = this.$route.params.username;
        
            const title = document.getElementById("title");
            const titleNode = document.createTextNode(`User: ${username}`);
            title.appendChild(titleNode);
        
            const body = document.getElementById("body");
            const newDiv = document.createElement("div");
            const divP = document.createElement("p");
            const textNode = document.createTextNode("Blogs");
            const blogsDiv = document.createElement("div");
            blogsDiv.setAttribute("id", "blogsDiv");
        
            newDiv.style.position = "absolute";
            newDiv.style.top = "15%";
            newDiv.style.left = "50%";
            newDiv.style.msTransform = 'translate(-50%, -50%)';
            newDiv.style.transform = 'translate(-50%, -50%)';
            divP.style.fontSize = "x-large";
            setUpBlogsDiv(blogsDiv);
        
            body.appendChild(newDiv);
            newDiv.appendChild(divP);
            divP.appendChild(textNode);
            body.appendChild(blogsDiv);
        
            const returnHomeButton = document.createElement("button");
            returnHomeButton.innerText = "home";
        
            returnHomeButton.addEventListener('click', (e) => {
                e.preventDefault();
                navigateToHome();
            });
        
            body.appendChild(returnHomeButton);
        
            try {
                const userBlogs = await getAllUserBlogs(username);
        
                const viewAllButton = document.createElement("button");
                const viewPublishedButton = document.createElement("button");
                const viewUnpblishedButton = document.createElement("button");
                const deleteUserButton = document.createElement("button");
        
                deleteUserButton.innerText = "Delete your account";
                viewPublishedButton.innerText = "View Published";
                viewAllButton.innerText = "View All Blogs";
                viewUnpblishedButton.innerText = "view Unpublished";
        
                body.appendChild(viewAllButton);
                body.appendChild(viewPublishedButton);
                body.appendChild(viewUnpblishedButton);
                body.appendChild(deleteUserButton);
                
                loadBlogs(userBlogs, blogsDiv);
        
                deleteUserButton.addEventListener("click", async (e) => {
                    try {
                        const deleted = await deleteUser(username);
                        localStorage.clear();
                        sessionStorage.clear();
                        alert("successfuly deleted user");
                        navigateToSignup();
                    }
                    catch (error) {
                        if(error.response) {
                            switch(error.response.status){
                                case(404):
                                    alert("user not found");
                                    console.log(error);
                                    navigateToHome();
                                    break;
                                default:
                                    alert("an unknown error occured with error code", error.response.status);
                                    console.log(error);
                                    navigateToHome();
                                    break;
                            }
                        }
                        else {
                            alert("an unknown error occured");
                            console.log(error);
                        }
                    }
                });
        
                viewAllButton.addEventListener('click', async (e) => {
                    e.preventDefault();
        
                    try {
                        const allBlogs = await getAllUserBlogs(username);
        
                        const blogsDiv = document.getElementById("blogsDiv");
                        blogsDiv.parentNode.removeChild(blogsDiv);
                        const newBlogsDiv = document.createElement("div");
                        newBlogsDiv.setAttribute("id", "blogsDiv");
                        setUpBlogsDiv(newBlogsDiv);
                        body.appendChild(newBlogsDiv);
        
                        loadBlogs(allBlogs, newBlogsDiv);
                    }
                    catch (error) { 
                        if(error.response) {
                            switch(error.response.status){
                                case(404):
                                    alert("user not found");
                                    navigateToHome();
                                    break;
                                case(401):
                                    navigateToHome();
                                    break;
                                default:
                                    alert("an unknown error occured with error code", error.response.status);
                                    navigateToHome();
                                    break;
                            }
                        }
                        else {
                            alert("an unknown error occured");
                            console.log(error);
                        }
                    }
                });
        
                viewPublishedButton.addEventListener('click', async (e) => {
                    e.preventDefault();
                
                    const blogsDiv = document.getElementById("blogsDiv");
                    blogsDiv.parentNode.removeChild(blogsDiv);
                    const newBlogsDiv = document.createElement("div");
                    newBlogsDiv.setAttribute("id", "blogsDiv");
                    setUpBlogsDiv(newBlogsDiv);
                    body.appendChild(newBlogsDiv);
        
                    await this.getUserPublishedBlogs(username);
                });
        
                viewUnpblishedButton.addEventListener('click', async (e) => {
                    e.preventDefault();
        
                    try {
                        const allUnpublishedBlogs = await getAllUserUnpublishedBlogs(username);
        
                        const blogsDiv = document.getElementById("blogsDiv");
                        blogsDiv.parentNode.removeChild(blogsDiv);
                        const newBlogsDiv = document.createElement("div");
                        newBlogsDiv.setAttribute("id", "blogsDiv");
                        setUpBlogsDiv(newBlogsDiv);
                        body.appendChild(newBlogsDiv);
        
                        loadBlogs(allUnpublishedBlogs, newBlogsDiv);
                    }
                    catch (error) {
                        if(error.response) {
                            switch(error.response.status){
                                case(404):
                                    alert("user not found");
                                    navigateToHome();
                                    break;
                                case(401):
                                    navigateToHome();
                                    break;
                                default:
                                    alert("an unknown error occured with error code", error.response.status);
                                    navigateToHome();
                                    break;
                            }
                        }
                        else {
                            alert("an unknown error occured");
                            console.log(error);
                        }
                    }
                });
            }
            catch (error) {
                console.log(error);
                if(error.response) {
                    switch(error.response.status){
                        case(404):
                            alert("user not found");
                            navigateToHome();
                            break;
                        case(401):
                            await this.getUserPublishedBlogs(username);
                            break;
                        case(409):
                            alert("blog has already been published, can't create a new page");
                            break;
                        default:
                            alert("an unknown error occured with error code", error.response.status);
                            navigateToHome();
                            break;
                    }
                }
                else {
                    alert("an unknown error occured");
                    console.log(error);
                }
        
            }

        },
        getUserPublishedBlogs : async function(username){
            try {

                const publishedBlogs = await getAllUserPublishedBlogs(username);
                const blogsDiv = document.getElementById("blogsDiv");
                loadBlogs(publishedBlogs, blogsDiv);
            }
            catch(error) {
                const p = document.getElementById('title');
                p.style.color = "red";
                p.style.fontSize = "xx-large";
                if(!error.response) {
                    console.log(error);
                    p.innerText = "An unknown error occured.";
                }
                else {
                    switch(error.response.status) {
                        case(401):
                            navigateToHome();
                            break;
                        case(404):
                            p.innerText = "Sorry, the given user does not exist.";
                            break;
                        
                        default:
                            console.log(error.response);
                            console.log(error.response.status);
                            p.innerText = "An unknown error occured.";
                    }
                }
            }
        }
    }
}