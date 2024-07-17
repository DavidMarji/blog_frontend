<script defer>
import { getSpecificPage, createNewPage, updatePage, deletePage } from "../service/pageService";
import { getBlogById, updateBlogTitle, publishBlog, deleteBlog, unpublishBlog } from '../service/blogService.js'
import { saveImage, deleteImage } from "../service/imageService.js";
import Editor from '@tinymce/tinymce-vue';
import { getTinymce } from '@tinymce/tinymce-vue/lib/cjs/main/ts/TinyMCE';

export default {
  components: {
    Editor
  },
  methods: {
    observeImageDeletions : async function observeImageDeletions() {
      const tinymce = await getTinymce();
      const targetNode = tinymce.activeEditor.getBody();

      const config = { childList: true, subtree: true };

      const callback = (mutationsList, observer) => {
          for (const mutation of mutationsList) {
            console.log(mutation);
              if (mutation.type === 'childList') {
                  mutation.removedNodes.forEach(async node => {
                      if (node.nodeName==="IMG" && node.getAttribute('id')) {
                          const imageId = node.getAttribute('id');
                          const id = this.$route.params.id;
                          const pageNumber = this.$route.params.pageNumber;

                          console.log("save imageId in session Storage and delete it later when click save");
                      }

                      node.childNodes.forEach(async child => {

                      });
                  });
                  const nextSibling = mutation.nextSibling;
                  if(nextSibling && nextSibling.nodeName === "IMG" && nextSibling.getAttribute('id')) {
                      const imageId = node.getAttribute('id');
                      const id = this.$route.params.id;
                      const pageNumber = this.$route.params.pageNumber;
                      
                      console.log("save imageId in session Storage and delete it later when click save");
                  }
                  
              }
          }
      };

      const observer = new MutationObserver(callback);
      observer.observe(targetNode, config);
    },

    dataURLToBlob : function dataURLToBlob(dataURL) {
      const [header, base64] = dataURL.split(',');
      const mime = header.match(/:(.*?);/)[1];
      const binary = atob(base64);
      const array = [];
      for (let i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
      }
      return new Blob([new Uint8Array(array)], { type: mime });
    },

    fetchBlog : async function fetchBlob(blobUrl) {
      const response = await fetch(blobUrl);
      const blob = await response.blob();
      return blob;
    },

    uploadImage : async function uploadImage(blogId, pageNumber, src) {
      if (src.startsWith('data:image/')) {
        const blob = this.dataURLToBlob(src);
        const formData = new FormData();
        formData.append('image', blob, 'image.png');
        
        try {
          const response = await saveImage(blogId, pageNumber, formData);
          return response;
        } 
        catch (error) {
          console.error('Error uploading image:', error);
          return '';
        }
      }
      else if (src.startsWith('blob:')) {
        try {

          const blob = await fetchBlob(src);
          const file = new File([blob], 'image.png', { type: blob.type });
          const formData = new FormData();
          formData.append('image', file);
  
          const response = await saveImage(blogId, pageNumber, formData);
          return response;
        }
        catch (error) {
          console.log("Error uploading blog image", error);
          return '';
        }
      }
      return '';
    }
  },

  data() {
      const apiKey = import.meta.env.VITE_TINY_MCE_API_KEY;
      return {
        apiKey,
        editorInit : {
          height: 500,
          menubar: false,
          plugins: 'link image code',
          toolbar: 'undo redo | formatselect | bold italic | alignleft aligncenter alignright | code',
          init_instance_callback: async (editor) => {

            await editor.on('KeyDown', async (e) => {

              if((e.keyCode == 8 || e.keyCode == 46) && editor.selection) {
                await this.observeImageDeletions();
              }
            });
          }
        }
      }
  },
  async mounted() {
    setTimeout(async () => {
        const tinymce = await getTinymce();
        const id = this.$route.params.id;
        const number = this.$route.params.pageNumber;
  
        const title = document.getElementById("title");
        const pageNumber = document.getElementById("pageNumber");
        const pageContentDiv = document.getElementById("pageContentDiv");
        const pageContent = tinymce.activeEditor;
  
        let publishStatus;
        let pageLength;
  
        try {
          const blog = await getBlogById(id);
          pageLength = parseInt(blog.number_of_pages, 10);
          publishStatus = blog.published;
          title.innerText = sessionStorage.getItem(id) ? 
            (JSON.parse(sessionStorage.getItem(id)).title 
              ? JSON.parse(sessionStorage.getItem(id)).title
              : blog.title)
          : blog.title;

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
          this.page = page;
          pageNumber.innerText = page.page_number;

          pageContent.setContent(sessionStorage.getItem(id) ? 
            (JSON.parse(sessionStorage.getItem(id))[number] 
                ? (JSON.parse(sessionStorage.getItem(id))[number].pageContent 
                    ? JSON.parse(sessionStorage.getItem(id))[number].pageContent 
                    : page.page_content) 
                : page.page_content)
            : page.page_content);
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
            const deleteBlogButton = document.createElement("button");
            deleteBlogButton.innerText = "Delete Blog";
  
  
            const saveButton = document.createElement("button");
            saveButton.innerText = "Save";
  
  
            const deleteButton = document.createElement("button");
            deleteButton.innerText = "Delete Page";
  
  
            const createButton = document.createElement("button");
            createButton.innerText = "Create Page";
  
  
            const publishButton = document.createElement("button");
            publishButton.innerText = "Publish Blog";
  
  
            const topDiv = document.getElementById("topButtons");
            topDiv.appendChild(saveButton);
            topDiv.appendChild(deleteButton);
            topDiv.appendChild(createButton);
            topDiv.appendChild(publishButton);
            topDiv.appendChild(deleteBlogButton);
  
            pageContent.on('change', function() {
              const blogSession = sessionStorage.getItem(id);
              if(blogSession) {
                const realSession = JSON.parse(blogSession);
                realSession[number] = {
                    'pageContent' : pageContent.getContent()
                };
            
                sessionStorage.setItem(id, JSON.stringify(realSession));
              }
              else {
                const realSession = { id : {
                    'title' : title.innerText,
                  } 
                };

                realSession[number] = {
                  'pageContent' : pageContent.getContent()
                };

                sessionStorage.setItem(id, JSON.stringify(realSession));
              }
            });



            title.addEventListener('click', function() {
                title.setAttribute("contenteditable", true);
            });
  
  
            title.addEventListener('input', function() {
                const blogSession = sessionStorage.getItem(id);
                if(blogSession) {
                  const realSession = JSON.parse(blogSession);
                  realSession.title = title.innerText;
                  sessionStorage.setItem(id, JSON.stringify(realSession));
                }
                else {
                  const realSession = { id : {
                      'title' : title.innerText,
                    } 
                  };

                  sessionStorage.setItem(id, JSON.stringify(realSession));
                }
            });
  
            publishButton.addEventListener('click', async (e) => {
                e.preventDefault();
  
                try {
                    const published = await publishBlog(id);
                    sessionStorage.removeItem(id);
                    location.reload();
                }
                catch (error) {
                    if(error.response) {
                        switch(error.response.status){
                            case(401):
                                window.location.href = "/home";
                                break;
                            case(404):
                                alert("failed to update blog title because it was not found in the database");
                                window.location.href = "/home";
                                break;
                            case(409):
                                alert("blog already published");
                                break;
                            default:
                                alert("unknown error occured with response code", error.response.status);
                                console.log(error);
                                break;
                        }
                    }
                    else {
                        alert("an unknown error occured");
                        console.log(error);
                    }
                }
            });
  
  
            saveButton.addEventListener('click', async (e) => {
                e.preventDefault();
  
                try {
                    if(title.innerText.length < 5) throw new Error("Title can't be empty");
                    const updatedBlog = await updateBlogTitle(id, title.innerText);

                    const blogSession = sessionStorage.getItem(id);

                    if(blogSession) {
                      const realSession = JSON.parse(blogSession);
                      for(let i = 1; i <= pageLength; i++) {
                          const pageJson = realSession[i];
                          if(pageJson){
                            const parser = new DOMParser();
                            const doc = parser.parseFromString(pageJson.pageContent, 'text/html');
                            const images = doc.querySelectorAll('img');

                            for(const image of images) {  
                              if(image.getAttribute('id')) continue;

                              const imageJson = await this.uploadImage(id, i, image.src);
                              if(imageJson){
                                image.src = imageJson.imageUrl;
                                image.setAttribute('id', imageJson.image.id);
                              } 

                            }
                            const updated = await updatePage(id, i, doc.body.innerHTML);
                          }
                      }
                    }

                    sessionStorage.removeItem(id);
                    alert("successfuly saved the blog's changes");
                    location.reload();
                }
                catch (error) {
                    if(error.response) {
                        switch(error.response.status){
                            case(401):
                                window.location.href = "/home";
                                break;
                            case(404):
                                alert("failed to save blog changes because the blog and/or pages were not found in the database");
                                window.location.href = "/home";
                                break;
                            case(400):
                                alert("failed to save because an invalid page number (< 1) was sent");
                                break;
                            default:
                                alert("unknown error occured with response code", error.response.status);
                                console.log(error);
                                break;
                        }
                    }
                    else {
                        alert("an unknown error occured");
                        console.log(error);
                    }
                }
            });
  
            createButton.addEventListener('click', async (e) => {
                e.preventDefault();

                try {
                    const createdPage = await createNewPage(id);
                    window.location.href = `/blogs/${id}/${pageLength + 1}`;
                }
                catch (error) {
                    if(error.response) {
                        switch(error.response.status){
                            case(401):
                                window.location.href = "/home";
                                break;
                            case(404):
                                alert("failed to create a new page because it was not found");
                                window.location.href = "/home";
                                break;
                            case(409):
                                alert("blog has already been published, can't create a new page");
                                break;
                            default:
                                alert("unknown error occured with response code", error.response.status);
                                console.log(error);
                                break;
                        }
                    }
                    else {
                        alert("an unknown error occured");
                        console.log(error);
                    }
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
  
                    const blogSession = sessionStorage.getItem(id);

                    if(blogSession) {
                      let realSession = JSON.parse(blogSession);
                      if(realSession[number]) {
                        delete realSession[number];
                      }
                      console.log(pageLength);
                      for(const i = parseInt(number) + 1; i <= pageLength; i++) {
                        console.log(i, realSession[i]);
                          if(realSession[i]) {
                              realSession[i - 1] = realSession[i];
                              delete realSession[i];
                          }
                      }
                      sessionStorage.setItem(id, JSON.stringify(realSession));
                    }
  
                    window.location.href = `/blogs/${id}/${toRedirectTo}`;
                }
                catch (error) {
                    if(error.response) {
                        switch(error.response.status){
                            case(401):
                                window.location.href = "/home";
                                break;
                            case(404):
                                alert("failed to delete page because it was not found");
                                window.location.href = "/home";
                                break;
                            case(400):
                                alert("failed to delete page because an invalid page number ( < 1) was given");
                                break;
                            case(403):
                                alert("failed to delete because it is the only page, you can not delete a blog's page if it is the only one");
                                break;
                            default:
                                alert("unknown error occured with response code", error.response.status);
                                console.log(error);
                                break;
                        }
                    }
                    else {
                        alert("an unknown error occured");
                        console.log(error);
                    }
                }
  
            });
  
            const closeButton = document.getElementById("closeButton");
            closeButton.addEventListener('click', (e) => {
                e.preventDefault();
                document.getElementById("blogForm").style.display = "none";
            });
          
            deleteBlogButton.addEventListener('click', async (e) => {
                e.preventDefault();
  
                try {
                    const deleted = await deleteBlog(id);
                    sessionStorage.removeItem(id);
                    window.location.href = "/home";
                }
                catch (error) {
                    if(error.response) {
                        switch(error.response.status){
                            case(401):
                                window.location.href = "/home";
                                break;
                            case(404):
                                alert("failed to delete blog because it was not found in the database");
                                window.location.href = "/home";
                                break;
                            default:
                                alert("unknown error occured with response code", error.response.status);
                                console.log(error);
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
        else {
            pageContent.getBody().setAttribute('contenteditable', false);
            pageContent.mode.set('readonly');
            const toolbars = document.getElementsByClassName('tox-editor-header');
            toolbars[0].style.display = 'none';

            try {
                const rows = await unpublishBlog(id);
                const rowsPublished = await publishBlog(id);
  
                const topDiv = document.getElementById("topButtons");
                const unpublishButton = document.createElement("button");
                unpublishButton.innerText = "Unpublish the blog";
                topDiv.appendChild(unpublishButton);
  
                unpublishButton.addEventListener('click', async (e) => {
                    e.preventDefault();
                    try {
                        const a = await unpublishBlog(id);
                        location.reload();
                    }
                    catch (error) {
                        if(error.response.status === 401) window.location.href = "/home";
                        else if (error.response.status === 404){
                            alert("blog or user was not found");
                            window.location.href = "/home";
                        }
                        else if(error.response.status === 409) {
                            alert("can not unpublish an already private blog");
                            location.reload();
                        }
                        else {
                            alert("an unknown error occured");
                            window.location.href = "/home";
                        }
                    }
                });
            }
            catch(error) {
            };
        }
  
        const nextButton = document.getElementById('next');
        const backButton = document.getElementById('back');
  
        if(parseInt(number, 10) === pageLength) {
            nextButton.style.display = "none";
        }
        else {
            nextButton.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = `/blogs/${id}/${parseInt(number) + 1}`;
            });
        }
  
        if(parseInt(number, 10) === 1) {
            backButton.style.display = "none";
        }
        else {
            backButton.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = `/blogs/${id}/${parseInt(number) - 1}`;
            });
        }
    }, "500");
  },
}
</script>


<template>


<div class="blog-container">
    <div id="blog">
      <div id="titleDiv">
        <p id="title"></p>
      </div>


    <Editor
      id="pageContent"
      :api-key="apiKey"
      ref="editor"
      :init="editorInit"
    />


    <div id="pageContentDiv">
      <div id="pageNumberDiv">
        <p id="pageNumber"></p>
      </div>
    </div>
  </div>


  <div id="topButtons"></div>


  <div id="bottomButtons">
    <div>
      <button id="back">previous page</button>
    </div>
    <div>
      <button id="next">next page</button>
    </div>
  </div>


  <div class="form-popup" id="blogForm">
    <h1>Upload an Image</h1>


    <input type="file" name="imageUpload" id="imageUpload" required />


    <button type="submit" id="submitButton">Submit</button>
    <button type="button" id="closeButton">Close</button>
  </div>
</div>
</template>


<style scoped>
.blog-container {
 display: flex;
 justify-content: center;
 height: 100vh;
 background-color: WhiteSmoke;
 padding: 10px;
 box-sizing: border-box;
 position: relative;
}


.blog-container #blog {
 display: block;
 background-color: white;
 border: 1px solid #ddd;
 width: 45vw;
 height: 95vh;
 justify-content: center;
 box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
 box-sizing: border-box;
 position: relative;
 overflow: auto;
 margin-top: 0px;
}


#topButtons {
 position: absolute;
 top: 20px;
 left: 20px;
 display: flex;
 flex-wrap: wrap;
 gap: 10px;
 z-index: 1;
 max-width: 20vw;
}


#bottomButtons {
 position: absolute;
 bottom: 0px;
 left: 50%;
 transform: translateX(-50%);
 display: flex;
 gap: 5px;
}


#bottomButtons button {
 padding: 5px 10px;
}


.blog-container #titleDiv {
 position: relative;
 text-align: center;
 padding: 5px;
}


.blog-container #pageContentDiv {
 display: grid;
 grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
 gap: 10px;
 position: relative;
 margin: 5px;
}


.blog-container #pageNumberDiv {
 position: absolute;
 bottom: 10px;
 right: 10px;
 text-align: right;
}


#pageContent {
 margin: auto;
 width: 38vw;
 height: 83vh;
 overflow-y: auto;
 overflow-x: hidden;
 white-space: pre-wrap;
 position: relative;
 object-fit: contain;
 top: 20px;
}


/* Adjust the editor's container to fit within the page */
:deep(.tox) {
 width: 100%;
 height: 100%;
 box-sizing: border-box;
}


.form-popup {
 display: none;
 position: absolute;
 left: 3%;
 top: 90%;
 -ms-transform: translate(-5%, -90%);
 transform: translate(-5%, -90%);
 background-color: #f1f1f1;
 width: 300px;
 padding: 15px;
 z-index: 1;
}


.form-popup form {
 max-width: 100%;
}


.form-popup form input[type="file"],
.form-popup form button {
 width: 100%;
 margin: 5px 0;
}


.form-popup {
 color: black;
 border: none;
 cursor: pointer;
}


#pageContentDiv img {
 max-width: 100%;
 height: auto;
 display: block;
 margin: 10px 0;
}


#pageContentDiv.image-container img {
 margin-left: auto;
}


#pageContentDiv {
 display: flex;
 flex-direction: column;
 align-items: center;
 margin: 5px;
 position: relative;
}
#pageNumberDiv {
 align-self: flex-end;
 margin: 10px;
}
</style>