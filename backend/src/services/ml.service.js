

export const predict_next_difficulty = async (features) => {
    const next_difficulty = await fetch(`${process.env.ML_SERVICE_URL}/predict`, { 
        method : "POST", 
        headers : {
            'Content-Type': 'application/json',
        }, 
        body : JSON.stringify(features)
    })

    const result = await next_difficulty.json();
    
    return result;
}




