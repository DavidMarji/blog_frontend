import { getSpecificPage, createNewPage, updatePage, deletePage } from "../service/pageService";
import { getBlogById } from '../service/blogService.js'

export default {
    async mounted() {
        const title = document.getElementById("title");
        const pageNumber = document.getElementById("pageNumber");
        const pageContent = document.getElementById("pageContent");
        let publishStatus;

        try {
            const blog = await getBlogById(this.$route.params.id, {});
            console.log(blog);
            publishStatus = blog.published;
            title.innerText = blog.title;
        }
        catch(error) {
            if(error.response !== undefined) {
                switch(error.response.status) {
                    case(404):
                        title.innerText = "The blog does not exist";
                        break;
                    default:
                        title.innerText = "An unknown error occured";
                        break;
                }
            }

            console.log(error);
        }
        
        try {
            const page = await getSpecificPage(this.$route.params.id, this.$route.params.pageNumber, {});
            pageNumber.innerText = page.page_number;
            pageContent.innerText = page.page_content;
        }
        catch(error) {
            console.log(error);
        };

        if(!publishStatus) {
            const saveButton = document.createElement("button");
            saveButton.innerText = "Save Page";

            const deleteButton = document.createElement("button");
            deleteButton.innerText = "Delete Page";

            const createButton = document.createElement("button");
            createButton.innerText = "Create Page";

            const publishButton = document.createElement("button");
            publishButton.innerText = "Publish Blog";

            const uploadImage = document.createElement("button");
            uploadImage.innerText = "Upload Image";

            const topDiv = document.getElementById("topButtons");
            topDiv.appendChild(saveButton);
            topDiv.appendChild(deleteButton);
            topDiv.appendChild(createButton);
            topDiv.appendChild(publishButton);
            topDiv.appendChild(uploadImage);

            saveButton.addEventListener('click', async (e) => {
                e.preventDefault();

            });
        }
        else {
            
        }
    },
}