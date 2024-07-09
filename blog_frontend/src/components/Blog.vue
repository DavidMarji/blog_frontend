<template>
    <div class="blog-container">
        <div id="blog">
            <div id="titleDiv">
                <p id="title">Title</p>
            </div>

            <div id="pageContentDiv">
                <p id="pageContent">Content</p>
            </div>

            <div id="pageNumberDiv">
                <p id="pageNumber">1</p>
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
    background-color: white;
    border: 1px solid #ddd;
    width: 45vw;
    height: 95vh;
    justify-content: center;
    display: block;
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
}

</style>