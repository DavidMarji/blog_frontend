import { getAllUserPublishedBlogs } from "../service/blogService";

export default {
    mounted() {
        getAllUserPublishedBlogs(this.$route.params.username)
        .then(publishedBlogs => {
            const body = document.getElementById(body);
            const newDiv = document.createElement("div");
            const divP = document.createElement("p");
            const textNode = document.createTextNode("Blogs");

            newDiv.style.position = "absolute";
            newDiv.style.top = "50%";
            newDiv.style.left = "50%";
            newDiv.style.msTransform = 'translate(-50%, -50%)';
            newDiv.style.transform = 'translate(-50%, -50%);';
            divP.style.fontSize = "x-large";

            body.appendChild(newDiv);
            newDiv.appendChild(divP);
            divP.appendChild(textNode);
            
            for(let i = 0; i < Math.floor(publishedBlogs.length/5); i++) {
                const newRow = document.createElement("div");
                newRow.className = "row";
                body.appendChild(newRow);

                for(let k = 0; (i*5) + k < publishedBlogs.length && k < 5; k++) {
                    const newCol = document.createElement("div");
                    newCol.className = "column"
                    newRow.appendChild(newCol);

                    newCol.appendChild(documnet.createTextNode(publishedBlogs[(i*5) + k].title));
                }
            }
        })
        .catch(error => {
            const p = document.getElementById('title');
            p.style.color = "red";
            p.style.fontSize = "xx-large";
            if(!error.response) {
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
                        p.innerText = "An unknown error occured.";
                }
            }
        });
    },
}