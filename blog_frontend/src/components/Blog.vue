<template>
    <div class="blog-container">
        <div id="blog">
            <div id="titleDiv">
                <p id="title"></p>
            </div>

            <p id="pageContent"></p>
            <div id="pageContentDiv">

                <div id="pageNumberDiv">
                    <p id="pageNumber"></p>
                </div>
            </div>

            
        </div>

        <div id="topButtons">
        </div>

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

            <input type="file" name="imageUpload" id="imageUpload" required>

            <button type="submit" id="submitButton">Submit</button>
            <button type="button" id="closeButton">Close</button>
        </div>
    </div>
</template>

<script src="../scripts/blog.js">
</script>

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

.form-popup form input[type=file], 
.form-popup form button {
    width: 100%;
    margin: 5px 0;
}

.form-popup  {
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