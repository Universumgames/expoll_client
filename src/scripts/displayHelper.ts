export enum DisplaySize {
    XS = 0,
    S = 600,
    M = 960,
    L = 1280,
    XL = 1920,
    XXL = 2560,
}

/**
 * Get the current display size
 * @return {DisplaySize} the current display size category
 */
export function getDisplaySize(): DisplaySize {
    const width = window.innerWidth
    if (width < DisplaySize.S) {
        return DisplaySize.XS
    } else if (width < DisplaySize.M) {
        return DisplaySize.S
    } else if (width < DisplaySize.L) {
        return DisplaySize.M
    } else if (width < DisplaySize.XL) {
        return DisplaySize.L
    } else if (width < DisplaySize.XXL) {
        return DisplaySize.XL
    } else {
        return DisplaySize.XXL
    }
}