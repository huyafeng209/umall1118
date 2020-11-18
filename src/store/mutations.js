export const state={
    //初始值
    userInfo:sessionStorage.getItem("userInfo")?JSON.parse(sessionStorage.getItem("userInfo")):{}
}
export const mutations={
    changeUserInfo(state,obj){
        state.userInfo=obj
        if(obj.token){
            sessionStorage.setItem("userInfo",JSON.stringify(obj))
        }else{
            sessionStorage.removeItem("userInfo")
        }
    }
}
export const getters={
    userInfo(state){
        return state.userInfo
    }
}