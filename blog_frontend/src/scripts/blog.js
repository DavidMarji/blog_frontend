import { getSpecificPage, createNewPage, updatePage, deletePage } from "../service/pageService";
import { getBlogById, updateBlogTitle, publishBlog } from '../service/blogService.js'

export default {
    async mounted() {
        const id = this.$route.params.id;
        const number = this.$route.params.pageNumber;

        const title = document.getElementById("title");
        const pageNumber = document.getElementById("pageNumber");
        const pageContent = document.getElementById("pageContent");
        let publishStatus;
        let pageLength;
        try {
            const blog = await getBlogById(id);
            pageLength = parseInt(blog.number_of_pages, 10);
            publishStatus = blog.published;
            title.innerText = blog.title;
        }
        catch(error) {
            title.style.color = 'red';
            if(error.response !== undefined) {
                switch(error.response.status) {
                    case(404):
                        title.innerText = "The blog does not exist";
                        break;
                    case(401):
                        window.location.href = '/home';
                        break;
                    case(409):
                        title.innerText = "Blog Id must be a number";
                        break;
                    default:
                        title.innerText = "An unknown error occured";
                        break;
                }
            }
            else {
                title.innerText = "An unknown error occured";
                console.log(error);
            }

            throw error;
        }
        let page;
        try {
            page = await getSpecificPage(id, number);
            pageNumber.innerText = page.page_number;
            pageContent.innerText = sessionStorage.getItem(page.id) ? JSON.parse(sessionStorage.getItem(page.id)).pageContent : page.page_content;
        }
        catch(error) {
            title.style.color = 'red';
            if(error.response !== undefined) {
                switch(error.response.status) {
                    case(404):
                        title.innerText = "The page does not exist";
                        break;
                    case(401):
                        window.location.href = '/home';
                        break;
                    case(400):
                        title.innerText = 'Page number must be greater than 0';
                        break;
                    case(409):
                        title.innerText = "Page number must be a number";
                        break;
                    default:
                        title.innerText = "An unknown error occured";
                        break;
                    }
                }
                else {
                    title.innerText = "An unknown error occured";
                    console.log(error);
                }
                throw error;
        };

        if(!publishStatus) {
            const saveButton = document.createElement("button");
            saveButton.innerText = "Save";

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

            title.addEventListener('click', function() {
                title.setAttribute("contenteditable", true);
            });

            pageContent.addEventListener('click', function() {
                this.setAttribute("contenteditable", "true");
            });

            pageContent.addEventListener('input', function() {
                sessionStorage.setItem(page.id, JSON.stringify({
                    'pageContent' : pageContent.innerText,
                    'pageNumber' : page.page_number
                }));

                const numberList = sessionStorage.getItem('numberList');
                const realList = numberList ? JSON.parse(numberList) : [];
                if(!numberList) {
                    sessionStorage.setItem('numberList', JSON.stringify([page.id]));
                }
                else if(!realList.includes(page.id)) {

                    realList.push(page.id);
                    sessionStorage.setItem('numberList', JSON.stringify(realList));
                }
            });

            publishButton.addEventListener('click', async (e) => {
                e.preventDefault();

                try {
                    const published = await publishBlog(id);


                    const numberList = sessionStorage.getItem('numberList');
                    const realList = numberList ? JSON.parse(numberList) : [];
                    
                    if(numberList) {
                        for(const i of realList) {
                            sessionStorage.removeItem(i);
                        }
                        sessionStorage.removeItem('numberList');
                    }
                    location.reload();
                }
                catch (error) {
                    console.log(error);
                }
            });

            saveButton.addEventListener('click', async (e) => {
                e.preventDefault();

                try {
                    if(title.innerText.length < 5) throw new Error("Title can't be empty");
                    const updatedBlog = await updateBlogTitle(id, title.innerText);


                    const numberList = sessionStorage.getItem('numberList');
                    const realList = numberList ? JSON.parse(numberList) : [];
                    for(const i of realList) {
                        const pageJson = JSON.parse(sessionStorage.getItem(i));
                        await updatePage(id, pageJson.pageNumber, pageJson.pageContent);
                    }
                }
                catch (error) {
                    console.log(error);
                }
            });

            createButton.addEventListener('click', async (e) => {
                e.preventDefault();


                try {
                    const createdPage = await createNewPage(id);
                    window.location.href = `/blogs/${id}/${pageLength + 1}`;
                }
                catch (error) {
                    console.log(error);
                }
            });

            deleteButton.addEventListener('click', async (e) => {
                try {
                    const deletedRows = await deletePage(id, number);
                    const toRedirectTo = (pageLength === 1
                        ? 1
                        : (parseInt(number, 10) === pageLength
                            ? parseInt(number, 10) - 1
                            : parseInt(number, 10)));

                    sessionStorage.removeItem(page.id);

                    const numberList = sessionStorage.getItem('numberList');
                    const realList = numberList ? JSON.parse(numberList) : [];

                    let list = [];
                    for(const id of realList) {
                        const pageJson = JSON.parse(sessionStorage.getItem(id));
                        console.log(pageJson)

                        if(pageJson && parseInt(pageJson.pageNumber) > parseInt(number)) {

                            sessionStorage.setItem(id, JSON.stringify({
                                'pageContent' : pageJson.pageContent,
                                'pageNumber' : pageJson.pageNumber - 1
                            }));
                            list.push(id);
                        }
                        else if(pageJson && parseInt(pageJson.pageNumber) !== parseInt(number)) {
                            list.push(id);
                        }
                    }

                    sessionStorage.setItem('numberList', JSON.stringify(list));
    
                    window.location.href = `/blogs/${id}/${toRedirectTo}`;
                }
                catch (error) {
                    console.log(error);
                }
            });
        }
        else {
            
        }

        const nextButton = document.getElementById('next');
        const backButton = document.getElementById('back');

        nextButton.addEventListener('click', (e) => {
            
        });
    },
}
