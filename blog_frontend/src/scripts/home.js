import { createBlog, getAllPublishedBlogs } from "../service/blogService.js";
import { getCurrentUserProfile } from "../service/userService.js";
import { loadBlogs, setUpBlogsDiv } from "../utilities/loadBlogs.js";
import { navigateToBlog, navigateToLogin, navigateToResult, navigateToUserProfile } from "../utilities/routerFunctions.js";

export default {
    async mounted() {
        const button = document.getElementById('createBlog');
        button.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById("blogForm").style.display = "block";
        });

        const closeButton = document.getElementById("closeButton");
        closeButton.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById("blogForm").style.display = "none";
        });

        const submitButton = document.getElementById("submitButton");
        submitButton.addEventListener('click', async (e) => {
            e.preventDefault();
            const blogTitle = document.getElementById("title").value;
            try {
                
                const blogId = await createBlog(blogTitle);
                sessionStorage.setItem(blogId, JSON.stringify({
                    'title' : blogTitle
                }));

                // next(`/blogs/${blogId}/1`);
                navigateToBlog(blogId, 1);
            }
            catch(error){
                const p = document.getElementById('errorText');
                p.style.color = "red";
    
                if (!error.response) {
                    p.innerText = "An unknown error occured.";
                    console.log(error);
                }
                else {
                    switch (error.response.status) {
                        case(409):
                            p.innerText = "Title is already in use.";
                            break;
                        case(401):
                            p.innerText = "Unauthorized access.";
                            navigateToLogin();
                            break;
                        default:
                            p.innerText = "An unknown error occured.";
                            console.log(error.response.status);
                            break;
                    }
                }
            };
        });

        const userProfileButton = document.createElement("button");
        userProfileButton.innerText = "go to your profile";

        userProfileButton.addEventListener('click', async (e) => {
            e.preventDefault();

            try {
                const currentUserUsername = await getCurrentUserProfile();
                navigateToUserProfile(currentUserUsername);
            }
            catch (error) {
                if(error.response && error.response.status === 401) {
                    navigateToLogin();
                }
                else if(error.response && error.response.status === 404) {
                    const p = document.getElementById('errorText');
                    p.innerText = "couldn't find your account";
                }
                else {
                    navigateToLogin();
                }
            }
        });

        const body = document.getElementById("body");
        body.appendChild(userProfileButton);

        const blogsDiv = document.createElement("div");
        setUpBlogsDiv(blogsDiv);
        body.appendChild(blogsDiv);

        try {
            const publishedBlogs = await getAllPublishedBlogs();
            loadBlogs(publishedBlogs, blogsDiv);
        }
        catch (error) {
            if(error.response && error.response.status === 401) {
                navigateToLogin();
            }
        }

        const searchInput = document.getElementById("search-input");
        searchInput.addEventListener("keyup", (e) => {
            this.handleSearch(e);
        });
    },
    methods: {
        handleSearch(e) {
            if(e.keyCode === 13) {
                const searchTerm = document.getElementById("search-input").value;
                if (searchTerm) {
                    const encodedTitle = encodeURI(searchTerm);
                    // next(`/result/${encodedTitle}`);
                    navigateToResult(encodedTitle);
                }
            }
        },
      },
}