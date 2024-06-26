<template>
    <div>
        <div>
            <p id="title">User: {{ username }}</p>
        </div>
        <div id="body">
            
        </div>
    </div>
</template>

<script src="../scripts/userProfile.js">
</script>

<style>
#title {
    font-size : "xxx-large";
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