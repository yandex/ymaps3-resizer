export const numToPx = (num: number): string => {
    return num + 'px';
};

export const calculateNewSize = (event: MouseEvent, rect: DOMRect) => {
    const width = event.clientX - rect.left;
    const height = event.clientY - rect.top;
    return {width, height};
};
