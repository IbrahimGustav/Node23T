const checkCondition = (weather)=>{
    let h = weather["humidity"]
    let t = weather["temperature"]
    let s = weather["winSpeed"]

    if (t>= 20 && t <=30){
        if (h > 50){
            if (s <15){
                return `The weather is suitable for planting, so no warning`
            }
        }
    }
    
};

module .exports = {checkCondition}