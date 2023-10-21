/* eslint-disable no-unused-vars */

/**
 * display size categories in REM
 */
export enum DisplaySize {
    XS = 0,
    S = 40,
    M = 60,
    L = 80,
    XL = 100,
    XXL = 120,
}

/**
 * Get the current display size
 * @return {DisplaySize} the current display size category
 */
export function getDisplaySize(): DisplaySize {
    const widthPX = window.innerWidth
    const width = pxToRem(widthPX)
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

/**
 * CHeck if display is so small that mobile optimized content should eb displayed
 * @param displaySize
 */
export function isMobile(displaySize: DisplaySize): boolean{
    return displaySize <= DisplaySize.S
}

/**
 * convert px to rem
 * @param px
 * @param base
 */
function pxToRem(px: number, base = 16): number {
    return (1 / base) * px
}