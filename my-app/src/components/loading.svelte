<div></div>
<style>
    div {
        width: 100px;
        aspect-ratio: 1/1;
        background-color: rgba(80, 80, 80, 0.477);
        animation: loading .5s linear infinite;
        border-radius: 50%;
    }
    @keyframes loading {
        from {
            transform: scale(.1);
            opacity: 0;
        }
        to {
            transform: scale(1);
            opacity: 1;
        }
    }
</style>
