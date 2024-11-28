// Export windowheight
export default function getWindowHeight() {
    if (typeof window !== 'undefined') {
        return window.innerHeight;
    }
    // Return a default value if `window` is not available
    return 0;
}
