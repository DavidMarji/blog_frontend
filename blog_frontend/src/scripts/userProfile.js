import { getAllUserPublishedBlogs, getAllUserBlogs, getAllUserUnpublishedBlogs} from "../service/blogService";

export default {
    async mounted() {
        const username = this.$route.params.username;


        const title = document.getElementById("title");
        const titleNode = document.createTextNode(`User: ${username}`);
        title.appendChild(titleNode);

        const body = document.getElementsByTagName("body")[0];
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
        this.setUpBlogsDiv(blogsDiv);

        body.appendChild(newDiv);
        newDiv.appendChild(divP);
        divP.appendChild(textNode);
        body.appendChild(blogsDiv);

        try {
            const userBlogs = await getAllUserBlogs(username);

            const viewAllButton = document.createElement("button");
            const viewPublishedButton = document.createElement("button");
            const viewUnpblishedButton = document.createElement("button");

            viewPublishedButton.innerText = "View Published";
            viewAllButton.innerText = "View All Blogs";
            viewUnpblishedButton.innerText = "view Unpublished";

            body.appendChild(viewAllButton);
            body.appendChild(viewPublishedButton);
            body.appendChild(viewUnpblishedButton);

            this.loadBlogs(userBlogs, blogsDiv);

            viewAllButton.addEventListener('click', async (e) => {
                e.preventDefault();

                const allBlogs = await getAllUserBlogs(username);

                const blogsDiv = document.getElementById("blogsDiv");
                blogsDiv.parentNode.removeChild(blogsDiv);
                const newBlogsDiv = document.createElement("div");
                newBlogsDiv.setAttribute("id", "blogsDiv");
                this.setUpBlogsDiv(newBlogsDiv);
                body.appendChild(newBlogsDiv);

                this.loadBlogs(allBlogs, newBlogsDiv);
            });

            viewPublishedButton.addEventListener('click', async (e) => {
                e.preventDefault();

                const allPublishedBlogs = await getAllUserPublishedBlogs(username);

                const blogsDiv = document.getElementById("blogsDiv");
                blogsDiv.parentNode.removeChild(blogsDiv);
                const newBlogsDiv = document.createElement("div");
                newBlogsDiv.setAttribute("id", "blogsDiv");
                this.setUpBlogsDiv(newBlogsDiv);
                body.appendChild(newBlogsDiv);

                this.loadBlogs(allPublishedBlogs, newBlogsDiv);
            });

            viewUnpblishedButton.addEventListener('click', async (e) => {
                e.preventDefault();

                const allUnpublishedBlogs = await getAllUserUnpublishedBlogs(username);

                const blogsDiv = document.getElementById("blogsDiv");
                blogsDiv.parentNode.removeChild(blogsDiv);
                const newBlogsDiv = document.createElement("div");
                newBlogsDiv.setAttribute("id", "blogsDiv");
                this.setUpBlogsDiv(newBlogsDiv);
                body.appendChild(newBlogsDiv);

                this.loadBlogs(allUnpublishedBlogs, newBlogsDiv);
            });
        }
        catch (error) {
            console.log(error);

            getAllUserPublishedBlogs(username)
            .then(publishedBlogs => {
    
                this.loadBlogs(publishedBlogs, blogsDiv);
            })
            .catch(error => {
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
                            p.innerText = "You do not have access to this page."
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
            });
        }

    },
    methods : {
        setUpBlogsDiv : function(blogsDiv){
            blogsDiv.style.position = "absolute";
            blogsDiv.style.top = '20%';
            blogsDiv.style.width = '70%';
            blogsDiv.style.marginLeft = '15%';
            blogsDiv.style.marginRight = '15%';
            blogsDiv.style.display = 'block';
        },
        loadBlogs : function(blogs, blogsDiv){
            const numCols = 5; // Number of columns per row
            const colWidth = 100 / numCols; // Width percentage of each column

            for (let i = 0; i < Math.ceil(blogs.length / numCols); i++) {
                const newRow = document.createElement("div");
                newRow.className = "row";
                newRow.style.position = "relative";
                newRow.style.top = `${15 + (i + 1) * 5}%`; // Adjust top position

                blogsDiv.appendChild(newRow);

                for (let k = 0; (i * numCols) + k < blogs.length && k < numCols; k++) {
                    const newCol = document.createElement("div");
                    newCol.className = "column";

                    const leftPos = k * colWidth;
                    newCol.style.left = `${leftPos}%`;
                    newCol.style.width = `${colWidth}%`;
                    newCol.style.border = 'solid';
                    newCol.style.borderWidth = '1px';
                    newCol.style.paddingTop = '5px';
                    newCol.style.paddingBottom = '5px';
                    newCol.style.paddingLeft = '10px';
                    newCol.style.paddingRight = '10px';
                    newCol.style.textAlign = 'center';

                    if (k < numCols - 1) {
                        newCol.style.marginRight = '1%';
                        newCol.style.marginTop = '1%';
                    }
                    
                    // give the newCol a blogId so that we can access it when clicked
                    newCol.blogId = blogs[(i * numCols) + k].id;

                    newRow.appendChild(newCol);
                    newCol.appendChild(document.createTextNode(blogs[(i * numCols) + k].title));

                    newCol.addEventListener('click', (e) => {
                        e.preventDefault();
                        window.location.href = `/blogs/${newCol.blogId}/1`;
                    });

                    newCol.addEventListener('mouseenter', (e) => {
                        e.preventDefault();
                        newCol.style.borderColor = 'yellow';
                        newCol.style.borderWidth = '4px';
                    });

                    newCol.addEventListener('mouseleave', (e) => {
                        e.preventDefault();
                        newCol.style.borderColor = 'black';
                        newCol.style.borderWidth = '1px';
                    });
                }
            }
        }
    }   
}