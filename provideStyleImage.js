async function provideStyleImage(map)
{
    map.on('styleimagemissing', async (e) => {
        console.log("Map tried to load a non-existing image.")
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
                        <polygon points="0, 0, 90, 50, 0, 100" fill="#FFFFFF" />
                    </svg>`;


        // Convert SVG to Data URL
        const svgDataUrl = 'data:image/svg+xml;base64,' + btoa(svg);
        // load the svg arrow using a custom function that supports the await
        let img = await loadImage(svgDataUrl);
        let img1 = await map.loadImage("data/images/arrow.png");
		let img2 = await map.loadImage("data/images/arrow-big.png");
        map.addImage('arrow-white', img);
        map.addImage('arrow-sdf', img1.data,  { sdf: true });
        map.addImage('arrow-big-sdf', img2.data,  { sdf: true });




        let circleIMG = await map.loadImage("data/images/circle.png");
        map.addImage('circle', circleIMG.data, { sdf: true });
    })
}

function loadImage(url) {
    return new Promise((resolve, reject) => {
        const img = new Image(100, 100);
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = url;
    });
}