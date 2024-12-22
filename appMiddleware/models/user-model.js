const dataUser = ["Andi", "Bob", "Ciro"]
const getUser = () => {
    return dataUser
}

const getUserByIndex = (id)=>{
    if(id < dataUser.length + 1){
        return dataUser[id - 1]
    }
    return "Index is greater than Array Length"
}

module.exports = {getUser,getUserByIndex}