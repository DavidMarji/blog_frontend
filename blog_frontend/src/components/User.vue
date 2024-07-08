<template>
    <div>
        <div id="titleDiv">
            <p id="title"></p>
        </div>
        <div id="body">
            
        </div>
    </div>
</template>

<script src="../scripts/userProfile.js">
</script>

<style>
#title {
    font-size : 1.8rem;
}

#titleDiv {
    position: absolute;
    left: 50%;
    top: 2%;
    -ms-transform: translate(-50%);
    transform: translate(-50%);
}

.row {
    display: flex;
}

.column {
    flex: 10;
    border: 1px solid black;
    padding: 10px;
    text-align: center;
}
</style>