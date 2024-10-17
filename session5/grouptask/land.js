const landCondition = (land) => {
    let fertile = 0;
    for (let i = 0; i < land.length; i++) {
        let rowFertile = 0;
        for (let j = 0; j < land[i].length; j++) {
            if (land[i][j] === "fertile") {
                rowFertile++;
            }
        }
        if (rowFertile > 1) {
            fertile += rowFertile;
        }
    }
    return fertile;
}

module .exports ={landCondition}