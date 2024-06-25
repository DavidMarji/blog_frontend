<template>
    <div>
        <label>SignUp In</label>
        <div>
            <div>
                <input type="text" name="username" id="username" placeholder="Username" required>
            </div>
            <div>
                <input type="text" name="email" id="email" placeholder="Email" required>
            </div>
            <div>
                <input type="password" name="password" id="password" placeholder="Password" required>
            </div>
            <div>
                <button id="submitButton">Submit</button>
                <router-link to="/login">Click here if you already have an account</router-link>
            </div>
        </div>
    </div>
</template>

<script>
</script>

<style>
</style>