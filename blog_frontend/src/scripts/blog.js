import { getSpecificPage, createNewPage, updatePage, deletePage } from "../service/pageService";
import { getBlogById } from '../service/blogService.js'

export default {
    mounted() {
        const title = document.getElementById("title");
        const pageNumber = document.getElementById("pageNumber");
        const pageContent = document.getElementById("pageContent");

        getBlogById(this.$route.params.id, {})
        .then(blog => {
            title.innerText = blog.title;

            getSpecificPage(this.$route.params.id, this.$route.params.pageNumber, {})
            .then(page => {
                pageNumber.innerText = page.page_number;
                pageContent.innerText = page.page_content;
            })
            .catch(error => {
                console.log(error);
            });
        })
        .catch(error => {
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
        });
        
    },
}